import React, { useState } from 'react';
import './PostPopup.scss';

const PostPopup = ({ onClose }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [image, setImage] = useState(null);

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            setImage(file);
        } else {
            alert('Please upload a valid image file.');
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        alert('Post created!'); 
        setTitle('');
        setContent('');
        setImage(null);
        onClose(); 
    };

    return (
        <div className="popup">
            <div className="popup-content">
                <span className="close-button" onClick={onClose}>&times;</span>
                <h2>Create a New Post</h2>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="postTitle">Title:</label>
                    <input 
                        type="text" 
                        id="postTitle" 
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)} 
                        required 
                    />
                    <label htmlFor="postContent">Content:</label>
                    <textarea 
                        id="postContent" 
                        value={content} 
                        onChange={(e) => setContent(e.target.value)} 
                        required 
                    />
                    <label htmlFor="postImage">Upload Image:</label>
                    <input 
                        type="file" 
                        id="postImage" 
                        accept="image/*" 
                        onChange={handleImageChange} 
                    />
                    {image && <p>Image selected: {image.name}</p>}
                    <button type="submit">Post</button>
                </form>
            </div>
        </div>
    );
};

export default PostPopup;
