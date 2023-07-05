/* eslint-disable @next/next/no-img-element */
"use client";
import { useRouter } from "next/router";
import Head from "next/head";

import { push, set } from "firebase/database";
import { useObject } from "react-firebase-hooks/database";
import { useAuthState } from "react-firebase-hooks/auth";

import { firebaseAuth, firebaseDB, ref } from "@/lib/data/firebase";
import { GameClientStateType, GameState } from "@/models/Game.model";
import GameInitScreen from "../../../components/GameInitScreen";
import GameWriteAnswerScreen from "../../../components/GameScreen/GameAnswerScreen";
import GamePickAnswerScreen from "@/components/GameScreen/GamePickAnswerScreen";
import { uuidv4 } from "@firebase/util";
import axios from "@/utils/axios";
import GameScoreCard from "@/components/GameScreen/GameScoreCard";

export default function GamePage() {
  const router = useRouter();
  const [user, userLoading] = useAuthState(firebaseAuth);
  const gameID = router.query.id as string;

  const [object, loading, error] = useObject(
    ref(firebaseDB, `games/${gameID}/clientState`)
  );

  if (loading || userLoading) {
    return <div>Loading...</div>;
  } else if (error) {
    return <div>Error: {error.toString()}</div>;
  } else if (!object || !user) {
    return <div>No Data Found</div>;
  }
  const game: GameClientStateType = object.val();

  const participantAnswerPath = getParticipantAnswerPath(
    gameID,
    user.uid,
    game.currentRoundIndex
  );

  const handleTrickAnswerSubmission = async (answerText: string) => {
    const trickAnswerRef = ref(
      firebaseDB,
      `${participantAnswerPath}/trickAnswer`
    );
    const trickAnswer = {
      [uuidv4()]: answerText,
    };
    await set(trickAnswerRef, trickAnswer);
  };

  const handleCorrectAnswerSubmission = async (answerText: string) => {
    const correctAnswerRef = ref(
      firebaseDB,
      `${participantAnswerPath}/correctAnswer`
    );
    await push(correctAnswerRef, answerText);
  };

  const handleNextRoundTrigger = () => {
    axios.post(`/api/games/${gameID}/next`).then((res) => {
      console.log(res);
    });
  };

  return (
    <div>
      <Head>
        <title>Game Page</title>
      </Head>
      <div>
        <GameStateComponent
          game={game}
          handleTrickAnswerSubmission={handleTrickAnswerSubmission}
          handleCorrectAnswerSubmission={handleCorrectAnswerSubmission}
          handleNextRoundTrigger={handleNextRoundTrigger}
        />
      </div>
    </div>
  );
}

function GameStateComponent({
  game,
  handleNextRoundTrigger,
  handleTrickAnswerSubmission,
  handleCorrectAnswerSubmission,
}: {
  game: GameClientStateType;
  handleTrickAnswerSubmission: (s: string) => void;
  handleCorrectAnswerSubmission: (s: string) => void;
  handleNextRoundTrigger: () => void;
}) {
  switch (game.state) {
    case GameState.INIT:
      return <GameInitScreen />;
    case GameState.WAITING_IN_LOBBY:
      return (
        <div>
          Waiting in lobby
          <button
            type="button"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 w-full"
            onClick={handleNextRoundTrigger}
          >
            Next Round
          </button>
        </div>
      );
    case GameState.WRITE_TRICK_ANSWER:
      return (
        <GameWriteAnswerScreen
          game={game}
          handleTrickAnswerSubmission={handleTrickAnswerSubmission}
        />
      );
    case GameState.PICK_ANSWER:
      return (
        <GamePickAnswerScreen
          game={game}
          handleCorrectAnswerSubmission={handleCorrectAnswerSubmission}
        />
      );
    case GameState.FINISHED:
      return <GameScoreCard game={game} />;
  }
}

const getParticipantAnswerPath = (
  gameID: string,
  userId: string,
  currentRoundIndex: number
) => {
  return `games/${gameID}/scorecard/${userId}/answers/${currentRoundIndex}`;
};
