import {
  ClientGameParticipantType,
  GameClientStateType,
} from "@/models/Game.model";
import React from "react";

type GameScoreCardProps = {
  game: GameClientStateType;
};
export default function GameScoreCard({ game }: GameScoreCardProps) {
  return (
    <>
      <h3>Game Finished</h3>
      <div className="bg-teal-100 my-4 py-4 px-6 rounded-lg bg-blob-bg-2 bg-cover">
        <h2 className="text-2xl text-gray-900">Players</h2>
        <div className="mt-6">
          {Object.keys(game.participants).map((key) => {
            return (
              <ParticipantRow key={key} participant={game.participants[key]} />
            );
          })}
        </div>
      </div>
    </>
  );
}

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
