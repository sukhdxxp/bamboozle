import type { NextApiRequest, NextApiResponse } from "next";
import {
  firebaseAdminAuth,
  firebaseDatabase,
} from "../../../lib/data/firebase-admin";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const token = req.headers.authorization;
    if (!token) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    const user = await firebaseAdminAuth.verifyIdToken(token);
    if (!user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    const { title, currentDeckID } = req.body;
    if (!title || !currentDeckID) {
      return res.status(400).json({ message: "Missing Required Fields" });
    }
    const currentParticipant = {
      uid: user.uid,
      name: user.name,
      avatar: user.picture,
      isOnline: false,
      lastSeen: new Date().toISOString(),
    };

    const room = {
      createdBy: user.uid,
      createdAt: new Date().toISOString(),
      title,
      currentDeckID,
      participants: {
        [user.uid]: currentParticipant,
      },
      admin: user.uid,
    };

    const roomReference = await firebaseDatabase.ref("rooms").push(room);

    return res.status(200).json({
      status: "success",
      id: roomReference.key,
    });
  }
}
