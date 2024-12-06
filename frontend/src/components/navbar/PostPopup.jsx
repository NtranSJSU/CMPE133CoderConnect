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

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Create a FormData object to send data, including image
        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        if (image) formData.append('image', image);

        try {
            const response = await fetch('/api/posts', {
                method: 'POST',
                body: formData,
                headers: {
                    // Include any necessary headers like authentication token if needed
                },
            });

            if (response.ok) {
                alert('Post created successfully!');
                setTitle('');
                setContent('');
                setImage(null);
                onClose(); // Close the popup
            } else {
                alert('Failed to create post. Please try again.');
            }
        } catch (error) {
            console.error('Error creating post:', error);
            alert('An error occurred. Please try again.');
        }
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
