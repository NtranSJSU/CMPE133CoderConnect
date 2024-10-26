import React from "react";
import "./Profile.scss";
import PlaceIcon from "@mui/icons-material/Place";
import LanguageIcon from "@mui/icons-material/Language";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Posts from "../../components/posts/posts";
import banner from '../../assets/banner.jpg'; 
import dogpfp from '../../assets/dog.png'; 


const Profile = () => {
  return (
    <div className="profile">
      <div className="images">
        <img
          src= {banner}
          alt="Cover"
          className="cover"
        />
      </div>
      <div className="profileContainer">
        <div className="uInfo">
          <div className="left">
            <img
              src= {dogpfp}
              alt="Profile"
              className="profilePic"
            />
          </div>
          <div className="center">
            <span>CoolCatPerson</span>
            <div className="info">
              <div className="item">
                <PlaceIcon />
                <span>USA, California</span>
              </div>
              <div className="item">
                <LanguageIcon />
                <span>User01.linkdin</span>
              </div>
            </div>
          </div>
          <div className="right">
            <EmailOutlinedIcon />
            <MoreVertIcon />
            <button>Follow</button>
          </div>
        </div>
        <Posts />
      </div>
    </div>
  );
};

export default Profile;
