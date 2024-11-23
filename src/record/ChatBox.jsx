import React, {useEffect, useRef} from 'react';
import './ChatBox.css';

const ChatBox = ({messages}) => {
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({behavior: "smooth"});
    };

    useEffect(scrollToBottom, [messages]);

    return (
        <>
            <br/>
            <div className="chat-box">
                <div className="chat-header">
                    <h2>Chat</h2>
                </div>
                <div className="messages-container">
                    {messages.map((message, index) => (
                        <div
                            key={index}
                            className={`message ${message.sent ? 'sent' : 'received'}`}
                        >
                            {message.text}
                        </div>
                    ))}
                    <div ref={messagesEndRef}/>
                </div>
            </div>
        </>
    );
};

export default ChatBox;

