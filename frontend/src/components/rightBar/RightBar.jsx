import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './rightBar.scss';
import catpfp from '../../assets/catpfp.png'; 
import chaticon from '../../assets/chaticon.png'; 
import { Link } from 'react-router-dom'; 

const RightBar = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/random-posts');
        setPosts(response.data);
      } catch (error) {
        setError('Error fetching posts: ' + error.message);
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

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
