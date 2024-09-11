'use client'

import {useEffect, useState} from 'react';
import fetchMyTripProposals from '@/firebase/firestore/fetchMyTripProposals';
import {useLoading} from '@/context/LoadingContext';
import TripPreferencesOptions from '../trip_preferences_options';

export default function Home() {
    const getMyTripProposals = async () => {
        return await fetchMyTripProposals();
    }

    const {hideLoading, showLoading} = useLoading();
    const [proposals, setProposals] = useState([]);
    let tripPreferencesDic = null;

    useEffect(() => {
        showLoading()
        getMyTripProposals().then(function (data) {
            hideLoading();
            setProposals(data);
        }).catch(function (e) {
            console.log(e);
            hideLoading();
        })

    }, [])

    const getPreferencesDic = () => {
        if (tripPreferencesDic) {
            return tripPreferencesDic;
        }

        tripPreferencesDic = {};
        TripPreferencesOptions.forEach(function (option) {
            tripPreferencesDic[option.value] = option.label;
        });

        return tripPreferencesDic;
    };
    const getPreferences = (trip) => {
        if (!trip || !trip.tripDetails || !trip.tripDetails.preferences) {
            return ' - ';
        }

        let pref = trip.tripDetails.preferences.map(function (p) {
            return getPreferencesDic()[p] || null;
        });

        return pref.filter((option) => option && option.length > 0).join(', ', trip.tripDetails.preferences);
        ;
    };

    const getExtraPreferences = (trip) => {
        if (!trip || !trip.tripDetails || !trip.tripDetails.otherPreferences) {
            return ' - ';
        }

        return trip.tripDetails.otherPreferences
    };

    const getProposals = () => {
        return proposals || [];
    };

    const formatDate = (date) => {
        return date.split('T')[0];
    };

    return (
        <div className="proposals-table-wrapper" style={{padding: '2rem'}}>
            <table style={{borderCollapse: 'collapse'}}>
                <caption>Joint travel proposals</caption>
                <thead>
                <tr>
                    <th style={thStyle}>Destinations</th>
                    <th style={thStyle}>E-mail</th>
                    <th style={thStyle}>From</th>
                    <th style={thStyle}>To</th>
                    <th style={thStyle}>Main Traveler Preferences</th>
                    <th style={thStyle}>Extra Preferences</th>
                </tr>
                </thead>
                <tbody>
                {getProposals().map((trip, index) => (
                    <tr key={index}>
                        <td style={tdStyle}>{trip.destination}</td>
                        <td style={tdStyle}>{trip.fromUserEmail}</td>
                        <td style={tdStyle}>{formatDate(trip.dateFrom)}</td>
                        <td style={tdStyle}>{formatDate(trip.dateTo)}</td>
                        <td style={tdStyle}>{getPreferences(trip)}</td>
                        <td style={tdStyle}>{getExtraPreferences(trip)}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

const thStyle = {
    border: '1px solid #dddddd',
    textAlign: 'left',
    padding: '8px',
    backgroundColor: '#f2f2f2',
};

const tdStyle = {
    border: '1px solid #dddddd',
    textAlign: 'left',
    padding: '8px',
};
