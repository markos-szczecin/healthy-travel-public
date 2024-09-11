'use client'
import firebase_app from "../firebase/config"
import { useEffect, useState } from 'react';
import { getMessaging, getToken } from 'firebase/messaging';
import saveFcmToken from "@/firebase/firestore/saveFcmToken";

const useFcmToken = () => {
    const [token, setToken] = useState('');
    const [notificationPermissionStatus, setNotificationPermissionStatus] = useState('');

    useEffect(() => {
        var respone = null;
        const retrieveToken = async () => {
            try {
                if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
                    const messaging = getMessaging(firebase_app);
                    const permission = await Notification.requestPermission();
                    setNotificationPermissionStatus(permission);

                    if (permission === 'granted') {
                        const currentToken = await getToken(messaging, { vapidKey: process.env.NEXT_PUBLIC_FIREBASE_MESSAGE_KEY });
                        if (currentToken) {
                            setToken(currentToken);
                            try {
                                respone = await saveFcmToken(currentToken);
                            } catch (e) {
                                console.error(e);
                            }
                        } else {
                            console.log('No registration token available. Request permission to generate one.');
                        }
                    }
                }
            } catch (error) {
                if (location.search !== '?reloaded=true') {
                    location.search = '?reloaded=true';
                }
                console.log('Error retrieving token:', error);
            }
        };

        retrieveToken();
    }, []);

    return { token, notificationPermissionStatus };
};

export default useFcmToken;