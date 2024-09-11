import transcriptAudio from '@/gemini/transcriptAudio';
import fs from 'fs';
import path from 'path';
import ffmpeg from 'fluent-ffmpeg';
import { promisify } from 'util';

export default async function handler(req, res) {
    let data = req.body;

    if (!data.example || !data.recordUrl) {
        return res.status(400).send({ message: 'No file provided' });
    }


    const response = await transcriptAudio(data.example, data.recordUrl)

    res.status(200).send(response);
}