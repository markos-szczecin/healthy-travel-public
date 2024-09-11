import app from '@/firebase/config-admin';
import {initializeFirestore, getFirestore, doc, collection, setDoc} from "firebase/firestore";
import fetchUsersFcmTokensAsAdmin from "./fetchUsersFcmTokensAsAdmin";
import {getMessaging} from 'firebase-admin/messaging';
import saveTripProposal from './saveTripProposal';

export default async function notifyUsers(uids, user, tripData) {
    if (!uids || !uids.length) {
        return;
    }

    try {
        uids.forEach(function (uid) {
            saveTripProposal(user, tripData, uid);
        });
    } catch (e) {
        console.error(e);
    }

    try {
        const fcmTokens = await fetchUsersFcmTokensAsAdmin(uids);

        let msg = 'Traveller ' + user.email + ' proposes a joint trip around ' + tripData.destination + "\n\n";
        msg += 'Feel free to contact with the traveller via e-mail in order to set up a journey together.'
        const data = {
            "Time Range": tripData.dateFrom + ' - ' + tripData.dateTo,
            "Main Preferances": (tripData.preferences ? tripData.preferences.join(', ') : ''),
            "Extra Preferances": (tripData.otherPreferences || ''),
        };

        fcmTokens.forEach(function (token) {
            const message = {
                data: data,
                notification: {
                    title: "A proposal for a joint trip around " + tripData.destination,
                    body: msg
                },
                token: token
            };
            getMessaging(app).send(message)
                .then((response) => {
                    console.log('Successfully sent message:', response);
                })
                .catch((error) => {
                    console.log('Error sending message:', error);
                });
        });
    } catch (e) {
        console.error(e);
    }
}