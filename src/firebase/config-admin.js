import { initializeApp, getApps } from "firebase-admin/app";
import admin from "firebase-admin";

var serviceAccount = require("/healthy-travel-firebase-adminsdk-dsx7m-085d4400ba.json");

let adminApp = getApps().length === 0 ? initializeApp({
    credential: admin.credential.cert(serviceAccount),
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
}) : getApps()[0];

export default adminApp;