import React, { useState } from 'react';
import './ChatRoom.scss';

const ChatRoom = () => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([
        { username: 'User1', text: 'About the question' },
        { username: 'User2', text: 'sup' },
    ]);
    const [username, setUsername] = useState('User1'); 

    const handleSendMessage = (event) => {
        event.preventDefault();
        if (message.trim()) {
            setMessages([...messages, { username, text: message }]);
            setMessage(''); 
        }
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleSendMessage(event); 
        }
    };

    return (
        <div className="chatroom">
            <h2>Chat Room</h2>
            <div className="chatbox">
                {messages.map((msg, index) => (
                    <div key={index} className="message">
                        <strong>{msg.username}: </strong>{msg.text}
                    </div>
                ))}
            </div>
            <div className="input-container">
                <input 
                    type="text" 
                    value={message} 
                    onChange={(e) => setMessage(e.target.value)} 
                    onKeyPress={handleKeyPress} 
                    placeholder="Type your message..." 
                    required 
                />
                <button type="submit" onClick={handleSendMessage}>Send</button>
            </div>
        </div>
    );
};

export default ChatRoom;
