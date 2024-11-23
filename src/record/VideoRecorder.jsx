import { useState, useRef } from 'react';
import './VideoRecorder.css';
import {uploadBlobToBucket} from "./uploadnew.js";
import ChatWindow from "../ChatWindow.jsx";
import '../index.css'
import '../ChatWindow.css'
import ChatBox from "./ChatBox.jsx";
import {sendBlobRequest} from "./postAudioFileRef.js";

const VideoRecorder = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [recordedBlob, setRecordedBlob] = useState(null);
    const videoRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const chunksRef = useRef([]);
    const accessToken = 'ya29.a0AeDClZCW8xJwhQAzo7HNNJ5Br53S9b9WZyqKE0CPsoK9YkyNgt3AvpjrYZdzN_qwZ5EkNOxH2Xv5K7S0FmPYpFYRqIsgQrlgTASuRhOm07O7Tu-yyGKGuw99zSqlNDvSwqp74rxGm4l3fREmhZdUcweN0BUBQ-xs3eCfr3P-msdO2XAaCgYKATMSARASFQHGX2Mi2LNrrdSe9tZjvlumamECVQ0182'

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
            await uploadBlobToBucket(recordedBlob, 'audio-files-122', 'video-2', accessToken)
            const result = await sendBlobRequest();
            let data = JSON.parse(result);
            console.log(data)
            let message = combineTextFields(data)
            message = message.replace(/  +/g, ' ');
            console.log(message)
            setMessages((prevMessages) => [...prevMessages, message]);
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
            {/*{recordedBlob && (*/}
            {/*    <video*/}
            {/*        className="recorded-video"*/}
            {/*        src={URL.createObjectURL(recordedBlob)}*/}
            {/*        controls*/}
            {/*    />*/}
            {/*)}*/}
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
                {/*{recordedBlob && (*/}
                {/*    <button className="download-button" onClick={downloadVideo}>*/}
                {/*        Download Video*/}
                {/*    </button>*/}
                {/*)}*/}
            </div>
            <ChatBox messages={messages}/>
        </div>
    );
};

export default VideoRecorder;

