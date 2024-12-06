import React, { useState, useEffect } from "react";
import "./Profile.scss";
import PlaceIcon from "@mui/icons-material/Place";
import LanguageIcon from "@mui/icons-material/Language";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Posts from "../../components/posts/posts";
import banner from '../../assets/banner.jpg'; 
import defaultPfp from '../../assets/dog.png';  // Fallback profile picture

const Profile = () => {
  const [user, setUser] = useState(null);  // Initially no user data
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user profile when the component loads
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch('/api/profile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,  
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data);
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
  }, []); 

  if (isLoading) {
    return <div>Loading...</div>;  
  }

  if (!user) {
    return <div>Error: User not found</div>;  // Error message if user data is missing
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
              src={user.profilePic ? user.profilePic : defaultPfp}  // Use fetched profilePic or fallback
              alt="Profile"
              className="profilePic"
            />
          </div>
          <div className="center">
            <span>{user.userID}</span>  
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
        <Posts posts={user.posts} />  {/* Pass the user's posts to the Posts component */}
      </div>
    </div>
  );
};

export default Profile;
