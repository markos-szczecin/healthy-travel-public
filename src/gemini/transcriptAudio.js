import {GoogleGenerativeAI} from "@google/generative-ai";

import fs from 'fs';
import path from 'path';
import ffmpeg from 'fluent-ffmpeg';
import {promisify} from 'util';

const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);
const unlink = promisify(fs.unlink);
const mkdir = promisify(fs.mkdir);
const access = promisify(fs.access);

const blobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsArrayBuffer(blob);
    });
};

async function convertWebmToMp3(recordUrl) {
    let response = await fetch(recordUrl);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    const blob = await response.blob();
    const inputPath = '/tmp/input.webm'
    const outputPath = '/tmp/output.mp3';

    const webmBuffer = Buffer.from(await blob.arrayBuffer(), 'base64');
    await writeFile(inputPath, webmBuffer);

    await new Promise((resolve, reject) => {

        const ffmpegPath = path.join('src/ffmpeg', 'ffmpeg');
        console.log(ffmpegPath);
        ffmpeg.setFfmpegPath(ffmpegPath);
        ffmpeg(inputPath)
            .toFormat('mp3')
            .on('end', resolve)
            .on('error', reject)
            .save(outputPath);
    });

    // Read the converted file
    const mp3Buffer = await readFile(outputPath);

    // Clean up the files
    await unlink(inputPath);
    await unlink(outputPath);

    // Return the converted file as a base64 string
    return mp3Buffer.toString('base64');
}

export default async function transcriptAudio(expectedResponseExample, recordUrl) {
    const base64AudioFile = await convertWebmToMp3(recordUrl);

    const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);


    const model = genAI.getGenerativeModel({
        model: "gemini-1.5-pro-latest",
        generationConfig: {responseMimeType: "application/json"}
    });

    const year = new Date().getFullYear();
    const textPart = "Extract information for the audio in JSON format. If you can't extarct eny meanigful text from audio, respond with empty string. Bear in mind that current year is "
        + year + ". Audio might contain details about time range, including the year , explicitly like "
        + year + " or implicitly like \"next year\"\n\nExpected JSON format: " + JSON.stringify(expectedResponseExample);

    const result = await model.generateContent([
        {
            inlineData: {
                mimeType: "audio/mp3",
                data: base64AudioFile
            }
        },
        {text: textPart},
    ]);

    let contentResponse = result.response.text();

    return contentResponse;
}