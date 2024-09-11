import adminApp from "../config-admin";
import {initializeFirestore, getFirestore} from "firebase-admin/firestore";

const db = getFirestore(adminApp, process.env.NEXT_PUBLIC_FIREBASE_DB_ID)

export default async function fetchLocalProductsAsAdmin(region, from, to, currentUserUid) {
    let result = null;
    let error = null;

    try {
        if (!region) {
            throw 'Region must be provided';
        }

        var tripsRef = db.collection("trips");

        var data = await tripsRef
            .where("destination", ">=", region.toUpperCase())
            .where("destination", "<=", region.toLowerCase() + "\uf8ff")
            .where('dateFrom', '>=', from)
            .where('dateFrom', '<=', to)
            .where('uid', '!=', currentUserUid)
            .get()
            .then((querySnapshot) => {
                const data = [];

                querySnapshot.forEach((doc) => {
                    data.push(doc.data());
                });

                return data;
            })
            .catch((error) => {
                console.log("Error getting documents: ", error);
                return [];
            });

        result = data
    } catch (e) {
        error = e;
    }

    return { result, error };
}
