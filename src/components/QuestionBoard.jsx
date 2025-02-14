import { useTranslation } from "react-i18next";
import "@/i18n/i18n";
import AnswerPrism from "./AnswerPrism";

const MAX_NUM_ANSWERS = 8;

export default function QuestionBoard(props) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-row items-center justify-center">
      <div
        className="question-board grid rounded-3xl px-10 lg:grid-flow-col lg:grid-rows-4"
        style={{ marginTop: "7rem" }}
      >
        {[...Array(MAX_NUM_ANSWERS)].map((x, index) => (
          <AnswerPrism
            isVisible={props.round.answers[index] != undefined}
            answer={props.round.answers[index]}
            answerNum={index + 1}
          />
        ))}
      </div>
    </div>
  );
}
