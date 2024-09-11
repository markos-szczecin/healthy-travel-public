'use client';

import React, {useState, useEffect} from 'react';
import Select from 'react-select';
import saveUserSettings from "@/firebase/firestore/saveUserSettings";
import getUserSettings from "@/firebase/firestore/getUserSettings";
import { useLoading } from '@/context/LoadingContext';
import Alert from "@mui/material/Alert";
import diseaseOptions from "./disease_options";
import allergyOptions from "./allergy_options";
import dietOptions from "./diet_options";
import AudioComponent from "../../../component/AudioComponent";
import addAudioElement from "@/component/addAudioElement";

const customStyles = {
    control: (provided) => ({
        ...provided,
        padding: '2px',
        borderRadius: '0.5rem',
        borderColor: 'rgba(209, 213, 219, var(--tw-border-opacity))', // Using Tailwind's gray-300
        width: '100%', // Ensuring the select takes full width
    }),
    multiValue: (provided) => ({
        ...provided,
        backgroundColor: 'rgba(229, 231, 235, var(--tw-bg-opacity))', // Tailwind's gray-200
    }),
    option: (provided, state) => ({
        ...provided,
        backgroundColor: state.isSelected ? 'rgba(59, 130, 246, var(--tw-bg-opacity))' : 'white', // Tailwind's blue-500
        color: state.isSelected ? 'white' : 'black',
    }),
};

let userSettings = null;

const Page = () => {
    const [isDataLoading, setIsDataLoading] = useState(false);
    const { showLoading, hideLoading } = useLoading();
    const [record, setRecord] = useState(null);

    const [formData, setFormData] = useState({
        dietPreferences: [],
        allergies: [],
        diseases: [],
        otherHealthLimitations: '',
    });

    const [ isSuccess, setIsSuccess ] = useState(false);
    const [ errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        setErrorMessage('');

        initUserSettings();
    }, [])

    const setAudioElement = async (blob) => {
        showLoading();
        setRecord(await addAudioElement(blob));
        hideLoading();
    };

    const handleAudioSubmit = async (e) => {
        showLoading();
        const response = await fetch("/api/gemini/transcript", {
            method: "POST",
            headers: new Headers({'content-type': 'application/json'}),
            body: JSON.stringify({
                example: {
                    info: 'put here diet preferences and health issues/limitations and any other diet/health detials extracted from audio'
                },
                recordUrl: record
            }),
        });
        await response.json().then(function (res) {
            if (res.info) {
                formData.otherHealthLimitations = res.info;
                setFormData(formData);
            }
            return res;
        }).catch(function (e) {
            console.error(e)
            return null;
        });
        hideLoading();
    };


    function initUserSettings() {
        showLoading();
        const settings = fetchUserSettings();

        settings.then(function (data) {
            if (data) {
                setFormData(data);
            }
            hideLoading();
        }).catch(function (e) {
            setErrorMessage(e.toString());
            hideLoading();
        })
    }

    async function fetchUserSettings() {
        const {result, error} = await getUserSettings();

        return result.data();
    }

    const handleMultiChange = (option, action) => {
        setFormData({
            ...formData,
            [action.name]: option ? option.map(item => item.value) : []
        });
    };

    const handleTextareaChange = (e) => {
        setFormData({
            ...formData,
            otherHealthLimitations: e.target.value
        });
    };

    async function handleSubmit(e) {
        e.preventDefault();
        setIsSuccess(false)
        setErrorMessage('');
        showLoading()
        const {result, error} = await saveUserSettings(formData)
        hideLoading();

        if (error) {
            setErrorMessage(error.toString());

            return console.log(error)
        } else {
            setIsSuccess(true);
        }
    }

    const options = {
        diets: dietOptions,
        allergies: allergyOptions,
        diseases: diseaseOptions
    };

    return (
        <>
            <div className="max-w-4xl mx-auto px-4 py-8">
                <AudioComponent
                    setAudioElement={setAudioElement}
                    handleAudioSubmit={handleAudioSubmit}
                    record={record}
                />
                <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                    <div className="mb-4">
                        <label htmlFor="diet-preferences" className="block text-gray-700 text-sm font-bold mb-2">
                            Diet Preference
                        </label>
                        <Select
                            id="diet-preferences"
                            name="dietPreferences"
                            options={options.diets}
                            isMulti
                            value={formData.dietPreferences.map((value) => {
                                return options.diets.find(o => o.value === value);
                            })}
                            onChange={handleMultiChange}
                            styles={customStyles}
                            className="basic-multi-select"
                            classNamePrefix="select"
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="allergies" className="block text-gray-700 text-sm font-bold mb-2">
                            Allergies
                        </label>
                        <Select
                            id="allergies"
                            name="allergies"
                            options={options.allergies}
                            value={formData.allergies.map((value) => {
                                return options.allergies.find(o => o.value === value);
                            })}
                            isMulti
                            onChange={handleMultiChange}
                            styles={customStyles}
                            className="basic-multi-select"
                            classNamePrefix="select"
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="diseases" className="block text-gray-700 text-sm font-bold mb-2">
                            Diseases
                        </label>
                        <Select
                            id="diseases"
                            name="diseases"
                            options={options.diseases}
                            isMulti
                            value={formData.diseases.map((value) => {
                                return options.diseases.find(o => o.value === value);
                            })}
                            onChange={handleMultiChange}
                            styles={customStyles}
                            className="basic-multi-select"
                            classNamePrefix="select"
                        />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="other-health-limitations"
                               className="block text-gray-700 text-sm font-bold mb-2">
                            Other Diet Preferences and Health Limitations
                        </label>
                        <textarea
                            id="other-health-limitations"
                            name="otherHealthLimitations"
                            value={formData.otherHealthLimitations}
                            onChange={handleTextareaChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>

                    <button type="submit"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                        Submit
                    </button>
                    <div style={{marginTop: 10}}>
                        {isSuccess ? <Alert severity="success">Your preferences has been saved</Alert> : ''}
                    </div>
                    <div style={{marginTop: 10}}>
                        {errorMessage ? <Alert severity="error">{errorMessage}</Alert> : ''}
                    </div>
                </form>
            </div>
        </>
    );
};

export default Page;
