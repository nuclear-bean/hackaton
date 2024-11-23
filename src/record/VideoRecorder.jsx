import { useState, useRef } from 'react';
import './VideoRecorder.css';
import {uploadVideoBlobToBucket} from "./uploadnew.js";
import '../index.css'
import '../ChatWindow.css'
import ChatBox from "./ChatBox.jsx";
import {sendRequestToAnalyzeVideo} from "./postAudioFileRef.js";

const VideoRecorder = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [recordedBlob, setRecordedBlob] = useState(null);
    const videoRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const chunksRef = useRef([]);
    const accessToken = 'ya29.a0AeDClZDWbEGcxmnHMEI8aDX6zotjvFRuf0TluuyPx7GvotR87RdUz10k7VWfmI5bjWAXCv4JoW0TG5fo7QHKv69K4X2cFEua6E_y8VYgGeM2mTs2iXMGYt0EuZ-razurIGzMSZY4d1rKerOviymGEUjI-uHVqU_r0i5bAvK936AmhswaCgYKAS0SARASFQHGX2MiUFief4fOhVEopXAZJ7I76w0182'

    const [messages, setMessages] = useState([
        'Hello! How can I help you?'
    ])

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

    function combineTextFields(response) {
        return response
            .map(item => {
                return item.candidates
                    .map(candidate => {
                        return candidate.content.parts
                            .map(part => part.text)
                            .join(''); // Combine parts into a single string
                    })
                    .join(''); // Combine all candidates into a single string
            })
            .join(''); // Combine all items into a single string
    }

    const stopRecording = async () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            videoRef.current.srcObject.getTracks().forEach(track => track.stop());
            setIsRecording(false);
            console.log("uploading")
            console.log(recordedBlob)
            setMessages((prevMessages) => [...prevMessages, '< Video >']);
            await uploadVideoBlobToBucket(recordedBlob, 'audio-files-122', 'video-2', accessToken)
            await sleep(100);
            try {
                const result = await sendRequestToAnalyzeVideo(accessToken);
                let data = JSON.parse(result);
                console.log(data)
                let message = combineTextFields(data)
                message = message.replace(/  +/g, ' ');
                console.log(message)
                setMessages((prevMessages) => [...prevMessages, message]);
            } catch (err) {
                setMessages((prevMessages) => [...prevMessages, 'Hi, good to see you again! What\'s new?']);
            }
        }
    };

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    return (
        <div className="video-recorder">
            <video ref={videoRef} className="video-preview" autoPlay muted playsInline />
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
            </div>
            <ChatBox messages={messages}/>
        </div>
    );
};

export default VideoRecorder;

