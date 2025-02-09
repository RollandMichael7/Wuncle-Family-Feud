import { Answer, PrismSide } from "@/lib/utils/feud-types";
import React, { useEffect, useState } from "react";
import textFit from "../lib/textfit.min.js";
import LabeledPrism from "./ui/LabeledPrism";

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
  height = 150,
  depth = 150,
}) => {
  const [displaySide, setDisplaySide] = useState(PrismSide.Bottom);

  useEffect(() => {
    textFit(document.getElementsByClassName("answer-text"), { multiLine: true, detectMultiLine: false });
    setDisplaySide(answer?.trig ? PrismSide.Front : PrismSide.Bottom);
  }, [answer]);

  const LABEL_MARGIN = 30;
  const labelStyles = {
    height: `${height - LABEL_MARGIN * 2}px`,
    width: `${height - LABEL_MARGIN * 2}px`,
    marginTop: `${LABEL_MARGIN}px`,
    marginBottom: `${LABEL_MARGIN}px`,
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
              borderLeft: "4px solid white",
              padding: "5px 15px",
            }}
            className={
              "text-shadow flex items-center justify-center bg-gradient-to-t from-primary-900 to-primary-700 text-6xl"
            }
          >
            {answer?.trig ? answer.pnt : ""}
          </span>
        </div>
      }
      bottomLabel={
        isVisible ? (
          <span
            style={labelStyles}
            className="prism-label text-shadow bg-gradient-to-t from-primary-900 to-primary-700"
          >
            {answerNum}
          </span>
        ) : (
          ""
        )
      }
    />
  );
};

export default AnswerPrism;
