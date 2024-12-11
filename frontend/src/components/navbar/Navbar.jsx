import "./navbar.scss";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import CreateIcon from '@mui/icons-material/Create';
import { Link } from "react-router-dom";
import PostPopup from "./PostPopup"; 
import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const Navbar = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false); 
  const [searchQuery, setSearchQuery] = useState(""); // Add state for search query
  const navigate = useNavigate(); 

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value); 
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search?query=${searchQuery}`); 
    }
  };

  return (
    <div className="navbar">
      <div className="left">
        <Link to="/home" style={{ textDecoration: "none" }}>
          <span>CoderConnect</span>
        </Link>
        <div className="search">
          <SearchOutlinedIcon onClick={handleSearch} style={{ cursor: "pointer" }} /> {/* Add onClick to icon */}
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearchChange} // Add onChange handler
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()} // Handle Enter key press
          />
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