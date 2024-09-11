import adminApp from "../config-admin";
import {initializeFirestore, getFirestore} from "firebase-admin/firestore";

const db = getFirestore(adminApp, process.env.NEXT_PUBLIC_FIREBASE_DB_ID)

export default async function fetchLocalProductsAsAdmin(region) {
    let result = null;
    let error = null;

    try {
        if (!region) {
            throw 'Region must be provided';
        }

        var productsRef = db.collection("products");

        var data = await productsRef
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
                return [];
            });

        result = data
    } catch (e) {
        error = e;
    }

    return { result, error };
}
