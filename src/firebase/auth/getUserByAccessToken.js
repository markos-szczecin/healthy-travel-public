import {getAuth} from "firebase-admin/auth";
import {adminApp} from '@/firebase/config-admin';

export default async function getUserByAccessToken(accessToken)  {
    const uid = await getAuth(adminApp)
        .verifyIdToken(accessToken)
        .then((decodedToken) => {
            return decodedToken;
        })
        .catch((error) => {
            console.log(error)
            return null;
        });

    if (!uid) {
        return null;
    }

    return uid;
}