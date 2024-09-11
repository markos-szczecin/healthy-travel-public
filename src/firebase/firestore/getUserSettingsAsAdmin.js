import adminApp from "../config-admin";
import {initializeFirestore, getFirestore} from "firebase-admin/firestore";

const db = getFirestore(adminApp, process.env.NEXT_PUBLIC_FIREBASE_DB_ID)

export default async function getUserSettingsAsAdmin(uid) {
    let result = null;
    let error = null;

    try {
        if (!uid) {
            throw 'User not logged in';
        }

        result = await db.collection('users_settings').where('uid', '==', uid).get()
            .then(data => {
                return data;
            }).catch(function (responseError) {
                error = responseError

                return null;
            });

        result = result.docs[0] || null;
    } catch (e) {
        error = e;
    }

    return { result, error };
}
