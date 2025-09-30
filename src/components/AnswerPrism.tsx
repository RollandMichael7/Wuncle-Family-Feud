import { Answer, PrismSide } from "@/lib/utils/feud-types";
import React, { useEffect, useState } from "react";
import textFit from "../lib/textfit.min.js";
import LabeledPrism from "./ui/LabeledPrism";

export const MAX_NUM_ANSWERS = 8;

interface AnswerPrismProps {
  isVisible: boolean;
  answer: Answer;
  answerNum: number;
  width?: number;
  height?: number;
  depth?: number;
}

const AnswerPrism: React.FC<AnswerPrismProps> = ({
  isVisible,
  answer,
  answerNum,
  width = 550,
  height = 140,
  depth = 75,
}) => {
  const [displaySide, setDisplaySide] = useState(answer?.trig ? PrismSide.Back : PrismSide.Front);
  const [playedSound, setPlayedSound] = useState(false);
  const labelId = `answer-label-${answerNum}`;
  //var playedSound = false;

  useEffect(() => {
    textFit(document.getElementsByClassName("answer-text"), { multiLine: true, detectMultiLine: false });
    setDisplaySide(answer?.trig ? PrismSide.Back : PrismSide.Front);
  }, [answer]);

  useEffect(() => {
    const containerId = `answer-container-${answerNum}`;
    const containerElem = document.getElementById(containerId);
    const labelElem = document.getElementById(labelId);

    if (containerElem && labelElem) {
      labelElem.classList.remove("opacity-100");
      labelElem.classList.add("opacity-0");
      setTimeout(() => {
        containerElem.classList.add("wipe-transition");

        setTimeout(() => {
          containerElem.classList.remove("wipe-transition");
        }, 500);
        setTimeout(() => {
          labelElem.classList.remove("opacity-0");
          labelElem.classList.add("opacity-100");
        }, 500);
      }, answerNum * 275);
    }
  }, [answer?.ans]);

  // margins dont include 6px border
  const LABEL_MARGIN = 24;
  const labelStyles = {
    opacity: 0,
    height: `${height - LABEL_MARGIN * 2}px`,
    width: `${(height - LABEL_MARGIN * 2) * 1.25}px`,
    marginTop: `${LABEL_MARGIN - 6}px`,
    marginBottom: `${LABEL_MARGIN - 6}px`,
    marginLeft: "auto",
    marginRight: "auto",
    fontFamily: "feud",
  };

  return (
    <LabeledPrism
      isVisible={true}
      width={width}
      height={height}
      depth={depth}
      currentSide={displaySide}
      frontLabel={
        isVisible ? (
          <div id={`answer-container-${answerNum}`} className="flex h-full items-center justify-center">
            <span
              id={labelId}
              style={labelStyles}
              className="prism-label text-shadow bg-gradient-to-t from-primary-900 to-primary-700"
            >
              {answerNum}
            </span>
          </div>
        ) : (
          ""
        )
      }
      backLabel={
        <div className="flex h-full items-center justify-center">
          <span
            style={{
              fontFamily: "feud",
              width: `${width * 0.8}px`,
              height: `${height}px`,
              padding: "1rem",
            }}
            className={"answer-text text-shadow flex items-center justify-center text-6xl uppercase"}
          >
            {answer?.trig ? answer.ans : ""}
          </span>
          <span
            style={{
              fontFamily: "feud",
              width: "20%",
              height: "calc(100% - 10px)",
              borderLeft: "3px solid lightgray",
              padding: "5px 15px",
              marginRight: "0.25rem",
            }}
            className={"answer-points text-shadow flex items-center justify-center text-6xl"}
          >
            {answer?.trig ? answer.pnt : ""}
          </span>
        </div>
      }
    />
  );
};

export default AnswerPrism;
