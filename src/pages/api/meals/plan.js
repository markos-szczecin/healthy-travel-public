import {NextApiRequest, NextApiResponse} from "next";
import {GoogleGenerativeAI} from "@google/generative-ai";
import getUserSettingsAsAdmin from '@/firebase/firestore/getUserSettingsAsAdmin';
import fetchLocalProductsAsAdmin from '@/firebase/firestore/fetchLocalProductsAsAdmin';
import getUserByAccessToken from '@/firebase/auth/getUserByAccessToken';

async function fetchLocalProducts(region) {
    let data = await fetchLocalProductsAsAdmin(region);

    if (!data) {
        return {
            region: region,
            info: 'Currently we do not have information about local products for ' + region + ". Use your own knowledge in order to compose meals."
        }
    }

    return {
        region: region,
        info: data
    }
}

const localProductsFun = {
    name: "getLocalProducts",
    parameters: {
        type: "OBJECT",
        description: "Get infomration about local products such as name, calories, prices, carbon footprint for given country/region. ",
        properties: {
            region: {
                type: "STRING",
                description: "Name of the \"region\" or \"region - country\" or \"city - country\", e.g: Portugal, Madeira - Protugal, Spain, Barcelona - Spain, Poland, etc.",
            }
        },
        required: ["region"],
    },
};

async function fetchUserSettings(uid) {
    const {result, error} = await getUserSettingsAsAdmin(uid);

    return result.data();
}

const functions = {
    getLocalProducts: ({region}) => {
        return fetchLocalProducts(region)
    }
};

/**
 *
 * @param req {NextApiRequest}
 * @param res {NextApiResponse}
 * @returns {Promise<void>}
 */
export default async function handler(req, res) {
    if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
        throw 'Gemini not configured';
    }

    let data = req.body;

    const user = await getUserByAccessToken(data._access_token);
    if (!user || !user.uid) {
        throw 'User must be logged in!';
    }

    const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
    const userPreferences = await fetchUserSettings(user.uid);

    const generativeModel = genAI.getGenerativeModel({
        model: "gemini-1.5-pro-latest",

        tools: {
            functionDeclarations: [localProductsFun],
        },
    });


    const chat = generativeModel.startChat();
    let prompt = "You are a dietitian specializing in composing meals for travelers with minimized carbon footrpint.\n";
    prompt += "You are going to be tasked to plan a meals for person traveling to specifc region with specific diet preferences, and health issues that have impact on what the traveller can or cannot eat. \n";
    prompt += "Plan meals for all days in provided Time Range. Make the meals as local-related as possible.\n";
    prompt += "Try to plan meals with as low carbon footprint as possible and containg as much local and healthy products as possible. Provide also an estimated cost of each meal, CO2/liter or CO2/kg, and calories per 100g.\n";
    prompt += "You can use localProductsFun to retreive additional product infomration for given region/country but the funcyion might return nothing. In such case use your all knowledge to provide most relevant meals to best of your ability. Do not inform the user the localProductsFun has been used\n\n';"
    prompt += "For each meal provide simple recipe of its preparation\n\n";
    prompt += "Time Range: " + data.dateFrom + " - " + data.dateTo + "\n";
    prompt += "Destination: " + data.destination + "\n";
    prompt += "Diet Preferences: " + (userPreferences.dietPreferences ? userPreferences.dietPreferences.join(', ') : '') + "\n";
    prompt += "Allergies: " + (userPreferences.allergies ? userPreferences.allergies.join(', ') : '') + "\n";
    prompt += "Diseases: " + (userPreferences.diseases ? userPreferences.diseases.join(', ') : '') + "\n";
    prompt += "Other Health Limitations: " + (userPreferences.otherHealthLimitations || '') + "\n";


    let result = await chat.sendMessage(prompt);
    const functionCalls = result.response.functionCalls();
    const call = functionCalls ? functionCalls[0] : null;

    if (call) {
        const apiResponse = await functions[call.name](call.args);
        result = await chat.sendMessage([{
            functionResponse: {
                name: 'localProductsFun',
                response: apiResponse
            }
        }]);
    }

    let response = result.response.text();

    res.status(200).send(response);
};