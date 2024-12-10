import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './ChatRoom.scss';

const ChatRoom = () => {
  const { postId } = useParams();  // Access the dynamic postId from the URL
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [username, setUsername] = useState(''); // Get the logged-in username
  const [socket, setSocket] = useState(null);
  const [users, setUsers] = useState([]); // List of users in the room

  useEffect(() => {
    // Fetch messages for the specific post (postId)
    const fetchMessages = async () => {
      try {
        const response = await fetch(`/api/chatroom/${postId}`);
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
          const data = await response.json();
          setMessages(data);  // Populate the initial messages
        } else {
          const text = await response.text();
          console.error('Received non-JSON response:', text);  // Log the non-JSON response
          if (text.includes("<!DOCTYPE html>")) {
            console.error('HTML response received, check if the endpoint is correct and the server is running.');
            console.error('Response URL:', response.url);  // Log the response URL
            console.error('Response Status:', response.status);  // Log the response status
            throw new Error('Received HTML response, possibly due to a server error or incorrect endpoint');
          } else {
            throw new Error(`Received non-JSON response: ${text}`);
          }
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();

    // Set up WebSocket connection for real-time messaging
    const ws = new WebSocket(`ws://${window.location.hostname}:5000/ws/chatroom/${postId}`);
    setSocket(ws);

    // Listen for incoming messages
    ws.onmessage = (event) => {
      const incomingMessage = JSON.parse(event.data);
      setMessages((prevMessages) => [...prevMessages, incomingMessage]);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onclose = (event) => {
      console.warn('WebSocket closed:', event);
    };

    // Fetch users in the chatroom
    const fetchUsers = async () => {
      try {
        const response = await fetch(`/api/chatroom/${postId}/users`);
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
          const data = await response.json();
          setUsers(data);  // Populate the users list
        } else {
          const text = await response.text();
          console.error('Received non-JSON response:', text);  // Log the non-JSON response
          if (text.includes("<!DOCTYPE html>")) {
            console.error('HTML response received, check if the endpoint is correct and the server is running.');
            console.error('Response URL:', response.url);  // Log the response URL
            console.error('Response Status:', response.status);  // Log the response status
            throw new Error('Received HTML response, possibly due to a server error or incorrect endpoint');
          } else {
            throw new Error(`Received non-JSON response: ${text}`);
          }
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();

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

      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setMessage('');
    }
  };

  return (
    <div className="chatroom">
      <h2>Chat Room for Post {postId}</h2>

      <div className="chat-container">
        <div className="chatbox">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`message ${msg.username === username ? 'current-user' : 'other-user'}`}
            >
              <strong>{msg.username}: </strong>{msg.text}
            </div>
          ))}
        </div>

          <div className="users-list">
          <h3>Users in the Room</h3>
            <ul>
              {users.map((user, index) => (
                <li key={index}>{user.username}</li>
              ))}
            </ul>
          </div>
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
