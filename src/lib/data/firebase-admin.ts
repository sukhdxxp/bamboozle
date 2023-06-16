import admin from "firebase-admin";
import { cert } from "firebase-admin/app";

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: cert({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY,
      }),
      databaseURL: process.env.NEXT_PUBLIC_FIREBASE_REALTIME_DB_URI,
    });
  } catch (err) {}
}

const firebaseAdminAuth = admin.auth();

const firebaseDatabase = admin.database();

export { firebaseAdminAuth, firebaseDatabase };