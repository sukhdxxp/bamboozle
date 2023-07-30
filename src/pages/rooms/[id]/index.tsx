"use client";

import { useRouter } from "next/router";
import Head from "next/head";
import { ParticipantType } from "@/models/Room.model";
import React, { useState } from "react";
import axios from "../../../utils/axios";

import Button from "@/components/Button";
import { useRoom } from "@/hooks/useRoom";
import Navigation from "@/components/Navigation";
import { getDeckUiConfig } from "@/components/DeckCard/utils";
import DeckDescriptionCard from "@/components/DeckDescriptionCard";
import RoomHead from "@/components/RoomHead";

export default function RoomPage() {
  const router = useRouter();
  const roomID = router.query.id as string;

  const [room, currentUserId, loading, error] = useRoom(roomID);
  const [gameLoading, setGameLoading] = useState(false);

  if (loading) {
    return <div>Loading...</div>;
  } else if (error) {
    return <div>Error: {error.toString()}</div>;
  } else if (!room) {
    return <div>No Data Found</div>;
  }

  const isCurrentUserAdmin = room.createdBy === currentUserId;

  const handleButtonClick = () => {
    setGameLoading(true);
    void axios.post("/api/games", {
      roomID: roomID,
    });
  };
  const deck = room.currentDeck;
  const uiConfig = getDeckUiConfig(deck.id);

  return (
    <div className="bg-teal-50 h-screen relative px-4">
      <Head>
        <title>Bamboozle - {room.title}</title>
      </Head>
      <Navigation />
      <RoomHead roomId={roomID} />
      <DeckDescriptionCard imageUrl={uiConfig.imageUrl} deck={deck} />
      <div className="bg-teal-100 my-4 py-4 px-6 rounded-lg bg-blob-bg-2 bg-cover">
        <h2 className="text-2xl text-gray-900">Players</h2>
        <div className="mt-6">
          {Object.keys(room.participants).map((key) => {
            return (
              <ParticipantRow key={key} participant={room.participants[key]} />
            );
          })}
        </div>
      </div>
      <div className="fixed bottom-4 w-full left-0">
        <div className="container mx-auto flex px-4">
          <Button
            className="w-full"
            onClick={handleButtonClick}
            isLoading={gameLoading}
            disabled={!isCurrentUserAdmin}
          >
            Start Game
          </Button>
        </div>
      </div>
    </div>
  );
}

export function ParticipantRow({
  participant,
}: {
  participant: ParticipantType;
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
      <div className={"ml-4 flex items-center"}>{participant.name}</div>
    </div>
  );
}
