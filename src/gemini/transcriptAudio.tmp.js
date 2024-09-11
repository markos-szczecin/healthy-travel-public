import {GoogleGenerativeAI} from "@google/generative-ai";
import { FFmpeg } from '@ffmpeg/ffmpeg';

const blobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
};

async function convertWebmToMp3(webmBlob) {
    // let response = await fetch(recordUrl);
    // if (!response.ok) {
    //     throw new Error('Network response was not ok');
    // }

    // const blob = await response.blob();
    // console.log(blob);
    const ffmpeg = new FFmpeg({ log: true });

    await ffmpeg.load();

    const arrayBuffer = await webmBlob.arrayBuffer();

    ffmpeg.writeFile('input.webm', new Uint8Array(arrayBuffer));

    await ffmpeg.exec('-i', 'input.webm', 'output.mp3');

    const mp3Data = ffmpeg.readFile('output.mp3');

    const mp3Blob = new Blob([mp3Data.buffer], { type: 'audio/mp3' });

    return mp3Blob;
}

export default async function transcriptAudio(expectedResponseExample, recordUrl) {
    const base64AudioFile = await blobToBase64(await convertWebmToMp3(recordUrl));

    const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

    console.log(base64AudioFile);
    const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        generationConfig: { responseMimeType: "application/json" }
    });

    const textPart = "Please provide a summary for the audio in JSON format as follows\n\n" + JSON.stringify(expectedResponseExample);

    const result = await model.generateContent([
        {
            inlineData: {
                mimeType: "audio/mp3",
                data: base64AudioFile
            }
        },
        { text: textPart },
    ]);

    let contentResponse = result.response.text();


    return contentResponse;
}