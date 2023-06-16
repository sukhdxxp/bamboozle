import type { NextApiRequest, NextApiResponse } from "next";
import { firebaseDatabase } from "../../../lib/data/firebase-admin";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // use firebase admin sdk to write to the database, use firebaseDatabase from firebase-admin.ts\
  // await firebaseDatabase.ref("deckQuestions").set(formattedDecks.deckQuestions);

  res.status(200).json({ message: 'hello' });
}
