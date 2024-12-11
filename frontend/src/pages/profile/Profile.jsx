import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./Profile.scss";
import PlaceIcon from "@mui/icons-material/Place";
import LanguageIcon from "@mui/icons-material/Language";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Posts from "../../components/posts/Posts"; 
import banner from '../../assets/banner.jpg';
import defaultAvatar from '../../assets/default-avatar.png';  // Ensure the correct path and file existence


const Profile = () => {
  const { userId } = useParams();  // Get userId from URL parameters
  const [user, setUser] = useState(null);  // Initially no user data
  const [posts, setPosts] = useState([]); // State for user's posts
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user profile when the component loads
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) {
          throw new Error('No access token found');
        }

        const response = await fetch(`http://localhost:5000/api/profile/${userId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data);
          setPosts(data.posts); // Set user's posts
        } else {
          console.error('Failed to fetch user profile');
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [userId]);  

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Error: User not found</div>;  
  }

  return (
    <div className="profile">
      <div className="images">
        <img
          src={banner}
          alt="Cover"
          className="cover"
        />
      </div>
      <div className="profileContainer">
        <div className="uInfo">
          <div className="left">
            <img
              src={user.profile_picture ? user.profile_picture : defaultAvatar} 
              alt="Profile"
              className="profilePic"
            />
          </div>
          <div className="center">
            <span>{user.username}</span>
            <div className="info">
              <div className="item">
                <PlaceIcon />
                <span>{user.location}</span>
              </div>
              <div className="item">
                <LanguageIcon />
                <span>{user.link ? user.link : 'No link provided'}</span>
              </div>
            </div>
          </div>
          <div className="right">
            <EmailOutlinedIcon />
            <MoreVertIcon />
            <button>Follow</button>
          </div>
        </div>
        <Posts posts={posts.map(post => ({ ...post, username: user.username }))} />  {/* Pass the user's username to each post */}
      </div>
    </div>
  );
};

export default Profile;
