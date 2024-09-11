import {NextApiRequest, NextApiResponse} from "next";
import { GoogleGenerativeAI } from "@google/generative-ai";
import addTrip from "@/firebase/firestore/addTrip";
import extractSimilarUsers from "@/gemini/extractSimilarUsers";
import fetchLocalProductsAsAdmin from "@/firebase/firestore//fetchSimilarUsersAsAdmin";
import getUserByAccessToken from '@/firebase/auth/getUserByAccessToken';
import notifyUsers from "@/firebase/firestore/notifyUsersAsAdmin";
import fetchLatestRegionInfo from "@/firebase/firestore/fetchLatestRegionInformation";

async function fetchLatestRegionInformation(region) {
    return await fetchLatestRegionInfo(region)
}

const latestInformation = {
    name: "getLatestRegionInformation",
    parameters: {
        type: "OBJECT",
        description: "Get latest information about the specific region/country/city. " +
            "Find out the temporary limitations, current trends, events, restrictions. " +
            "What places might be closed, what new places are going to be open, and any othere interesting, helpful information." +
            " Everything that might have any impact on traveling throught the region",
        properties: {
            region: {
                type: "STRING",
                description: "Name of the \"country\" or \"region - country\" or \"city - country\", e.g: Portugal, Madeira - Protugal, Spain, Barcelona - Spain, Poland, etc.",
            }
        },
        required: ["region"],
    },
};

const functions = {
    getLatestRegionInformation: ({ region }) => {
        return fetchLatestRegionInformation( region)
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
    const aToken = data._access_token;

    if (data.searchPeople) {
        await addTrip(data);
    }

    const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

    const generativeModel = genAI.getGenerativeModel({
        model: "gemini-1.5-pro-latest",

        tools: {
            functionDeclarations: [latestInformation],
        },
    });


    const chat = generativeModel.startChat();
    let prompt = "You are are a proffesional trip planner, specialized in planning environment-friendly travels.\n";
    prompt += "You are going to be asked to plan a trip with given customer preferences. Your job is to create a concise and interesting plan of the entire trip whith as low carbon footprint as possible.\n";
    prompt += "Use getLatestRegionInformation function to get latest events in trip destination that may have impact on trip plans. Function may also provide information about temporary closed attractaions, etc. Function might return nothing. If function returns something, present that information also at the end as some NOTICE info. If function returns nothing ignore it and do not inform user about getLatestRegionInformation\n"
    prompt += 'In order to lower the footprint propose low emmision ways of transportations available in given trip destination area\n\n';
    prompt += 'Separate each seaction with line (especially each planned day) to make it to make it more legible\n\n';
    prompt += "Time range: " + data.dateFrom + " - " + data.dateTo + "\n";
    prompt += "Destination: " + data.destination + "\n";
    prompt += "Trip preferences: " + (data.preferences ? data.preferences.join(', ') : '') + "\n";
    prompt += "Extra Trip preferences: " + (data.otherPreferences || '') + "\n";


    let result = await chat.sendMessage(prompt);
    const functionCalls = result.response.functionCalls();
    const call = functionCalls ? functionCalls[0] : null;

    if (call) {
        const apiResponse = await functions[call.name](call.args);

        result = await chat.sendMessage([{functionResponse: {
                name: 'getLatestRegionInformation',
                response: apiResponse,
            }}]);
    }

    let response = result.response.text();
    const user = await getUserByAccessToken(aToken);

    if (data.searchPeople) {
        let users = await extractSimilarUsers(data, user.uid);
        let uids = [];
        users.forEach((doc) => {
            if (uids.indexOf(doc.uid) === -1) {
                uids.push(doc.uid);
            }
        });

        notifyUsers(uids, user, data);
    }

    res.status(200).send(response);
}