import React, { useState } from "react";
import { GameClientStateType } from "@/models/Game.model";
import ProgressBar from "../ProgressBar/ProgressBar";
import Button from "@/components/Button";

type GameAnswerScreenProps = {
  game: GameClientStateType;
  handleTrickAnswerSubmission: (answerText: string) => void;
};

export default function GameAnswerScreen({
  game,
  handleTrickAnswerSubmission,
}: GameAnswerScreenProps) {
  const [answer, setAnswer] = useState<string>("");
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);

  const handleButtonClick = () => {
    handleTrickAnswerSubmission(answer);
    setIsAnswerSubmitted(true);
  };

  if (isAnswerSubmitted) {
    return (
      <div>
        <h1>Waiting for other players to submit their answers...</h1>
      </div>
    );
  }

  return (
    <div>
      <ProgressBar duration={game.currentRoundDuration} />
      <div className="bg-teal-100 mb-4 p-4 rounded-3xl">
        <h1 className="text-2xl">{game.deck?.title}</h1>
        <div className="mt-2 text-slate-900 font-light">
          <p>{game.currentQuestion.question}</p>
        </div>
      </div>
      <div>
        <textarea
          id="message"
          rows={10}
          className="mt-4 block p-2.5 w-full text-md text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 opacity-70 focus:opacity-100 focus:outline-none focus:border-teal-500"
          placeholder={game.deck?.placeholder}
          onChange={(e) => setAnswer(e.target.value)}
        ></textarea>
      </div>
      <div className="fixed bottom-4 w-full left-0">
        <div className="container mx-auto flex px-4">
          <Button
            className="w-full bg-teal-500 hover:bg-teal-600 "
            onClick={handleButtonClick}
          >
            Submit Answer
          </Button>
        </div>
      </div>
    </div>
  );
}
