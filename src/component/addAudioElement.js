import {getDownloadURL, getStorage, ref, uploadBytes} from "firebase/storage";

export default async function addAudioElement(blob)  {
    const storage = getStorage();
    const storageRef = ref(storage, 'trip-meal-' + (new Date()).getTime().toString());
    let url = '';
    const res = await uploadBytes(storageRef, blob).then((snapshot) => {
        return snapshot;
    }).catch(function (e) {
        console.error(e);
        return '';
    });

    if (res) {
        url = await getDownloadURL(res.ref).then((downloadURL) => {
            return downloadURL;
        }).catch(function (e) {
            console.error(e);
            return '';
        });
    }

    return url;
};