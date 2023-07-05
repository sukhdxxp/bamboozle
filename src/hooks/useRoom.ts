import { useEffect, useState } from "react";
import { useObject } from "react-firebase-hooks/database";
import { firebaseDB, ref } from "@/lib/data/firebase";
import { RoomType } from "@/models/Room.model";

export const useRoom = (id: string) => {
  const [room, setRoom] = useState<RoomType | null>(null);
  const [object, loading, error] = useObject(ref(firebaseDB, `rooms/${id}`));

  useEffect(() => {
    if (object) {
      const roomData = object.val() as RoomType;
      setRoom(roomData);
    }
  }, [object]);

  return [room, loading, error] as [RoomType | null, boolean, Error];
};
