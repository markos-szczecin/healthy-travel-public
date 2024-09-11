import app from '../config';
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase-admin/auth"
import { getMessaging } from "firebase/messaging";

export default async function notifyUsers(usersUids, tripData) {
    const messaging = getMessaging(app);
    getToken(messaging, {vapidKey: process.env.NEXT_PUBLIC_FIREBASE_MESSAGE_KEY});

    return {result, error};
}