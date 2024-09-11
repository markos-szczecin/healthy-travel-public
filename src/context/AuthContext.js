import React from 'react';
import {
    onAuthStateChanged,
    getAuth
} from 'firebase/auth';
import {useRouter, usePathname} from "next/navigation";
import FcmTokenComp from "@/component/firebaseForeground";
import firebase_app from '@/firebase/config';

const auth = getAuth(firebase_app);

export const AuthContext = React.createContext({});

export const useAuthContext = () => React.useContext(AuthContext);

export const AuthContextProvider = ({children}) => {
    const router = useRouter();
    const pathname = usePathname();
    const [user, setUser] = React.useState(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        if (pathname === '/firebase-messaging-sw.js' || pathname === '/firebase-cloud-messaging-push-scope') {
            return null;
        }

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (pathname === '/firebase-messaging-sw.js') {
                return null;
            }
            if (user) {
                setUser(user);
                if (pathname === '/signup' || pathname === '/signin') {
                    router.push("/user")
                }
            } else {
                setUser(null);
                if (pathname !== '/signup' && pathname !== '/signin') {
                    router.push("/signin")
                }
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{user}}>
            {user ? <FcmTokenComp /> : ''}
            {loading ? '' : children}
        </AuthContext.Provider>
    );
};