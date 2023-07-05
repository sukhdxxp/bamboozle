import { useState } from "react";
import { GameClientStateType } from "@/models/Game.model";
import ProgressBar from "../ProgressBar/ProgressBar";

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
        <div className="mt-5">
          <div>
            <h2>Question</h2>
            <p>{game.currentQuestion.question}</p>
          </div>
          <label
            htmlFor="message"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Your message
          </label>
          <textarea
            id="message"
            rows={4}
            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Write the trick answer here..."
            onChange={(e) => setAnswer(e.target.value)}
          ></textarea>
        </div>
        <div className="mt-2">
          <button
            type="button"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 w-full"
            onClick={handleButtonClick}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
