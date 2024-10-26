import "./navbar.scss";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import CreateIcon from '@mui/icons-material/Create';
import { Link } from "react-router-dom";
import PostPopup from "./PostPopup"; 
import { useState } from "react";

const Navbar = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false); 

  return (
    <div className="navbar">
      <div className="left">
        <Link to="/" style={{ textDecoration: "none" }}>
          <span>CoderConnect</span>
        </Link>
        <div className="search">
          <SearchOutlinedIcon />
          <input type="text" placeholder="Search..." />
        </div>
      </div>
      <div className="right">
        <NotificationsOutlinedIcon />
        <button className="button" onClick={() => setIsPopupOpen(true)}>
          <CreateIcon style={{ marginRight: "5px" }} /> 
          Create Post
        </button>
      </div>
      {isPopupOpen && (
        <PostPopup onClose={() => setIsPopupOpen(false)} />
      )}
    </div>
  );
};

export default Navbar;
