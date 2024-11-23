import { useState, useRef } from 'react';
import {uploadBlob} from "./upload.js";
// import './VoiceRecorder.css';

function VoiceRecorder() {
    const [isRecording, setIsRecording] = useState(false);
    const [recordedBlob, setRecordedBlob] = useState(null);
    const mediaRecorderRef = useRef(null);
    const chunksRef = useRef([]);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);

            mediaRecorderRef.current.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    chunksRef.current.push(event.data);
                }
            };

            mediaRecorderRef.current.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
                setRecordedBlob(blob);
                chunksRef.current = [];
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);
        } catch (error) {
            console.error('Error accessing microphone:', error);
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
        console.log("recorder and uploading")
        console.log(typeof recordedBlob)
        const blob = new Blob(recordedBlob, { type: 'audio/wav' })
        uploadBlob(blob)
    };

    const saveRecording = () => {
        if (recordedBlob) {
            const url = URL.createObjectURL(recordedBlob);
            const a = document.createElement('a');
            document.body.appendChild(a);
            a.style = 'display: none';
            a.href = url;
            a.download = 'voice_message.webm';
            a.click();
            window.URL.revokeObjectURL(url);
        }
    };

    return (
        <div className="voice-recorder">
            <h2>Voice Recorder</h2>
            <div className="controls">
                {!isRecording ? (
                    <button onClick={startRecording}>Start Recording</button>
                ) : (
                    <button onClick={stopRecording}>Stop Recording</button>
                )}
                {recordedBlob && (
                    <button onClick={saveRecording}>Save Recording</button>
                )}
            </div>
            <br/>
            {recordedBlob && (
                <div className="playback">
                    <audio src={URL.createObjectURL(recordedBlob)} controls />
                </div>
            )}
        </div>
    );
}

export default VoiceRecorder;

