import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import Register from "./pages/register/Register";
import Login from "./pages/login/Login";
import Home from "./pages/home/Home";
import Profile from "./pages/profile/Profile";
import ChatRoom from "./pages/chatRoom/ChatRoom";
import Navbar from "./components/navbar/Navbar"; 
import LeftBar from "./components/leftBar/LeftBar";
import RightBar from "./components/rightBar/RightBar";
import SearchResults from "./pages/searchResults/SearchResults"; // Import SearchResults component

const Layout = () => {
  const [userData, setUserData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) {
          throw new Error('No access token found');
        }

        const response = await fetch('http://localhost:5000/api/user', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
          const data = await response.json();
          console.log('User data fetched successfully:', data);  // Log the fetched user data
          setUserData(data);
          localStorage.setItem('user_id', data.id); // Store user ID in localStorage
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
        console.error('Error fetching user data:', error);
        setError('Failed to fetch user data');
      }
    };

    const fetchPosts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/random-posts');
        if (response.ok) {
          const data = await response.json();
          setPosts(data);
        } else {
          const errorData = await response.text();
          setError('Failed to fetch posts: ' + errorData);
        }
      } catch (error) {
        setError('Error fetching posts: ' + error.message);
      }
    };

    fetchUserData();
    fetchPosts();
  }, []);

  return (
    <div style={{ backgroundColor: "#1e1e1e", minHeight: "100vh" }}>
      <Navbar /> {/* Ensure Navbar is displayed on top */}
      <div style={{ display: "flex" }}>
        <LeftBar userData={userData} />
        <div style={{ flex: 6 }}>
          <Outlet />
        </div>
        <RightBar posts={posts} />
      </div>
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} /> {/* Redirect to login */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="chatroom/:postId" element={<ChatRoom />} /> {/* Dynamic route for ChatRoom */}
        </Route>
        <Route path="/profile/:userId" element={<Layout />}> {/* Ensure Profile route is accessible with Navbar */}
          <Route index element={<Profile />} />
        </Route>
        <Route path="chatroom/:postId" element={<Layout />}> {/* Ensure ChatRoom route is accessible with Navbar */}
          <Route index element={<ChatRoom />} />
        </Route>
        <Route path="/search" element={<Layout />}> {/* Add search route */}
          <Route index element={<SearchResults />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;