import adminApp from "../config-admin";
import {initializeFirestore, getFirestore} from "firebase-admin/firestore";

const db = getFirestore(adminApp, process.env.NEXT_PUBLIC_FIREBASE_DB_ID)

export default async function fetchUsersFcmTokensAsAdmin(userUIDs) {
    let result = [];

    if (!userUIDs || !userUIDs.length) {
        return [];
    }

    try {
        var fcmTokensRef = db.collection("fcm_tokens");

        result = await fcmTokensRef
            .where("uid", 'in', userUIDs)
            .get()
            .then((querySnapshot) => {
                const tokens = [];

                querySnapshot.forEach((doc) => {
                    let t = doc.data().fcmToken;
                    if (tokens.indexOf(t) === -1) {
                        tokens.push(t);
                    }
                });

                return tokens;
            })
            .catch((error) => {
                console.log("Error getting documents: ", error);
                return [];
            });
    } catch (e) {
        console.error(e);
    }
console.log(result);
    return result
}
