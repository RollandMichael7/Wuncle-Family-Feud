import { FinalRoundQuestion, PrismSide } from "@/lib/utils/feud-types";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import textFit from "../lib/textfit.min.js";

interface FinalRoundAnswersProps {
  isVisible: boolean;
  questions: FinalRoundQuestion[];
  roundNumber: number;
}

const FinalRoundAnswers: React.FC<FinalRoundAnswersProps> = ({ isVisible, questions, roundNumber }) => {
  const { t } = useTranslation();

  useEffect(() => {
    if (isVisible) {
      // TODO: make this actually work
      textFit(document.getElementsByClassName("final-round-answer"), {
        multiLine: true,
        detectMultiLine: false,
        alignVert: true,
        widthOnly: true,
      });
    }
  }, [questions]);

  // start blinking cursor after it reaches point value at end of answer
  setTimeout(() => {
    questions.forEach((q, i) => {
      if (q.revealed) {
        document.getElementById(`cursor-${roundNumber}-${i}`)?.classList.add("anim-blink");
      }
    });
  }, 500);

  return questions.map((x, i) => (
    <div
      key={`final-round-answers-${i}`}
      className="final-round-answer-container flex justify-between"
      style={{
        minWidth: 0,
        position: "relative",
      }}
    >
      <div
        className={`final-round-cursor-container ${x.revealed ? "revealed" : ""} ${x.points_revealed ? "pts-revealed" : ""}`}
      >
        <span id={`cursor-${roundNumber}-${i}`} className="final-round-cursor"></span>
      </div>
      <div
        className="final-round-answer-div bg-fastm-holder font-bold uppercase"
        style={{ height: 90, minWidth: 0, marginBottom: "1.42rem", width: "87.5%", position: "relative" }}
      >
        <p
          id={`finalRound${roundNumber}Answer${i}Text`}
          className="final-round-answer text-fastm-text"
          style={{ textAlign: "left", width: "100%", marginLeft: 10, marginRight: 10 }}
        >
          {x.revealed ? x.input : ""}
        </p>
      </div>
      <div
        className="final-round-points flex items-center justify-center bg-fastm-holder font-bold uppercase text-fastm-text"
        style={{ width: "11%", height: 80, zIndex: 6, paddingRight: 10 }}
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
