import React from 'react';
import HomeIcon from '@mui/icons-material/Home';
import ExploreIcon from '@mui/icons-material/Explore';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import Friends from '@mui/icons-material/People';
import Groups from '@mui/icons-material/Groups';
import SettingsIcon from '@mui/icons-material/Settings';
import HelpIcon from '@mui/icons-material/Help';
import defaultAvatar from '../../assets/default-avatar.png';  // Ensure the correct path for the user profile image
import './leftBar.scss';

const LeftBar = ({ userData }) => {
  return (
    <div className="leftBar">
      <div className="container">
        <div className="menu">
          <div className="user">
            <img src={userData?.profilePic || defaultAvatar} alt="User Profile" />
            <span>{userData?.username || 'User0001'}</span>
          </div>
          <div className="item">
            <HomeIcon />
            <span>Home</span>
          </div>
          <div className="item">
            <ExploreIcon />
            <span>Explore</span>
          </div>
          <div className="item">
            <BookmarkIcon />
            <span>Bookmarks</span>
          </div>
          <div className="item">
            <Friends />
            <span>Friends</span>
          </div>
          <div className="item">
            <Groups />
            <span>Groups</span>
          </div>
        </div>
        <hr />
        <div className="menu">
          <div className="item">
            <SettingsIcon />
            <span>Settings</span>
          </div>
          <div className="item">
            <HelpIcon />
            <span>Help</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeftBar;
