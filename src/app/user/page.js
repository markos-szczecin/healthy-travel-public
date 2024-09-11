'use client'

import React, {useState} from "react";
import {useAuthContext} from "@/context/AuthContext";
import {useRouter} from "next/navigation";
import {useLoading} from '@/context/LoadingContext';

export default function Page() {
    const router = useRouter();
    const {showLoading, hideLoading} = useLoading();
    const {user} = useAuthContext();

    React.useEffect(() => {
        if (user == null) {
            router.push("/signin");
        }
        hideLoading(true);
    }, [user])

    const handlePlanTrip = (e) => {
        showLoading();
        router.push('/trip/plan');
    };

    const handlePlanMeals = (e) => {
        showLoading();
        router.push('/trip/meals');
    };

    const handlePreferences = (e) => {
        showLoading();
        router.push('/user/settings');
    };

    const handleProposals = (e) => {
        showLoading();
        router.push('/trip/proposals');
    };


    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
                <div>
                    <button
                        name="planTrip"
                        onClick={(e) => handlePlanTrip(e)}
                        className="mb-4 px-6 py-3 text-white bg-blue-500 w-full rounded hover:bg-blue-600"
                    >
                        Plan a trip
                    </button>
                </div>
                <div>
                    <button
                        name="planMeals"
                        onClick={(e) => handlePlanMeals(e)}
                        className="mb-4 px-6 py-3 text-white bg-blue-500 w-full rounded hover:bg-blue-600"
                    >
                        Plan meals for your trip
                    </button>
                </div>
                <div>
                    <button
                        name="preferences"
                        onClick={(e) => handlePreferences(e)}
                        className="mb-4 px-6 py-3 text-white bg-sky-400 w-full rounded hover:bg-sky-700"
                    >
                        Preferences
                    </button>
                </div>
                <div>
                    <button
                        name="tripProposals"
                        onClick={(e) => handleProposals(e)}
                        className="mb-4 px-6 py-3 text-white bg-yellow-500  w-full rounded hover:bg-orange-500"
                    >
                        Received Proposals For a Joint Trip
                    </button>
                </div>
            </div>
        </div>
    );
}
