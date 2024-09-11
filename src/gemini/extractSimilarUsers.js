import { GoogleGenerativeAI } from "@google/generative-ai";
import fetchLocalProductsAsAdmin from "@/firebase/firestore//fetchSimilarUsersAsAdmin";
import adminApp from "@/firebase/config-admin";
import {initializeFirestore, getFirestore} from "firebase-admin/firestore";

const db = getFirestore(adminApp, process.env.NEXT_PUBLIC_FIREBASE_DB_ID)

export default async function extractSimilarUsers(tripData, currentUid) {
    if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
        throw 'Gemini not configured';
    }

    let users = await fetchLocalProductsAsAdmin(tripData.destination, tripData.dateFrom, tripData.dateTo, currentUid);

    const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

    const generativeModel = genAI.getGenerativeModel({
        model: "gemini-1.5-pro-latest",
        generationConfig: { responseMimeType: "application/json" }
    });

    const chat = generativeModel.startChat();
    let prompt = "Among available travellers find the ones with similar trip preferences and similar time range of the planned travel.\n"
    prompt += 'Similar traveler means: Destination must be the same or very similar, time range overlaps at leat partly the provided Time Range and preferences are at least partly the same as Trip Preferences or Extra Trip Preferences\n'
    prompt += "As a response provide list of uid using this JSON schema: [{\"uid\": \"uid of user A\"}, {\"uid\": \"uid of user B\"}]" + "\n";
    prompt += "Destination: " + (tripData.destination || '') + "\n";
    prompt += "Trip Preferences: " + (tripData.preferences ? tripData.preferences.join(', ') : '') + "\n";
    prompt += "Extra Trip preferences: " + (tripData.otherPreferences || '') + "\n";
    prompt += "Time Range: " + tripData.dateFrom + " - " + tripData.dateTo + "\n\n";
    prompt += "Available Travelers: " + JSON.stringify(users);

    const result = await chat.sendMessage(prompt);

    try {
        return JSON.parse(result.response.text());
    } catch (e) {
        console.error(e);
        return [];
    }
}
