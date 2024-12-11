import mysql.connector
from flask import Flask, jsonify, request
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity
from flask_socketio import SocketIO, send, join_room, leave_room
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
from datetime import timedelta
import os
import bcrypt
from flask_cors import CORS
from database import db  # Import db from database.py
from models import User, Post, Message, Like  # Import models from models.py

# Run setup scripts
os.system('python setup_mysql.py')
os.system('python setup_env.py')

# Initialize app, db, jwt, and socket
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:root@localhost/coderconnect'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = 'supersecretkey'  # Secret key for JWT
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1)  # Token expires in 1 hour
app.config['UPLOAD_FOLDER'] = 'uploads/'  # Folder to save uploaded images
app.config['CORS_HEADERS'] = 'Content-Type'
db.init_app(app)  # Initialize db with app
jwt = JWTManager(app)
socketio = SocketIO(app, cors_allowed_origins="*")  # Enable CORS for SocketIO
CORS(app, resources={r"/*": {"origins": "*"}})  # Allow requests from any origin

password = 'user_password'
salt = bcrypt.gensalt()  # Generate salt
hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

# Function to create the database if it doesn't exist
def create_database_if_not_exists():
    conn = mysql.connector.connect(
        user='root', password='root', host='localhost')
    cursor = conn.cursor()
    
    # Check if the database exists
    cursor.execute("SHOW DATABASES LIKE 'coderconnect'")
    result = cursor.fetchone()
    
    if not result:
        # Create the database if it does not exist
        cursor.execute("CREATE DATABASE coderconnect")
        print("Database 'coderconnect' created.")
    else:
        print("Database 'coderconnect' already exists.")
    
    cursor.close()
    conn.close()

# Call the function to create the database
create_database_if_not_exists()

# Routes
@app.route('/api/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')

        if not username or not email or not password:
            return jsonify({'message': 'Missing required fields'}), 400

        # Check if user already exists
        existing_user = User.query.filter((User.username == username) | (User.email == email)).first()
        if existing_user:
            return jsonify({'message': 'User already exists!'}), 400

        # Hash the password using bcrypt
        salt = bcrypt.gensalt()  # Generate salt
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')  # Hash password

        # Create and add the new user to the database
        new_user = User(username=username, email=email, password=hashed_password)
        db.session.add(new_user)
        db.session.commit()

        return jsonify({'message': 'User registered successfully!'}), 201
    except Exception as e:
        print(f"Error during registration: {e}")
        return jsonify({'message': 'Internal server error'}), 500


# Login Route
@app.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        email = data.get('userID')
        password = data.get('password')

        # Find the user by email
        user = User.query.filter_by(email=email).first()

        if user and bcrypt.checkpw(password.encode('utf-8'), user.password.encode('utf-8')):
            # If the password matches, return a success response with access token
            access_token = create_access_token(identity=str(user.id))  # Ensure identity is a string
            return jsonify({'message': 'Login successful!', 'access_token': access_token}), 200
        else:
            return jsonify({'error': 'Invalid credentials'}), 401
    except Exception as e:
        print(f"Error during login: {e}")
        return jsonify({'message': 'Internal server error'}), 500

@app.route('/api/posts', methods=['POST'])
@jwt_required()
def create_post():
    try:
        user_id = get_jwt_identity()
        description = request.form.get('description')
        image = request.files.get('image')  # Get the image from form-data

        image_data = None
        if image:
            image_data = image.read()  # Read the image data

        new_post = Post(user_id=user_id, description=description, image_data=image_data)
        db.session.add(new_post)
        db.session.commit()

        return jsonify(new_post.to_dict(exclude=['image_data'])), 201  # Exclude image_data from the response
    except Exception as e:
        print(f"Error creating post: {e}")
        return jsonify({'message': 'Internal server error'}), 500

