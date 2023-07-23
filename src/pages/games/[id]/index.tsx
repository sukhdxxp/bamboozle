/* eslint-disable @next/next/no-img-element */
"use client";
import { useRouter } from "next/router";
import Head from "next/head";

import { push, set } from "firebase/database";
import { useObject } from "react-firebase-hooks/database";
import { useAuthState } from "react-firebase-hooks/auth";

import { firebaseAuth, firebaseDB, ref } from "@/lib/data/firebase";
import {
  ClientGameParticipantType,
  GameClientStateType,
  GameState,
} from "@/models/Game.model";
import GameInitScreen from "../../../components/GameInitScreen";
import GameWriteAnswerScreen from "../../../components/GameScreen/GameAnswerScreen";
import GamePickAnswerScreen from "@/components/GameScreen/GamePickAnswerScreen";
import { uuidv4 } from "@firebase/util";
import axios from "@/utils/axios";
import GameScoreCard from "@/components/GameScreen/GameScoreCard";
import Button from "@/components/Button";
import React from "react";

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

  const handleNextRoundTrigger = async () => {
    await axios.post(`/api/games/${gameID}/next`);
  };

  return (
    <div className="bg-teal-50 h-screen relative bg-blob-bg bg-center bg-cover">
      <Head>
        <title>Game Page</title>
      </Head>
      <div className="p-4">
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
          <div className="bg-teal-100 my-4 py-4 px-6 rounded-lg bg-blob-bg-2 bg-cover">
            <h2 className="text-2xl text-gray-900">Players</h2>
            <div className="mt-6">
              {Object.keys(game.participants).map((key) => {
                return (
                  <ParticipantRow
                    key={key}
                    participant={game.participants[key]}
                  />
                );
              })}
            </div>
          </div>
          <div className="fixed bottom-4 w-full left-0">
            <div className="container mx-auto flex px-4">
              <Button
                className="w-full bg-teal-500 hover:bg-teal-600 "
                onClick={handleNextRoundTrigger}
                disabled={false}
              >
                Next Round
              </Button>
            </div>
          </div>
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

function ParticipantRow({
  participant,
}: {
  participant: ClientGameParticipantType;
}) {
  const avatarRingColor = participant.isOnline
    ? "dark:ring-green-500"
    : "dark:ring-gray-500";

  return (
    <div className="flex content-center my-4">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className={`w-12 h-12 p-1 rounded-full ring-2 ring-gray-300 ${avatarRingColor}`}
        src={participant.avatar}
        alt="Bordered avatar"
      />
      <div className={"ml-4 flex items-center"}>
        {participant.name} - {participant.score}
      </div>
    </div>
  );
}
