import "./post.scss";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Link, useNavigate } from "react-router-dom";
import Comments from "../comments/Comments";
import { useState, useEffect } from "react";
import defaultAvatar from '../../assets/default-avatar.png'; 
import moment from "moment";  
import { Menu, MenuItem } from '@mui/material'; // Import Menu and MenuItem components

const Post = ({ post }) => {
  const [commentOpen, setCommentOpen] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(post.likes);  // Initialize likes state
  const [commentsCount, setCommentsCount] = useState(post.comments);  // Initialize comments count state
  const [isImageOpen, setIsImageOpen] = useState(false);  // State to manage image modal
  const [anchorEl, setAnchorEl] = useState(null); // State to manage menu anchor element
  const open = Boolean(anchorEl); // Boolean to check if menu is open

  const navigate = useNavigate(); // React Router hook to navigate programmatically

  const handleChatRoomClick = () => {
    navigate(`/chatroom/${post.id}`); // Navigate to the specific chatroom for the post
  };

  const handleLikeClick = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/posts/${post.id}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setLiked(data.liked);
        setLikes(data.likes);
      } else {
        console.error('Failed to like the post');
      }
    } catch (error) {
      console.error('Error liking the post:', error);
    }
  };

  const handleImageClick = () => {
    setIsImageOpen(true);
  };

  const handleCloseImage = () => {
    setIsImageOpen(false);
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget); // Set anchor element to the clicked element
  };

  const handleMenuClose = () => {
    setAnchorEl(null); // Close the menu
  };

  const handleDeletePost = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/posts/${post.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
      });

      if (response.ok) {
        // Handle post deletion (e.g., refresh posts or remove from UI)
        console.log('Post deleted successfully');
        window.location.reload(); // Refresh the page after deletion
      } else {
        console.error('Failed to delete the post');
      }
    } catch (error) {
      console.error('Error deleting the post:', error);
    } finally {
      handleMenuClose(); // Close the menu after action
    }
  };

  const handleFlagPost = () => {
    // Handle flagging the post (currently does nothing)
    console.log('Post flagged');
    handleMenuClose(); // Close the menu after action
  };

  useEffect(() => {
    setLikes(post.likes);
    setCommentsCount(post.comments);
  }, [post]);

  return (
    <div className="post">
      <div className="container">
        <div className="user">
          <div className="userInfo">
            <img src={post.profile_picture || defaultAvatar} alt="User Profile" />  {/* Use defaultAvatar if profile_picture is missing */}
            <div className="details">
              <Link
                to={`/profile/${post.user_id}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <span className="name">{post.username}</span>
              </Link>
              <span className="date">{moment(post.created_at).fromNow()}</span>  {/* Display accurate time */}
            </div>
          </div>
          <MoreHorizIcon onClick={handleMenuClick} /> {/* Add onClick to open menu */}
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
          >
            {post.user_id === parseInt(localStorage.getItem('user_id')) ? ( // Ensure correct comparison
              <MenuItem onClick={handleDeletePost}>Delete</MenuItem>
            ) : (
              <MenuItem onClick={handleFlagPost}>Flag</MenuItem>
            )}
          </Menu>
        </div>
        <div className="content">
          <p>{post.description}</p>
          {post.image_url ? (
            <img src={post.image_url} alt="" onClick={handleImageClick} />
          ) : (
            post.image_data && <img src={`data:image/jpeg;base64,${post.image_data}`} alt="" onClick={handleImageClick} />
          )}
        </div>
        {isImageOpen && (
          <div className="image-modal" onClick={handleCloseImage}>
            <img
              src={post.image_url || `data:image/jpeg;base64,${post.image_data}`}
              alt=""
              className="expanded-image"
            />
          </div>
        )}
        <div className="info">
          <div className="item" onClick={handleLikeClick}>
            {liked ? <FavoriteOutlinedIcon /> : <FavoriteBorderOutlinedIcon />}
            {likes} Likes  {/* Display accurate number of likes */}
          </div>
          <div className="item" onClick={() => setCommentOpen(!commentOpen)}>
            <TextsmsOutlinedIcon />
            {commentsCount} Comments  {/* Display accurate number of comments */}
          </div>
          <div className="item" onClick={handleChatRoomClick}>
            <MeetingRoomIcon />
            Chat Room
          </div>
        </div>
        {commentOpen && <Comments postId={post.id} />}  {/* Pass postId to Comments component */}
      </div>
    </div>
  );
};

export default Post;
