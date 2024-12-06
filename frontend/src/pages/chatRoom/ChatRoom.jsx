import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './ChatRoom.scss';

const ChatRoom = () => {
  const { postId } = useParams();  // Access the dynamic postId from the URL
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [username, setUsername] = useState(''); // Get the logged-in username
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Fetch messages for the specific post (postId)
    const fetchMessages = async () => {
      try {
        const response = await fetch(`/api/posts/${postId}/chat`);
        const data = await response.json();
        setMessages(data.messages);  // Populate the initial messages
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();

    // Set up WebSocket connection for real-time messaging
    const ws = new WebSocket(`ws://localhost:5000/ws/chat/${postId}`);
    setSocket(ws);

    // Listen for incoming messages
    ws.onmessage = (event) => {
      const incomingMessage = JSON.parse(event.data);
      setMessages((prevMessages) => [...prevMessages, incomingMessage]);
    };

    // Clean up WebSocket connection on component unmount
    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [postId]);

  const handleSendMessage = async (event) => {
    event.preventDefault();
    if (message.trim()) {
      const newMessage = {
        username,
        text: message,
        postId,
      };

      // Send the message to the WebSocket server
      socket.send(JSON.stringify(newMessage));

      // Optionally, you could send it to a backend API as well to store the message in the database
      // const response = await fetch(`/api/posts/${postId}/chat`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(newMessage),
      // });
      // const data = await response.json();

      // Update the messages state with the newly sent message
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setMessage('');
    }
  };

  return (
    <div className="chatroom">
      <h2>Chat Room for Post {postId}</h2>

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
          placeholder="Type your message..."
        />
        <button type="submit" onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatRoom;