@app.route('/api/posts', methods=['GET'])
@jwt_required()
def get_posts():
    user_id = get_jwt_identity()
    posts = Post.query.filter_by(user_id=user_id).all()
    return jsonify([post.to_dict() for post in posts])

@app.route('/api/posts/<int:post_id>/messages', methods=['GET'])
def get_messages(post_id):
    messages = Message.query.filter_by(post_id=post_id).all()
    return jsonify([message.to_dict() for message in messages])

@app.route('/api/posts/<int:post_id>/messages', methods=['POST'])
@jwt_required()
def create_message(post_id):
    data = request.get_json()
    text = data.get('text')
    user_id = get_jwt_identity()

    new_message = Message(post_id=post_id, user_id=user_id, text=text)
    db.session.add(new_message)
    db.session.commit()
    return jsonify(new_message.to_dict()), 201

# WebSocket for real-time messaging in chatroom
@socketio.on('send_message')
def handle_send_message(data):
    post_id = data['post_id']
    user_id = data['user_id']
    message_text = data['message']
    
    new_message = Message(post_id=post_id, user_id=user_id, text=message_text)
    db.session.add(new_message)
    db.session.commit()
    
    # Broadcast the new message to all clients in the chatroom
    send({
        'post_id': post_id,
        'user_id': user_id,
        'message': message_text,
        'username': User.query.get(user_id).username
    }, room=f'chatroom_{post_id}')

@socketio.on('join_chatroom')
def on_join(data):
    post_id = data['post_id']
    join_room(f'chatroom_{post_id}')

@socketio.on('leave_chatroom')
def on_leave(data):
    post_id = data['post_id']
    leave_room(f'chatroom_{post_id}')

@app.route('/api/chatroom/<int:post_id>', methods=['GET'])
def get_chatroom_messages(post_id):
    try:
        messages = Message.query.filter_by(post_id=post_id).all()
        return jsonify([message.to_dict() for message in messages])
    except Exception as e:
        print(f"Error fetching chatroom messages: {e}")
        return jsonify({'error': 'Failed to fetch chatroom messages'}), 500

@app.route('/api/random-posts', methods=['GET'])
def get_random_posts():
    try:
        # Fetch 5 random posts
        posts = Post.query.order_by(db.func.random()).limit(5).all()
        posts_with_user_info = []
        for post in posts:
            post_dict = post.to_dict()  # Include image_data in the response
            user = db.session.get(User, post.user_id)  # Use Session.get()
            post_dict['username'] = user.username
            post_dict['profilePic'] = user.profile_picture  # Use the user's profile picture
            post_dict['comments'] = Message.query.filter_by(post_id=post.id).count()  # Count comments
            posts_with_user_info.append(post_dict)
        return jsonify(posts_with_user_info)
    except Exception as e:
        print(f"Error fetching random posts: {e}")
        return jsonify({'error': 'Failed to fetch random posts'}), 500

@app.route('/api/posts/<int:post_id>/comments', methods=['GET'])
def get_comments(post_id):
    try:
        # Fetch comments related to the given post
        post = Post.query.get_or_404(post_id)
        comments = Message.query.filter_by(post_id=post.id).all()
        
        # Convert comments to a list of dictionaries
        comments_list = [
            {
                'id': comment.id,
                'desc': comment.text,
                'name': comment.user.username,
                'profilePicture': comment.user.profile_picture,  # Use the user's profile picture
                'userId': comment.user.id,
                'created_at': comment.created_at,  # Include created_at field
            }
            for comment in comments
        ]
        
        return jsonify(comments_list)
    except Exception as e:
        print(f"Error fetching comments: {e}")
        return jsonify({'error': 'Failed to fetch comments'}), 500

