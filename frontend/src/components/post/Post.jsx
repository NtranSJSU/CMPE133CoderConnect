import "./post.scss";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Link, useNavigate } from "react-router-dom";
import Comments from "../comments/Comments";
import { useState, useEffect } from "react";
import defaultAvatar from "../../assets/default-avatar.png";  // Correct path for the profile picture
import moment from "moment";  // Import moment for date formatting

const Post = ({ post }) => {
  const [commentOpen, setCommentOpen] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(post.likes);  // Initialize likes state
  const [commentsCount, setCommentsCount] = useState(post.comments);  // Initialize comments count state

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

  useEffect(() => {
    setLikes(post.likes);
    setCommentsCount(post.comments);
  }, [post]);

  return (
    <div className="post">
      <div className="container">
        <div className="user">
          <div className="userInfo">
            <img src={post.profilePic || defaultAvatar} alt="" />  {/* Use defaultAvatar if profilePic is missing */}
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
          <MoreHorizIcon />
        </div>
        <div className="content">
          <p>{post.description}</p>
          {post.image_url ? (
            <img src={post.image_url} alt="" />
          ) : (
            post.image_data && <img src={`data:image/jpeg;base64,${post.image_data}`} alt="" />
          )}
        </div>
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
