import firebase_app from "../config";
import { initializeFirestore, getFirestore, doc, setDoc, collection } from "firebase/firestore";
import { getAuth } from "firebase/auth"
const db = getFirestore(firebase_app, process.env.NEXT_PUBLIC_FIREBASE_DB_ID)

export default async function saveUserSettings(data) {
    let result = null;
    let error = null;

    try {

        if (!getAuth().currentUser || !getAuth().currentUser.uid) {
            throw 'User not logged in';
        }

        data['email'] = getAuth().currentUser.email;
        data['uid'] = getAuth().currentUser.uid;

        const docRef = doc(collection(db, 'users_settings'), getAuth().currentUser.uid);

        result = await setDoc(docRef, data);
    } catch (e) {
        error = e;
    }

    return { result, error };
}