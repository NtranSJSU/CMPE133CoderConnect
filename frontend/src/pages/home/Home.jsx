import React, { useState, useEffect } from "react";
import Posts from "../../components/posts/Posts";
import "./Home.scss";
import defaultAvatar from "../../assets/default-avatar.png";  // Ensure the correct path for the default avatar

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/random-posts');
        if (response.ok) {
          const data = await response.json();
          setPosts(data);
        } else {
          const errorData = await response.json();
          setError('Failed to fetch posts: ' + errorData.message);
        }
      } catch (error) {
        setError('Error fetching posts: ' + error.message);
      }
    };

    fetchPosts();
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="Home">
      <Posts posts={posts} />
    </div>
  );
};

export default Home;