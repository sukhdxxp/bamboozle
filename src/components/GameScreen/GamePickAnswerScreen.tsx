// Create screen to pick answer

import { GameClientStateType } from "@/models/Game.model";
import { useState } from "react";
import ProgressBar from "@/components/ProgressBar/ProgressBar";

type GamePickAnswerScreenProps = {
  game: GameClientStateType;
  handleCorrectAnswerSubmission: (s: string) => void;
};
export default function GamePickAnswerScreen({
  game,
  handleCorrectAnswerSubmission,
}: GamePickAnswerScreenProps) {
  const [answer, setAnswer] = useState<string>("");
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);

  const handleButtonClick = () => {
    handleCorrectAnswerSubmission(answer);
    setIsAnswerSubmitted(true);
  };

  if (isAnswerSubmitted) {
    return (
      <div>
        <h1>Waiting for other players to submit their answers...</h1>
      </div>
    );
  }
  const answerOptions = Object.keys(game.currentQuestion.answerOptions).map(
    (key) => {
      return {
        id: key,
        text: game.currentQuestion.answerOptions[key],
      };
    }
  );

  return (
    <div>
      <h1>Game Pick Answer Screen</h1>
      <ProgressBar duration={game.currentRoundDuration} />
      <div className="mt-4">
        <ul className="grid w-full gap-6">
          {answerOptions.map((answerOption, index) => (
            <AnswerListItem
              answerOption={answerOption}
              key={index}
              handleItemClick={setAnswer}
            />
          ))}
        </ul>
      </div>
      <div className="mt-2">
        <button
          type="button"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 w-full"
          disabled={answer === ""}
          onClick={handleButtonClick}
        >
          Select
        </button>
      </div>
    </div>
  );
}

type AnswerListItemProps = {
  answerOption: { id: string; text: string };
  handleItemClick: (s: string) => void;
};

function AnswerListItem({
  answerOption,
  handleItemClick,
}: AnswerListItemProps) {
  return (
    <li onClick={() => handleItemClick(answerOption.id)}>
      <input
        type="radio"
        name="answer-option"
        value={answerOption.id}
        className="hidden peer"
        required
      />
      <label
        htmlFor="hosting-small"
        className="inline-flex items-center justify-between w-full p-5 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700"
      >
        <div className="block">
          <div className="w-full">{answerOption.text}</div>
        </div>
      </label>
    </li>
  );
}
