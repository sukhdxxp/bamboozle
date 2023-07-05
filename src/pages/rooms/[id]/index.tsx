/* eslint-disable @next/next/no-img-element */
"use client";

import { firebaseAuth, firebaseDB, ref } from "@/lib/data/firebase";
import { useRouter } from "next/router";
import Head from "next/head";
import { ParticipantType } from "@/models/Room.model";
import { useAuthState } from "react-firebase-hooks/auth";
import { onDisconnect, set } from "firebase/database";
import { useEffect } from "react";
import axios from "../../../utils/axios";

import Button from "@/components/Button";
import { useRoom } from "@/hooks/useRoom";
import DeckCard from "@/components/DeckCard";

export default function RoomPage() {
  const router = useRouter();
  const [user, userLoading] = useAuthState(firebaseAuth);
  const roomID = router.query.id as string;

  const [room, loading, error] = useRoom(roomID);

  useEffect(() => {
    if (user) {
      const participantRef = ref(
        firebaseDB,
        `rooms/${roomID}/participants/${user?.uid}`
      );

      onDisconnect(participantRef).update({
        isOnline: false,
        lastSeen: new Date().toISOString(),
      });

      set(participantRef, {
        id: user?.uid,
        name: user?.displayName,
        avatar: user?.photoURL,
        isOnline: true,
        lastSeen: new Date().toISOString(),
      });
    }
  }, [roomID, user]);

  if (loading || userLoading) {
    return <div>Loading...</div>;
  } else if (error) {
    return <div>Error: {error.toString()}</div>;
  } else if (!room || !user) {
    return <div>No Data Found</div>;
  }

  if (room.currentGameId) {
    router.push(`/games/${room.currentGameId}`);
  }

  const handleButtonClick = () => {
    axios.post("/api/games", {
      roomID: roomID,
    });
  };

  return (
    <div className="container mx-auto">
      <Head>
        <title>RoomPage</title>
      </Head>
      <div>
        <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white my-4">
          Game Room
        </h5>
        <DeckCard deck={room.currentDeck} shouldCollapseDescription={false} />
        <div className="bg-sky-500/20 my-4 py-4 px-6 rounded-lg">
          <h2 className="text-2xl text-gray-900 dark:text-white">Players</h2>
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
        <Button onClick={handleButtonClick}>Start Game</Button>
      </div>
    </div>
  );
}

function ParticipantRow({ participant }: { participant: ParticipantType }) {
  const avatarRingColor = participant.isOnline
    ? "dark:ring-green-500"
    : "dark:ring-gray-500";

  return (
    <div className="flex content-center my-4">
      <img
        className={`w-10 h-10 p-1 rounded-full ring-2 ring-gray-300 ${avatarRingColor}`}
        src={participant.avatar}
        alt="Bordered avatar"
      />
      <div className={"ml-4 flex items-center"}>{participant.name}</div>
    </div>
  );
}
