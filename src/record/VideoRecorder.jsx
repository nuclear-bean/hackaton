import React, { useState, useRef } from 'react';
import './VideoRecorder.css';
import {uploadBlobToBucket} from "./uploadnew.js";

const VideoRecorder = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [recordedBlob, setRecordedBlob] = useState(null);
    const videoRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const chunksRef = useRef([]);
    const accessToken = 'ya29.a0AeDClZAcdvWgBaohKCosAE4895_KCGdgRZjo06Q7ZAFpdOnmm6RonztU4TH_h7x8pTLdVfP7OlxGdvprEjH8d2nQR1wfDfg3ONcXlgpzy1qSiZTq56OxhOEIgsbNMREDQNZgezMWphG_y5k0ou2_h5d80SKPPfUX1xqyMOVcMKcvZgaCgYKAY8SARASFQHGX2MizlOoV6KHVWndaQCoesjxVA0181'

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            videoRef.current.srcObject = stream;
            mediaRecorderRef.current = new MediaRecorder(stream);

            mediaRecorderRef.current.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    chunksRef.current.push(event.data);
                }
            };

            mediaRecorderRef.current.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: 'video/webm' });
                setRecordedBlob(blob);
                chunksRef.current = [];
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);
        } catch (error) {
            console.error('Error accessing camera or microphone:', error);
        }
    };

    const stopRecording = async () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            videoRef.current.srcObject.getTracks().forEach(track => track.stop());
            setIsRecording(false);
            await uploadBlobToBucket(recordedBlob, 'audio-files-122', 'test', accessToken)
        }
    };

    const downloadVideo = () => {
        if (recordedBlob) {
            const url = URL.createObjectURL(recordedBlob);
            const a = document.createElement('a');
            document.body.appendChild(a);
            a.style = 'display: none';
            a.href = url;
            a.download = 'recorded-video.webm';
            a.click();
            URL.revokeObjectURL(url);
        }
    };

    return (
        <div className="video-recorder">
            <video ref={videoRef} className="video-preview" autoPlay muted playsInline />
            {recordedBlob && (
                <video
                    className="recorded-video"
                    src={URL.createObjectURL(recordedBlob)}
                    controls
                />
            )}
            <div className="controls">
                {!isRecording && (
                    <button className="record-button" onClick={startRecording}>
                        Start Recording
                    </button>
                )}
                {isRecording && (
                    <button className="stop-button" onClick={stopRecording}>
                        Stop Recording
                    </button>
                )}
                {recordedBlob && (
                    <button className="download-button" onClick={downloadVideo}>
                        Download Video
                    </button>
                )}
            </div>
        </div>
    );
};

export default VideoRecorder;

