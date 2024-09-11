'use client'

import React, {useEffect, useState} from 'react';
import {useForm, Controller} from 'react-hook-form';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Select from 'react-select';
import {addDays, isBefore, parseISO} from 'date-fns';
import {useRouter} from 'next/navigation';
import {useLoading} from '@/context/LoadingContext';
import {getAuth} from "firebase/auth";
import Alert from '@mui/material/Alert';
import {remark} from 'remark';
import html from 'remark-html';
import moment from 'moment-timezone';
import {AudioRecorder} from "react-audio-voice-recorder";
import {getStorage, ref, uploadBytes, getDownloadURL} from "firebase/storage";
import addAudioElement from "@/component/addAudioElement";
import AudioComponent from "../../../component/AudioComponent";

export default function Form() {
    const [record, setRecord] = useState(null);
    const {register, handleSubmit, control, watch, formState: {errors}, setValue} = useForm();
    const router = useRouter();

    const {hideLoading, showLoading} = useLoading();
    const [isSuccess, setIsSuccess] = useState(false);
    const [nutritionPlan, setNutritionPlan] = useState(false);

    useEffect(() => {
        hideLoading();
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
                    destination: 'put trip destination extracted from the audio record',
                    dateFrom: 'put trip start date extracted from the audio record in format YYYY-MM-DD',
                    dateTo: 'put trip end date extracted from the audio record in format YYYY-MM-DD'
                },
                recordUrl: record
            }),
        });
        await response.json().then(function (res) {
            if (res.destination) {
                setValue('destination', res.destination);
            }
            if (res.dateFrom) {
                let newDate = new Date(res.dateFrom);
                setValue('dateFrom', newDate);
            }
            if (res.dateTo) {
                let newDate = new Date(res.dateTo);
                setValue('dateTo', newDate);
            }
            if (res.otherPreferences) {
                setValue('otherPreferences', res.otherPreferences);
            }
            return res;
        }).catch(function (e) {
            console.error(e)
            return null;
        });
        hideLoading();
    };

    const onDateChange = (selectedDate) => {
        var momentObject = moment(selectedDate);
        momentObject.tz('UTC', true)

        return momentObject.format('YYYY-MM-DD');
    };

    const processResponse = async (text) => {
        const processedContent = await remark()
            .use(html)
            .process(text);

        return processedContent.toString();
    };

    const onSubmit = async (data) => {
        showLoading()
        setIsSuccess(false)
        let token = await getAuth().currentUser.getIdToken(/* forceRefresh */ true);
        data['_access_token'] = token;

        const response = await fetch("/api/meals/plan", {
            method: "POST",
            headers: new Headers({'content-type': 'application/json'}),
            body: JSON.stringify(data),
        });

        setNutritionPlan('');

        await response.text().then(function (res) {
            setIsSuccess(true);
            processResponse(res).then(function (html) {
                setNutritionPlan(html);
            })
            return res;
        }).catch(function (e) {
            console.error(e)
            return null;
        });

        var scorllInterval = setInterval(function () {
            const el = document.getElementById('response-meals');
            if (!el) {
                return;
            }

            el.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
            clearInterval(scorllInterval);
        }, 100);

        hideLoading();
    };

    const dateFrom = watch('dateFrom');
    let isoDateFrom = null;
    if (dateFrom) {
        isoDateFrom = new Date(dateFrom.toString());
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <AudioComponent
                setAudioElement={setAudioElement}
                handleAudioSubmit={handleAudioSubmit}
                record={record}
            />
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded shadow-md w-full max-w-md">
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Destination</label>

                    <input
                        type="text"
                        {...register('destination', {required: 'Destination is required'})}
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                    />
                    {errors.destination &&
                        <p className="text-red-500 text-sm mt-1">{errors.destination.message}</p>}
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Date from</label>
                    <Controller
                        control={control}
                        name="dateFrom"

                        rules={{
                            required: 'Date from is required',
                            // validate: value => !isBefore(value, new Date()) || 'Past dates are not allowed'
                        }}
                        render={({field}) => (
                            <DatePicker
                                {...field}
                                autoComplete="off"
                                selected={field.value}
                                minDate={new Date()}
                                onChange={(date) => field.onChange(onDateChange(date))}
                                dateFormat="yyyy-MM-dd"
                                className="w-full px-3 py-2 border border-gray-300 rounded"
                            />
                        )}
                    />
                    {errors.dateFrom && <p className="text-red-500 text-sm mt-1">{errors.dateFrom.message}</p>}
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Date to</label>
                    <Controller
                        control={control}
                        name="dateTo"
                        rules={{
                            required: 'Date to is required',
                            validate: value => {
                                if (!dateFrom) {
                                    return 'Please select Date from first';
                                }
                                return isBefore(dateFrom, value) || 'Date to must be after Date from';
                            },
                        }}
                        render={({field}) => (
                            <DatePicker
                                {...field}
                                autoComplete="off"
                                selected={field.value}
                                onChange={(date) => field.onChange(onDateChange(date))}
                                dateFormat="yyyy-MM-dd"
                                className="w-full px-3 py-2 border border-gray-300 rounded"
                                minDate={addDays(dateFrom || new Date(), 1)}
                            />
                        )}
                    />
                    {errors.dateTo && <p className="text-red-500 text-sm mt-1">{errors.dateTo.message}</p>}
                </div>

                <button
                    type="submit"
                    className="w-full px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
                >
                    Plan
                </button>
            </form>
            {nutritionPlan ?
                <div id="response-meals"
                     className="nutrition-response data-response bg-white p-6 rounded shadow-md w-full max-w-md">
                    <div className="content" dangerouslySetInnerHTML={{__html: nutritionPlan}}></div>
                </div>
                : ''
            }
        </div>
    );
}
