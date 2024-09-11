import {app} from '../config-admin';
import {initializeFirestore, getFirestore} from "firebase-admin/firestore";
import {getAuth} from "firebase-admin/auth"

const db = getFirestore(app, process.env.NEXT_PUBLIC_FIREBASE_DB_ID)

export default async function addTrip(data) {
    let result = null;
    let error = null;
    const jsonData = typeof data === 'string' ? JSON.parse(data) : data;
    const user = await getAuth(app)
        .verifyIdToken(jsonData._access_token)
        .then((user) => {
            return user;
        })
        .catch((error) => {
            return null;
        });

    if (!user || !user.uid) {
        throw 'Not Authorized!';
    }

    delete jsonData._access_token;
    jsonData.uid = user.uid;
    jsonData.email = user.email;

    result = await db.collection('trips').add(jsonData)
        .then(ref => {
            return ref.id
        }).catch(function (responseError) {
            error = responseError

            return null;
        })

    return {result, error};
}