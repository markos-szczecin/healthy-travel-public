import {app} from '../config-admin';
import {initializeFirestore, getFirestore} from "firebase-admin/firestore";
import {getAuth} from "firebase-admin/auth"

const db = getFirestore(app, process.env.NEXT_PUBLIC_FIREBASE_DB_ID)

export default async function saveTripProposal(fromUer, trip, toUserUid) {
    if (!fromUer || !fromUer.uid) {
        throw 'Not Authorized!';
    }

    db.collection('trip_proposals/' + toUserUid + '/' + toUserUid).add({
        fromUserUid: fromUer.uid,
        fromUserEmail: fromUer.email,
        forUser: toUserUid,
        dateFrom: trip.dateFrom,
        dateTo: trip.dateTo,
        destination: trip.destination,
        tripDetails: trip
    }).then(ref => {
        console.log(ref.id);
        return ref.id
    }).catch(function (responseError) {
        console.log(responseError);
        return null;
    })
}