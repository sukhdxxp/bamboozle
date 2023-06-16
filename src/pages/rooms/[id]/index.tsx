/* eslint-disable @next/next/no-img-element */
"use client";

import { useObject } from "react-firebase-hooks/database";
import { firebaseAuth, firebaseDB, ref } from "../../../lib/data/firebase";
import { useRouter } from "next/router";
import Head from "next/head";
import { RoomType, ParticipantType } from "../../../models/Room.model";
import { useAuthState } from "react-firebase-hooks/auth";
import { onDisconnect, set } from "firebase/database";
import { useEffect } from "react";

export default function RoomPage() {
  const router = useRouter();
  const [user, userLoading] = useAuthState(firebaseAuth);
  const roomID = router.query.id as string;

  const [object, loading, error] = useObject(
    ref(firebaseDB, `rooms/${roomID}`)
  );

   useEffect(() => {

    if(user) {
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
  } else if (!object || !user) {
    return <div>No Data Found</div>;
  }

 
  
  const room = object.val() as RoomType;

  return (
    <div>
      <Head>
        <title>RoomPage</title>
      </Head>
      <div>
        <h1>RoomPage: {room.title}</h1>
        <h2>Players</h2>
        {Object.keys(room.participants).map((key) => {
          return (
            <ParticipantRow key={key} participant={room.participants[key]} />
          );
        })}
      </div>
    </div>
  );
}

function ParticipantRow({ participant }: { participant: ParticipantType }) {
  //simple component to display all properties of a participant
  return (
    <div>
      <div>{participant.name}</div>
      <img src ={participant.avatar} alt="avatar"/>
      <div>{participant.isOnline}</div>
      <div>{participant.lastSeen}</div>
    </div>
  );
}
