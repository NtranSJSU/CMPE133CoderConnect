import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Import axios
import "./rightBar.scss";
import catpfp from '../../assets/catpfp.png'; 
import chaticon from '../../assets/chaticon.png'; 
import { Link } from 'react-router-dom'; 

const RightBar = () => {
  const [posts, setPosts] = useState([]);

  // Fetch random posts from the API
  useEffect(() => {
    axios.get('/api/random-posts')  // Make sure this matches your backend route
      .then(response => {
        setPosts(response.data);  // Set the random posts from the response
      })
      .catch(error => {
        console.error("Error fetching posts:", error);
      });
  }, []);

  return (
    <div className="rightBar">
      <div className="container">
        <div className="item">
          <span>Connect with other Coders</span>
          {/* Render users here if necessary */}
        </div>
        
        <div className="item">
          <span>Chat Rooms</span>
          {/* Display random posts with their respective chatrooms */}
          {posts.map((post) => (
            <Link to={`/chatroom/${post.id}`} key={post.id} style={{ textDecoration: 'none' }}>
              <div className="user">
                <div className="userInfo">
                  <img src={chaticon} alt="Chat Icon" />
                  <div className="online" />
                  <span>Post: "{post.description.slice(0, 30)}..."</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RightBar;
