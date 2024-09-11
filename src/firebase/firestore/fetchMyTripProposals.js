import firebase_app from "../config";
import { getFirestore, doc, getDocs, collection, query, where} from "firebase/firestore";
import { getAuth } from "firebase/auth"

const db = getFirestore(firebase_app, process.env.NEXT_PUBLIC_FIREBASE_DB_ID)

export default async function fetchMyTripProposals() {
    let proposals = [];

    try {
        const uid = getAuth().currentUser.uid

        if (!uid) {
            throw 'User not logged in';
        }

        const q = query(collection(db, "trip_proposals", uid, uid));

        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            proposals.push(doc.data());
        });
    } catch (e) {
        console.error(e);
        proposals = [];
    }

    return proposals;
}
