import { useEffect, useState } from "react";
import { useObject } from "react-firebase-hooks/database";
import { firebaseAuth, firebaseDB, ref } from "@/lib/data/firebase";
import { RoomType } from "@/models/Room.model";
import { useAuthState } from "react-firebase-hooks/auth";
import { onDisconnect, set } from "firebase/database";
import { useRouter } from "next/router";

export const useRoom = (id: string) => {
  const router = useRouter();
  const [room, setRoom] = useState<RoomType | null>(null);
  const [object, loading, error] = useObject(ref(firebaseDB, `rooms/${id}`));
  const [user, userLoading] = useAuthState(firebaseAuth);

  useEffect(() => {
    if (object) {
      const roomData = object.val() as RoomType;
      if (roomData.currentGameId) {
        void router.push(`/games/${roomData.currentGameId}`);
      }
      setRoom(roomData);
    }
  }, [object, router]);

  useEffect(() => {
    if (user) {
      const participantRef = ref(
        firebaseDB,
        `rooms/${id}/participants/${user.uid}`
      );

      void onDisconnect(participantRef).update({
        isOnline: false,
        lastSeen: new Date().toISOString(),
      });

      void set(participantRef, {
        id: user?.uid,
        name: user?.displayName,
        avatar: user?.photoURL,
        isOnline: true,
        lastSeen: new Date().toISOString(),
      });
    }
  }, [id, user]);
  const currentUserId = user?.uid || null;
  return [room, currentUserId, loading || userLoading, error] as [
    RoomType | null,
    string | null,
    boolean,
    Error
  ];
};
