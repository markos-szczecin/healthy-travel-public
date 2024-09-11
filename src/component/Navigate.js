import {Link, useNavigate, Routes, Route} from "react-router-dom";
import {useRouter, usePathname} from "next/navigation";
import {useLoading} from '@/context/LoadingContext';
import {getAuth} from "firebase/auth";
import React, {useEffect} from "react";
import {useAuthContext} from "@/context/AuthContext";

const Navigation = () => {
    const navigate = useNavigate();
    const router = useRouter();
    const {showLoading, hideLoading} = useLoading();
    const {user} = useAuthContext();
    const pathname = usePathname();

    const redirect = (path) => {
        if (pathname === path) {
            return;
        }
        showLoading();
        router.push(path);
    };

    useEffect(() => {
        hideLoading();
    }, [])

    if (!user) {
        return (<></>);
    }

    return (
        <>
            <div className="flex flex-wrap items-center justify-center bg-gray-100 max-w-xs">
                {pathname != '/user' ?
                    <div style={{margin: "0 10px"}}>
                        <button
                            className="btn-nav mb-4 px-6 py-1 text-white bg-yellow-500 rounded hover:bg-orange-500"
                            onClick={(e) => redirect("/user")}>Home
                        </button>
                    </div>
                    : ''}
                {pathname != '/user/settings' ?
                    <div style={{margin: "0 10px"}}>
                        <button
                            className="btn-nav mb-4 px-6 py-1 text-white bg-yellow-500 rounded hover:bg-orange-500"
                            onClick={(e) => redirect("/user/settings")}>Preferances
                        </button>
                    </div>
                    : ''}
                <div style={{margin: "0 10px"}}>
                    <button
                        className="btn-nav mb-4 px-6 py-1 text-white bg-blue-500 rounded hover:bg-blue-600"
                        onClick={() => navigate(-1)}>Back
                    </button>
                </div>
                <div style={{margin: "0 10px"}}>
                    <button

                        className="btn-nav mb-4 px-6 py-1 text-white bg-blue-500 rounded hover:bg-blue-600"
                        onClick={() => navigate(1)}>Go forward
                    </button>
                </div>
            </div>
        </>
    );
};

export default Navigation;