@app.route('/api/posts/<int:post_id>/comments', methods=['POST'])
@jwt_required()
def create_comment(post_id):
    data = request.get_json()
    text = data.get('text')
    user_id = get_jwt_identity()

    new_comment = Message(post_id=post_id, user_id=user_id, text=text)
    db.session.add(new_comment)
    db.session.commit()

    return jsonify({
        'id': new_comment.id,
        'desc': new_comment.text,
        'name': new_comment.user.username,
        'profilePicture': new_comment.user.profile_picture,  # Use the user's profile picture
        'userId': new_comment.user.id,
        'created_at': new_comment.created_at,  # Include created_at field
    }), 201

@app.route('/api/user', methods=['GET'])
@jwt_required()
def get_user():
    try:
        user_id = get_jwt_identity()
        print(f"User ID from JWT: {user_id}")  # Log the user ID
        user = db.session.get(User, user_id)  # Use Session.get()
        if not user:
            print("User not found")  # Log if user is not found
            return jsonify({'error': 'User not found'}), 404
        user_data = user.to_dict()
        print(f"User data: {user_data}")  # Log the user data
        return jsonify(user_data), 200
    except Exception as e:
        print(f"Error fetching user: {e}")  # Log the error
        return jsonify({'error': str(e)}), 422

@app.route('/api/posts/<int:post_id>/like', methods=['POST'])
@jwt_required()
def like_post(post_id):
    try:
        user_id = get_jwt_identity()
        post = Post.query.get_or_404(post_id)

        # Check if the user has already liked the post
        like = Like.query.filter_by(user_id=user_id, post_id=post_id).first()
        if like:
            # If already liked, remove the like
            db.session.delete(like)
            post.likes -= 1
            liked = False
        else:
            # If not liked, add a new like
            new_like = Like(user_id=user_id, post_id=post_id)
            db.session.add(new_like)
            post.likes += 1
            liked = True

        db.session.commit()
        return jsonify({'liked': liked, 'likes': post.likes}), 200
    except Exception as e:
        print(f"Error liking post: {e}")
        return jsonify({'error': 'Failed to like post'}), 500

@app.route('/api/chatroom/<int:post_id>/users', methods=['GET'])
def get_chatroom_users(post_id):
    try:
        # Fetch users in the chatroom
        users = db.session.query(User).join(Message).filter(Message.post_id == post_id).distinct().all()
        return jsonify([user.to_dict() for user in users])
    except Exception as e:
        print(f"Error fetching users in chatroom: {e}")
        return jsonify({'error': 'Failed to fetch users in chatroom'}), 500

@app.route('/api/profile/<int:user_id>', methods=['GET'])
@jwt_required()
def get_user_profile(user_id):
    try:
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        user_data = user.to_dict()
        user_data['profile_picture'] = user.profile_picture or 'default-avatar.png'  # Ensure correct path
        user_data['posts'] = [post.to_dict() for post in user.posts]  # Include user's posts
        return jsonify(user_data), 200
    except Exception as e:
        print(f"Error fetching user profile: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/search', methods=['GET'])
def search():
    query = request.args.get('query', '')
    if not query:
        return jsonify([])

    results = Post.query.filter(Post.description.ilike(f'%{query}%')).all()
    return jsonify([post.to_dict() for post in results])

@app.route('/api/posts/<int:post_id>', methods=['DELETE'])
@jwt_required()
def delete_post(post_id):
    try:
        user_id = int(get_jwt_identity()) 
        post = Post.query.get_or_404(post_id)

        print(f"User ID from JWT: {user_id} (type: {type(user_id)})")
        print(f"Post user ID: {post.user_id} (type: {type(post.user_id)})")

        if post.user_id != user_id:
            print("Unauthorized attempt to delete post")  # Log unauthorized attempt
            return jsonify({'error': 'Unauthorized'}), 403

        db.session.delete(post)
        db.session.commit()
        return jsonify({'message': 'Post deleted successfully'}), 200
    except Exception as e:
        print(f"Error deleting post: {e}")
        return jsonify({'error': 'Failed to delete post'}), 500

if __name__ == '__main__':
    with app.app_context():
        db.create_all()  # Create all tables in the database
    socketio.run(app, debug=True)
