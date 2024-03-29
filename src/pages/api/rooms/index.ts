import type { NextApiRequest, NextApiResponse } from "next";
import { firebaseAdminAuth } from "@/lib/data/firebase-admin";
import { Room } from "@/lib/room";

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
    const room = await Room.create({ currentDeckID, user });

    return res.status(200).json({
      status: "success",
      id: room.id,
    });
  }
}
