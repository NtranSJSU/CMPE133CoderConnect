import React, { useState } from 'react';
import './PostPopup.scss';

const PostPopup = ({ onClose }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [image, setImage] = useState(null);
    const [error, setError] = useState('');

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
        formData.append('description', content);  // Use 'description' instead of 'content'
        if (image) formData.append('image', image);

        try {
            const response = await fetch('http://localhost:5000/api/posts', {  // Correct the port to 5000
                method: 'POST',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                onClose();
                window.location.reload();  // Reload the page to show the new post
            } else {
                const errorData = await response.json();
                setError('Failed to create post: ' + errorData.message);
            }
        } catch (error) {
            setError('Error creating post: ' + error.message);
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
                {error && <p className="error">{error}</p>}
            </div>
        </div>
    );
};

export default PostPopup;
