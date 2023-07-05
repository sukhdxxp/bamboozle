import type { NextApiRequest, NextApiResponse } from "next";
import { firebaseAdminAuth } from "@/lib/data/firebase-admin";
import { Game } from "@/lib/game";
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
    const { roomID } = req.body;
    if (!roomID) {
      return res.status(400).json({ message: "Missing Required Fields" });
    }

    const room = new Room(roomID);
    await room.populateFromDatabase();

    const game = new Game({
      deckID: room.getCurrentDeckId(),
      participants: room.getParticipants(),
    });

    await game.init();
    await game.startNewRound();
    await room.setCurrentGameId(game.getId());

    return res.status(200).json({
      status: "success",
      gameID: game.getId(),
    });
  }
}
