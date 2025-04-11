import BuzzerPopup from "@/components/BuzzerPopup";
import FinalPage from "@/components/FinalPage";
import QuestionBoard from "@/components/QuestionBoard";
import Round from "@/components/Round";
import TeamName from "@/components/TeamName";
import TitlePage from "@/components/Title/TitlePage.jsx";
import TitleSplash from "@/components/Title/TitleSplash";
import LabeledPrism from "@/components/ui/LabeledPrism";
import { ERROR_CODES } from "@/i18n/errorCodes";
import { PrismSide } from "@/lib/utils/feud-types";
import cookieCutter from "cookie-cutter";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

let timerInterval = null;

const MAX_NUM_MISTAKES = 3;

export default function Game(props) {
  const { i18n, t } = useTranslation();
  const [game, setGame] = useState({});
  const [timer, setTimer] = useState(0);
  const [error, setErrorVal] = useState("");
  const [showMistake, setShowMistake] = useState(false);
  const [numMistakes, setnumMistakes] = useState(0);
  const [isHost, setIsHost] = useState(false);
  const [buzzed, setBuzzed] = useState({});
  const [displaySide, setDisplaySide] = useState(PrismSide.Front);
  const [isSwitching, setIsSwitching] = useState(false);
  const ws = useRef(null);
  let refreshCounter = 0;

  useEffect(() => {
    if (game.is_final_round && game.final_round_timers) {
      const timerIndex = game.is_final_second ? 1 : 0;
      setTimer(game.final_round_timers[timerIndex]);
    }
  }, [game.is_final_round, game.is_final_second]);

  function setError(e) {
    setErrorVal(e);
    setTimeout(() => {
      setErrorVal("");
    }, 5000);
  }

  useEffect(() => {
    ws.current = new WebSocket(`wss://${window.location.host}/api/ws`);
    ws.current.onopen = function () {
      console.log("game connected to server");
      let session = cookieCutter.get("session");
      console.debug(session);
      if (session != null) {
        console.debug("found user session", session);
        ws.current.send(JSON.stringify({ action: "game_window", session: session }));
        setInterval(() => {
          console.debug("sending pong in game window");
          let [room, id] = session.split(":");
          ws.current.send(
            JSON.stringify({
              action: "pong",
              session: session,
              id: session.split(":")[1],
              room: session.split(":")[0],
            })
          );
        }, 5000);
      }
    };

    ws.current.onmessage = function (evt) {
      var received_msg = evt.data;
      let json = JSON.parse(received_msg);
      console.debug(json);
      if (json.action === "data") {
        console.log(json);
        if (Object.keys(buzzed).length === 0 && json.data.buzzed.length > 0) {
          let userId = json.data.buzzed[0].id;
          let user = json.data.registeredPlayers[userId];
          setBuzzed({
            id: userId,
            name: user.name,
            team: json.data.teams[user.team].name,
          });
        } else if (Object.keys(buzzed).length > 0 && json.data.buzzed.length === 0) {
          setBuzzed({});
        }
        if (json.data.title_text === "Change Me") {
          json.data.title_text = t("Change Me");
        }
        if (json.data.teams[0].name === "Team 1") {
          json.data.teams[0].name = `${t("team")} ${t("number", {
            count: 1,
          })}`;
        }
        if (json.data.teams[1].name === "Team 2") {
          json.data.teams[1].name = `${t("team")} ${t("number", {
            count: 2,
          })}`;
        }
        setGame(json.data);
        let session = cookieCutter.get("session");
        let [_, id] = session.split(":");
        if (json.data?.registeredPlayers[id] == "host") {
          setIsHost(true);
        }
      } else if (json.action === "mistake") {
        var audio = new Audio("wrong.wav");
        audio.play();
        setnumMistakes(json.data.numMistakes);
        setShowMistake(true);
        setTimeout(() => {
          setShowMistake(false);
        }, 2000);
      } else if (json.action === "quit") {
        setGame({});
        window.close();
      } else if (json.action === "reveal") {
        var audio = new Audio("good-answer.wav");
        audio.play();
      } else if (json.action === "final_reveal") {
        var audio = new Audio("fm-answer-reveal.mp3");
        audio.play();
      } else if (json.action === "final_clock_reveal") {
        var audio = new Audio("fm-clock-reveal.wav");
        audio.play();
      } else if (json.action === "duplicate") {
        var audio = new Audio("duplicate.mp3");
        audio.play();
      } else if (json.action === "final_submit") {
        var audio = json.data.points > 0 ? new Audio("fm-good-answer.wav") : new Audio("fm-wrong.wav");
        audio.play();
      } else if (json.action === "set_timer") {
        setTimer(json.data);
      } else if (json.action === "stop_timer") {
        clearInterval(timerInterval);
      } else if (json.action === "start_timer") {
        timerInterval = setInterval(() => {
          setTimer((prevTimer) => {
            if (prevTimer > 0) {
              return prevTimer - 1;
            } else {
              var audio = new Audio("fm-clock-end.wav");
              audio.play();
              clearInterval(timerInterval);

              // Send timer stop to admin.js
              try {
                let session = cookieCutter.get("session");
                let [room, id] = session.split(":");

                if (!session) {
                  console.error("No session cookie found");
                  return 0;
                }

                if (!room || !id) {
                  console.error("Invalid session cookie format");
                  return 0;
                }

                ws.current.send(
                  JSON.stringify({
                    action: "timer_complete",
                    room: room,
                    id: id,
                  })
                );
              } catch (error) {
                console.error("Error processing session cookie:", error);
              }
              return 0;
            }
          });
        }, 1000);
      } else if (json.action === "change_lang") {
        console.debug("Language Change", json.data);
        i18n.changeLanguage(json.data);
      } else if (json.action === "timer_complete") {
        console.debug("Timer complete");
      } else if (json.action === "clearbuzzers") {
        console.debug("Clear buzzers");
        setBuzzed({});
      } else {
        console.error("didn't expect", json);
      }
    };

    setInterval(() => {
      if (ws.current.readyState !== 1) {
        setError(t(ERROR_CODES.CONNECTION_LOST, { message: `${5 - refreshCounter}` }));
        refreshCounter++;
        if (refreshCounter >= 5) {
          console.debug("game reload()");
          location.reload();
        }
      } else {
        setError("");
      }
    }, 1000);
  }, []);

  let splashFace = game && (isSwitching || game.title) && <TitleSplash game={game} />;

  let gameFace = game && game.rounds && game.teams && (isSwitching || (!game.title && !game.is_final_round)) && (
    <div>
      <video loop autoPlay muted src="game-bg.mp4" className="game-video-bg"></video>
      <div className="flex h-screen flex-col space-y-10 bg-cover px-10 py-20">
        <Round game={game} isGamePage={true} isVisible={isSwitching || displaySide == PrismSide.Right} />
        <QuestionBoard round={game.rounds[game.round]} isVisible={isSwitching || displaySide == PrismSide.Right} />
      </div>
    </div>
  );

  let finalRoundFace = game && (isSwitching || game.is_final_round) && (
    <div>
      <div className="fm-bg-overlay-container h-screen w-screen" style={{ zIndex: 5, backgroundColor: "black" }}></div>
      <div className="fm-bg-overlay-container h-screen w-screen">
        <img className="fm-bg-overlay" src="fm-bg-transparent.png"></img>
      </div>
      <div className="flex h-screen w-screen justify-center">
        <FinalPage game={game} timer={timer} isVisible={isSwitching || displaySide == PrismSide.Left} />
      </div>
    </div>
  );

  var splashAndSwitch = (side) => {
    setIsSwitching(true);
    setTimeout(() => {
      setDisplaySide(PrismSide.Front);
    }, 1000);
    setTimeout(() => {
      setDisplaySide(side);
    }, 2000);
    // setTimeout(() => {
    //   setIsSwitching(false);
    // }, 3000);
  };

  useEffect(() => {
    if (game.title) {
      splashAndSwitch(PrismSide.Front);
    } else if (game.is_final_round && displaySide != PrismSide.Left) {
      splashAndSwitch(PrismSide.Left);
    } else if (!game.is_final_round && displaySide != PrismSide.Right) {
      splashAndSwitch(PrismSide.Right);
    }
  }, [game]);

  if (game.teams) {
    if (typeof window !== "undefined") {
      document.body.className = game?.settings?.theme;
    }
    return (
      <>
        {!isHost ? (
          <div className="absolute flex w-screen flex-col items-end">
            <button
              className="m-1 rounded-lg bg-secondary-500 p-2 font-bold uppercase shadow-md hover:bg-secondary-200"
              onClick={() => {
                cookieCutter.set("session", "");
                window.location.href = "/";
              }}
            >
              {t("quit")}
            </button>
          </div>
        ) : null}
        <div className={`pointer-events-none fixed z-50 flex h-screen w-screen items-center justify-center`}>
          {[...Array(MAX_NUM_MISTAKES)].map((x, index) => (
            <Image
              id="xImg"
              width={10000}
              height={10000}
              style={{
                width: `${showMistake && numMistakes > index ? "30%" : "0px"}`,
                padding: "1rem",
              }}
              className={`pointer-events-none ${showMistake && numMistakes > index ? "transform-show opacity-100" : "transform-hide opacity-0"} transition-bounce`}
              src="/x.png"
              alt="Mistake indicator"
              aria-hidden={!showMistake}
            />
          ))}
        </div>
        <div className={`${game?.settings?.theme} min-h-screen`}>
          <div className="">
            <LabeledPrism
              currentSide={displaySide}
              frontLabel={splashFace}
              leftLabel={finalRoundFace}
              rightLabel={gameFace}
              width={window.innerWidth}
              height={window.innerHeight}
              depth={window.innerWidth}
              margins={"0px"}
              sceneClassName={"splash"}
              faceClassName={"splash"}
            />
            {error !== "" ? <p className="text-2xl text-failure-700">{error}</p> : null}
          </div>
        </div>
        <BuzzerPopup buzzed={buzzed} />
      </>
    );
  } else {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center space-y-10">
        <p>{t("No game session. retry from the admin window")}</p>
        <button
          className="m-1 rounded-lg bg-secondary-500 p-2 font-bold uppercase shadow-md hover:bg-secondary-200"
          onClick={() => {
            window.location.href = "/";
          }}
        >
          {t("quit")}
        </button>
      </div>
    );
  }
}
