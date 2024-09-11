import firebase_app from "../config";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth"

const db = getFirestore(firebase_app, process.env.NEXT_PUBLIC_FIREBASE_DB_ID)

export default async function getDoument() {
    let result = null;
    let error = null;

    try {
        if (!getAuth().currentUser || !getAuth().currentUser.uid) {
            throw 'User not logged in';
        }

        const docRef = doc(db, 'users_settings', getAuth().currentUser.uid);

        result = await getDoc(docRef);
    } catch (e) {
        error = e;
    }

    return { result, error };
}
