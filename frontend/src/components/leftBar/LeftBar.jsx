import React, { useState, useEffect } from 'react';
import './leftBar.scss';
import HomeIcon from '@mui/icons-material/Home';
import ExploreIcon from '@mui/icons-material/Explore';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import Friends from '@mui/icons-material/People';
import Groups from '@mui/icons-material/Groups';
import SettingsIcon from '@mui/icons-material/Settings';
import HelpIcon from '@mui/icons-material/Help';
import { Link } from 'react-router-dom'; // For linking navigation

const LeftBar = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Function to fetch user data
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/user', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`, // Assuming JWT token is in local storage
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data);
        } else {
          console.error('Failed to fetch user data');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  if (!user) {
    return <div>Loading...</div>;  // Show loading state until user data is fetched
  }

  return (
    <div className="leftBar">
      <div className="container">
        <div className="menu">
          <div className="user">
            <img
              src={user.profile_picture || 'default-avatar.png'}  // Fallback to a default image if no profile picture is available
              alt="User Profile"
            />
            <span>{user.username}</span>
          </div>
          
          <Link to="/" className="item">
            <HomeIcon />
            <span>Home</span>
          </Link>
          <Link to="/explore" className="item">
            <ExploreIcon />
            <span>Explore</span>
          </Link>
          <Link to="/bookmarks" className="item">
            <BookmarkIcon />
            <span>Bookmarks</span>
          </Link>
          <Link to="/friends" className="item">
            <Friends />
            <span>Friends</span>
          </Link>
          <Link to="/groups" className="item">
            <Groups />
            <span>Groups</span>
          </Link>
        </div>

        <hr />

        <div className="menu">
          <Link to="/settings" className="item">
            <SettingsIcon />
            <span>Settings</span>
          </Link>
          <Link to="/help" className="item">
            <HelpIcon />
            <span>Help</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LeftBar;
