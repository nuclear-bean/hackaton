import {useState} from 'react';
import ChatWindow from './ChatWindow';
import MessageInput from './MessageInput';
import {sendMessage} from './api.js';
import './App.css';
import VoiceRecorder from "./VoiceRecorder.jsx";
import {VoiceRecorder2} from "./record/VoiceRecorder2.jsx";
import VideoRecorder from "./record/VideoRecorder.jsx";

function App() {
    const [messages, setMessages] = useState([]);

    const handleSendMessage = async (text) => {
        const newMessage = {text, sender: 'user'};
        setMessages([...messages, newMessage]);

        try {
            const response = await sendMessage(text);
            const botMessage = {text: response, sender: 'bot'};
            setMessages(prevMessages => [...prevMessages, botMessage]);
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    function initial() {
        return <>
            <p>Please describe what troubles you</p>
            <div className={'voice-recorder-wrapper'}>
                {/*<VoiceRecorder/>*/}
                <VoiceRecorder2 uploadUrl={"https://storage.googleapis.com/upload/storage/v1/b/audio-files-122/o"}/>
                <ChatWindow messages={messages}></ChatWindow>
            </div>
        </>
    }

    return (
        <div className="app">
            <h1>Rel-AI Chatbot</h1>
            <h1>Rel-AI Chatbot</h1>
            <p>Relationship mental health made simple</p>
            <VideoRecorder/>
            {/*{initial()}*/}
            {/*<ChatWindow messages={messages}/>*/}
            {/*<MessageInput onSendMessage={handleSendMessage}/>*/}
        </div>
    );
}

export default App;

