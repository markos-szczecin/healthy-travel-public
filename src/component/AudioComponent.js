import {AudioRecorder} from "react-audio-voice-recorder";
import React from "react";

export default  function AudioComponent({setAudioElement, handleAudioSubmit, record})  {
    return (
        <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
            <div className="record-secton"
                 style={{display: "flex", justifyContent: 'center', flexWrap: 'wrap', flexDirection: 'column'}}>
                <div>
                    <AudioRecorder
                        onRecordingComplete={setAudioElement}
                        audioTrackConstraints={{
                            noiseSuppression: true,
                            echoCancellation: true,
                        }}
                        downloadFileExtension="webm"
                    />
                </div>

                <div>You can record yourself and click button below*</div>
            </div>
            <button
                onClick={handleAudioSubmit}
                type="submit"

                disabled={!record}
                className="w-full record-button px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
            >
                Fill from Transcript
            </button>
            <div><small>*You agree to store your recording on our server for transcription purpose only</small></div>
        </div>
    )
}