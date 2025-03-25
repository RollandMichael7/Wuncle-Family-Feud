import { FinalRoundQuestion, PrismSide } from "@/lib/utils/feud-types";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import textFit from "../lib/textfit.min.js";

interface FinalRoundAnswersProps {
  questions: FinalRoundQuestion[];
  roundNumber: number;
}

const FinalRoundAnswers: React.FC<FinalRoundAnswersProps> = ({ questions, roundNumber }) => {
  const { t } = useTranslation();

  useEffect(() => {
    textFit(document.getElementsByClassName("final-round-answer"), { multiLine: true, detectMultiLine: false });
  }, [questions]);

  return questions.map((x, i) => (
    <div
      key={`final-round-answers-${i}`}
      className="final-round-answer-container flex justify-between"
      style={{
        minWidth: 0,
        position: "relative",
      }}
    >
      <div className="final-round-cursor-container">
        <span className="final-round-cursor"></span>
      </div>
      <div
        className="flex items-center bg-fastm-holder font-extrabold uppercase"
        style={{ height: 70, minWidth: 0, marginBottom: "2.25rem", width: "84%", position: "relative" }}
      >
        <p
          id={`finalRound${roundNumber}Answer${i}Text`}
          className="final-round-answer text-fastm-text"
          style={{ height: 70, width: "100%" }}
        >
          {x.revealed ? x.input : ""}
        </p>
      </div>
      <div
        className="flex items-center justify-center bg-fastm-holder font-extrabold uppercase text-fastm-text"
        style={{ width: "12%", height: 70 }}
      >
        {x.revealed && (
          <p id={`finalRound${roundNumber}PointsTotalText`} style={{ fontSize: "3.5rem", margin: 0 }}>
            {t("number", { count: x.points })}
          </p>
        )}
      </div>
    </div>
  ));
};

export default FinalRoundAnswers;
