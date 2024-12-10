
import React from 'react';

const Post = ({ post }) => {
  if (!post) {
    return null; // Return null if post is undefined
  }

  return (
    <div className="post">
      <h2>{post.title}</h2>
      <p>{post.content}</p>
      {post.comments && post.comments.length > 0 && (
        <div className="comments">
          <h3>Comments</h3>
          <ul>
            {post.comments.map((comment, index) => (
              <li key={index}>{comment.text}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Post;