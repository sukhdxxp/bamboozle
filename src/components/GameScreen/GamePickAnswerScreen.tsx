// Create screen to pick answer

import { GameClientStateType } from "@/models/Game.model";
import React, { useState } from "react";
import Button from "@/components/Button";
import CircularProgressBar from "@/components/CircularProgressBar";
import WaitScreen from "@/components/WaitScreen";

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
    return <WaitScreen />;
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
      <div className="flex flex-row-reverse	mx-2">
        <CircularProgressBar duration={game.currentRoundDuration} />
      </div>
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
      <div className="fixed bottom-4 w-full left-0">
        <div className="container mx-auto flex px-4">
          <Button
            className="w-full bg-teal-500 hover:bg-teal-600 "
            onClick={handleButtonClick}
            disabled={!answer}
          >
            Select Answer
          </Button>
        </div>
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
  const optionId = `answer-option-${answerOption.id}`;

  return (
    <li onClick={() => handleItemClick(answerOption.id)}>
      <input
        type="radio"
        name="answer-option"
        id={optionId}
        value={answerOption.id}
        className="hidden peer"
        required
      />
      <label
        htmlFor={optionId}
        className="inline-flex items-center justify-between w-full p-5 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer peer-checked:border-teal-500 peer-checked:text-teal-500 peer-checked:font-medium"
      >
        <div className="block">
          <div className="w-full">{answerOption.text}</div>
        </div>
      </label>
    </li>
  );
}
