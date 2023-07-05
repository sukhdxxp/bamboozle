import { firebaseDatabase } from "@/lib/data/firebase-admin";

export async function fetchValueFromDatabase(path: string) {
  const ref = firebaseDatabase.ref(path);
  const snapshot = await ref.once("value");
  return snapshot.val();
}
