import "./leftBar.scss";
import HomeIcon from '@mui/icons-material/Home';
import ExploreIcon from '@mui/icons-material/Explore';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import Friends from '@mui/icons-material/People';
import Groups from '@mui/icons-material/Groups';
import SettingsIcon from '@mui/icons-material/Settings';
import HelpIcon from '@mui/icons-material/Help';
import userProfileImage from '../../assets/usertemp.jpg'; 

const LeftBar = () => {
  return (
    <div className="leftBar">
      <div className="container">
        <div className="menu">
          <div className="user">
            <img src={userProfileImage} alt="User Profile" />
            <span>User0001</span>
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