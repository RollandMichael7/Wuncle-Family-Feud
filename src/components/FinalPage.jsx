import { useTranslation } from "react-i18next";
import "@/i18n/i18n";
import FinalRoundAnswers from "./FinalRoundAnswers";

export default function FinalPage(props) {
  const { t } = useTranslation();
  let total = 0;

  props.game.final_round.forEach((round) => {
    console.debug("round one total: ");
    total = total + parseInt(round.points);
  });
  props.game.final_round_2.forEach((round) => {
    console.debug("round two total", total);
    total = total + parseInt(round.points);
  });
  return (
    <div class="w-full">
      <div className="flex items-center justify-between" style={{ marginTop: "16.5rem", padding: "0 19rem" }}>
        <div style={{ width: "48%" }}>
          <FinalRoundAnswers roundNumber={1} questions={props.game.final_round} />
        </div>
        <div style={{ width: "48%" }}>
          <FinalRoundAnswers roundNumber={2} questions={props.game.final_round_2} />
        </div>
      </div>

      {/* Total */}
      <div className="flex w-full justify-end" style={{ zIndex: 20 }}>
        <p
          id="finalRoundTotalPointsText"
          className="font-bold uppercase"
          style={{ fontSize: "4rem", color: "white", marginRight: "20rem", marginTop: "7.5rem", zIndex: 20 }}
        >
          {t("number", { count: total })}
        </p>
      </div>
      {/* Timer */}
      <div className="final-round-timer" style={{ marginTop: "0.5rem" }}>
        <p id="finalRoundTimerLabel" className="text-shadow font-bold uppercase" style={{ fontSize: "6rem" }}>
          <span id="finalRoundTimerValue">{t("number", { count: props.timer })}</span>
        </p>
      </div>

      {/* WIN TEXT */}
      <div className="text-center">
        {total >= 200 ? (
          <p id="finalRoundWinText" className="text-5xl text-success-900">
            {/* TODO: win stuff */}
          </p>
        ) : null}
      </div>
    </div>
  );
}
