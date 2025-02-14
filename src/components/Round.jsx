import { useTranslation } from "react-i18next";
import "@/i18n/i18n";

const POINT_TRANSITION_TIME_SEC = 1;

function RoundPointTally(props) {
  const { t } = useTranslation();

  const id = `pts-${props.team}`;
  const frontId = `${id}-front`;
  const backId = `${id}-back`;
  const elem = document.getElementById(id);

  // flip only if point value is changing
  const currValue = parseInt(elem?.innerText ?? "0");
  const areFlipping = currValue != props.points;

  var isFlipped = elem?.getAttribute("data-flipped") == "true";
  isFlipped = areFlipping ? !isFlipped : isFlipped;

  // whatever is currently showing stays til 1/2-way
  // then other one shows
  if (elem && areFlipping) {
    const front = document.getElementById(frontId);
    const back = document.getElementById(backId);
    setTimeout(
      () => {
        if (isFlipped) {
          front.innerText = "";
          back.innerText = t("number", { count: props.points });
        } else {
          front.innerText = t("number", { count: props.points });
          back.innerText = "";
        }
      },
      POINT_TRANSITION_TIME_SEC * 0.35 * 1000
    );
  }

  const labelValue = (isFront) => {
    // isFlipped = areFlipping ? NEXT value : CURRENT value
    // eg.  isFlipped && areFlipping => we are currently not flipped, and are going to flip
    //      isFlipped && !areFlipping => we are currently flipped, and are not going to flip

    if (isFront) {
      if (isFlipped) {
        // if we are switching to flipped, front should show initially
        return areFlipping ? currValue : "";
      } else {
        // if we are switching to unflipped, front should be empty initially
        return areFlipping ? "" : currValue;
      }
    } else {
      if (isFlipped) {
        // if we are switching to flipped, back should be empty initially
        return areFlipping ? "" : currValue;
      } else {
        // if we are switching to unflipped, back should show initially
        return areFlipping ? currValue : "";
      }
    }
  };

  return (
    <div
      className={`${props.team == "total" ? "round-points" : "team-points drop-shadow"} ${props.isGamePage ? "game-page" : "buzzer-page drop-shadow"}`}
    >
      <div
        id={id}
        style={{ transitionDuration: `${POINT_TRANSITION_TIME_SEC}s` }}
        data-flipped={isFlipped}
        className={`points-container text-3d ${isFlipped ? "rotate-y-180" : ""}`}
      >
        <div id={frontId} class="label-front">
          {labelValue(true)}
        </div>
        <div id={backId} class="label-back">
          {labelValue(false)}
        </div>
      </div>
    </div>
  );
}

export default function Round(props) {
  const { t } = useTranslation();
  let current_round = props.game.round;
  let round = props.game.rounds[current_round];
  return (
    <div className="flex w-auto flex-col items-center space-y-1">
      <div className={`flex h-28 flex-row justify-between ${props.isGamePage ? "w-screen" : "w-full"}`}>
        <RoundPointTally points={props.game.teams[0].points} team={1} isGamePage={props.isGamePage} />
        <RoundPointTally
          points={props.game.point_tracker[props.game.round]}
          team="total"
          isGamePage={props.isGamePage}
        />
        <RoundPointTally points={props.game.teams[1].points} team={2} isGamePage={props.isGamePage} />
      </div>

      <div className="flex flex-row justify-center">
        {round.multiply > 1 ? (
          <div>
            <p id="roundMultiplyText" className="text-start text-2xl text-foreground">
              x{t("number", { count: round.multiply })}
            </p>
          </div>
        ) : null}
      </div>
      <div className="flex flex-row justify-center">
        {props.game.settings.hide_questions === false ? (
          <p id="roundQuestionText" className="sm:text-1xl text-end text-2xl text-foreground">
            {round.question}
          </p>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
