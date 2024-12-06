import React, { useState, useEffect } from "react";
import "./comments.scss";
import userTemp from "../../assets/usertemp.jpg"; 

const Comments = ({ postId }) => {
  const currentUser = {
    profilePic: userTemp,
    name: "Current User",
    userId: 0,  // Replace with actual user ID
  };

  const [commentText, setCommentText] = useState(""); // state to manage comment input
  const [comments, setComments] = useState([]);

  // Fetch comments when the component mounts
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`/api/posts/${postId}/comments`);
        const data = await response.json();
        setComments(data); // Set the fetched comments into state
      } catch (error) {
        console.error("Error fetching comments:", error);
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
        const response = await fetch(`/api/posts/${postId}/comments`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newComment),
        });

        const data = await response.json();
        setComments([...comments, data]); // Add the new comment to the list
        setCommentText(""); // Reset the comment input field
      } catch (error) {
        console.error("Error submitting comment:", error);
      }
    }
  };

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
          <img src={comment.profilePicture || userTemp} alt="commenter profile" />
          <div className="info">
            <span>{comment.name}</span>
            <p>{comment.desc}</p>
          </div>
          <span className="date">1 hour ago</span>
        </div>
      ))}
    </div>
  );
};

export default Comments;
