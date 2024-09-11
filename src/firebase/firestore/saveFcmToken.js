import app from '@/firebase/config';
import {initializeFirestore, getFirestore, doc, collection, setDoc} from "firebase/firestore";
import {getAuth} from "firebase/auth"

export default async function saveFcmToken(fcmToken) {
    let result = null;
    let error = null;

    try {
        const db = getFirestore(app, process.env.NEXT_PUBLIC_FIREBASE_DB_ID)
        let user = await getAuth().currentUser;

        if (!user || !user.uid) {
            throw 'Not Authorized!';
        }

        const docRef = doc(collection(db, 'fcm_tokens'), user.uid);

        result = await setDoc(docRef, {
            uid: user.uid,
            email: user.email,
            fcmToken: fcmToken
        });
    } catch (e) {
        console.error(e);
        error = e;
    }

    return {result, error};
}