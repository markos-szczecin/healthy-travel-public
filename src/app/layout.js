'use client'
import './globals.css'
import {AuthContextProvider} from '@/context/AuthContext';
import {LoadingProvider, useLoading} from '@/context/LoadingContext';
import Loader from '@/component/Loader';
import FcmTokenComp from "@/component/firebaseForeground";
import React from "react";
import {BrowserRouter} from "react-router-dom";
import Navigation from "../component/Navigate";

const registerServiceWorker = async () => {
    if ("serviceWorker" in navigator) {
        try {
            const registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js", {
                scope: "/firebase-cloud-messaging-push-scope",
            });
            if (registration.installing) {
                console.log("Service worker installing");
            } else if (registration.waiting) {
                console.log("Service worker installed");
            } else if (registration.active) {
                console.log("Service worker active");
            }
        } catch (error) {
            console.error(`Registration failed with ${error}`);
        }
    }
};

const LoaderWrapper = ({children}) => {
    const {isLoading} = useLoading();

    return (
        <>
            {isLoading && <Loader/>}
            {children}
        </>
    );
};

export default function RootLayout({children}) {
    React.useEffect(() => {
        registerServiceWorker();
    }, []);

    return (
        <html lang="en">
        <head>
            <link rel="manifest" href="/manifest.json"/>
        </head>
        <body>

        <AuthContextProvider>
            <LoadingProvider>
                <LoaderWrapper>
                    <BrowserRouter>
                        <Navigation/>
                        {children}
                    </BrowserRouter>
                </LoaderWrapper>
            </LoadingProvider>
        </AuthContextProvider>
        </body>
        </html>
    );
}
