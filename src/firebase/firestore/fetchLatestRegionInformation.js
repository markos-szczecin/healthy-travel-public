import adminApp from "../config-admin";
import {initializeFirestore, getFirestore} from "firebase-admin/firestore";

const db = getFirestore(adminApp, process.env.NEXT_PUBLIC_FIREBASE_DB_ID)

export default async function fetchLatestRegionInformation(region) {
    let result = {};

    try {
        if (!region) {
            throw 'Region must be provided';
        }

        var updatesRef = db.collection("region_updates");

        result = await updatesRef
            .where("region", ">=", region.toUpperCase())
            .where("region", "<=", region.toLowerCase() + "\uf8ff")
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
                return {};
            });

        console.log(result);
    } catch (e) {
        console.log(e);
    }

    return Object.assign({}, result);
}
