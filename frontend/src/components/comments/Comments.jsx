import React, { useState, useEffect } from "react";
import "./comments.scss";
import userTemp from "../../assets/usertemp.jpg"; 
import moment from "moment";  // Import moment for date formatting
import defaultAvatar from "../../assets/default-avatar.png"; 

const Comments = ({ postId }) => {
  const currentUser = {
    profilePic: defaultAvatar,
    name: "Current User",
    userId: 0,  // Replace with actual user ID
  };

  const [commentText, setCommentText] = useState(""); // state to manage comment input
  const [comments, setComments] = useState([]);
  const [error, setError] = useState('');

  // Fetch comments when the component mounts
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/posts/${postId}/comments`, {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',  // Ensure CORS headers are set
          },
        });
        if (response.ok) {
          const data = await response.json();
          setComments(data);
        } else {
          const errorData = await response.json();
          setError('Failed to fetch comments: ' + errorData.message);
        }
      } catch (error) {
        setError('Error fetching comments: ' + error.message);
      }
    };
    
    fetchComments();
  }, [postId]); // Only re-fetch if postId changes

  const handleCommentChange = (event) => {
    setCommentText(event.target.value); // Update the comment text state
  };

  const handleCommentSubmit = async () => {
    if (commentText.trim()) {
      const newComment = {
        text: commentText,
        userId: currentUser.userId, // Assuming you're sending the current user's ID
      };

      try {
        const response = await fetch(`http://localhost:5000/api/posts/${postId}/comments`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,  // Ensure the token is sent
          },
          body: JSON.stringify(newComment),
        });

        if (response.ok) {
          const data = await response.json();
          setComments([...comments, data]); // Add the new comment to the list
          setCommentText(""); // Reset the comment input field
        } else {
          const errorData = await response.json();
          setError('Failed to submit comment: ' + errorData.message);
        }
      } catch (error) {
        console.error("Error submitting comment:", error);
        setError('Error submitting comment: ' + error.message);
      }
    }
  };

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="comments">
      <div className="write">
        <img src={currentUser.profilePic} alt="user profile" />
        <input
          type="text"
          placeholder="Write a comment"
          value={commentText}
          onChange={handleCommentChange} // Manage input changes
        />
        <button onClick={handleCommentSubmit}>Send</button>
      </div>
      {comments.map((comment) => (
        <div className="comment" key={comment.id}>
          <img src={comment.profilePicture || defaultAvatar} alt="commenter profile" />
          <div className="info">
            <span>{comment.name}</span>
            <p>{comment.desc}</p>
          </div>
          <span className="date">{moment(comment.created_at).fromNow()}</span>  {/* Display accurate time */}
        </div>
      ))}
    </div>
  );
};

export default Comments;
