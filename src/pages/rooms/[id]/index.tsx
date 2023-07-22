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
import { BiCopy } from "react-icons/bi";

export default function RoomPage() {
  const router = useRouter();
  const roomID = router.query.id as string;

  const [room, currentUserId, loading, error] = useRoom(roomID);
  const [gameLoading, setGameLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showToast, setShowToast] = useState(false);

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

  const lineClamp = isExpanded ? "line-clamp-none" : "line-clamp-2";

  const handleCopyIconClick = () => {
    const currentPageURL =
      typeof window !== "undefined" && window.location.href
        ? window.location.href
        : "";
    navigator.clipboard.writeText(currentPageURL).then((r) => {
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 2000);
    });
  };

  return (
    <div className="bg-teal-50 h-screen relative">
      <Head>
        <title>Bamboozle - {room.title}</title>
      </Head>
      <Navigation />
      <div className="px-4">
        <div className="bg-teal-100 my-4 p-4 rounded-3xl flex items-center justify-between">
          <div>{roomID}</div>
          <div
            className="rounded-3xl bg-teal-200 p-2 flex items-center content-center cursor-pointer"
            onClick={handleCopyIconClick}
          >
            <BiCopy />
          </div>
        </div>
        <div className="bg-teal-100 my-4 p-4 rounded-lg flex bg-blob-bg">
          <div className="flex-none w-24 h-24">
            <img
              src={uiConfig.imageUrl}
              alt="Deck icon"
              className="w-24 h-24"
            />
          </div>
          <div className="ml-4">
            <h1 className="text-lg text-gray-900">{deck.title}</h1>
            <p className={`text-sm text-gray-500 font-light mt-2 ${lineClamp}`}>
              {deck.description}
            </p>
            <span
              className="text-blue-600 text-sm ml-auto"
              onClick={() => {
                setIsExpanded(!isExpanded);
              }}
            >
              {isExpanded ? "Show less" : "Show more"}
            </span>
          </div>
        </div>
        <div className="bg-teal-100 my-4 py-4 px-6 rounded-lg bg-blob-bg-2 bg-cover">
          <h2 className="text-2xl text-gray-900">Players</h2>
          <div className="mt-6">
            {Object.keys(room.participants).map((key) => {
              return (
                <ParticipantRow
                  key={key}
                  participant={room.participants[key]}
                />
              );
            })}
          </div>
        </div>
        <div className="fixed bottom-4 w-full left-0">
          <div className="container mx-auto flex px-4">
            <Button
              className="w-full bg-teal-500 hover:bg-teal-600 "
              onClick={handleButtonClick}
              isLoading={gameLoading}
              disabled={!isCurrentUserAdmin}
            >
              Start Game
            </Button>
          </div>
        </div>
      </div>
      {showToast && <ToastMessage message="Copied to clipboard!" />}
    </div>
  );
}

function ParticipantRow({ participant }: { participant: ParticipantType }) {
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

function ToastMessage({ message }: { message: string }) {
  return (
    <div className="bg-gray-700 text-white p-2 rounded-lg fixed bottom-16 right-4 text-sm">
      {message}
    </div>
  );
}
