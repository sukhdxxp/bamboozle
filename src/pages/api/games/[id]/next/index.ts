import type { NextApiRequest, NextApiResponse } from "next";
import { firebaseAdminAuth } from "@/lib/data/firebase-admin";
import { Game } from "@/lib/game";

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
    const { id } = req.query;
    const gameID = id as string;
    if (!gameID) {
      return res.status(400).json({ message: "Missing Required Fields" });
    }

    const game = await Game.read(gameID);
    await game.startNewRound();

    return res.status(200).json({
      status: "success",
      data: null,
    });
  }
}
