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
      <h1>Trick Answer</h1>
      <div>
        <ProgressBar duration={game.currentRoundDuration} />
        <div className="bg-teal-100 my-4 p-4 rounded-3xl  mt-4">
          <div>
            <p>{game.currentQuestion.question}</p>
          </div>
          <textarea
            id="message"
            rows={8}
            className="mt-4 block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Write the trick answer here..."
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
    </div>
  );
}
