import mysql.connector
from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity
from flask_socketio import SocketIO, send, join_room, leave_room
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
from datetime import timedelta
import os
from flask_cors import CORS


# Initialize app, db, jwt, and socket
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:root@localhost/coderconnect'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = 'supersecretkey'  # Secret key for JWT
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1)  # Token expires in 1 hour
app.config['UPLOAD_FOLDER'] = 'uploads/'  # Folder to save uploaded images
db = SQLAlchemy(app)
jwt = JWTManager(app)
socketio = SocketIO(app, cors_allowed_origins="*")  # Enable CORS for SocketIO
CORS(app)

# Function to create the database if it doesn't exist
def create_database_if_not_exists():
    conn = mysql.connector.connect(
        user='root', password='root', host='localhost')
    cursor = conn.cursor()
    
    # Check if the database exists
    cursor.execute("SHOW DATABASES LIKE 'coderconnect'")
    result = cursor.fetchone()
    
    # If the database doesn't exist, create it
    if not result:
        cursor.execute("CREATE DATABASE coderconnect")
        print("Database 'coderconnect' created.")
    
    cursor.close()
    conn.close()

# Call the function to create the database
create_database_if_not_exists()

# Models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)

    def __repr__(self):
        return f"<User {self.username}>"

    def to_dict(self):
        return {'id': self.id, 'username': self.username, 'email': self.email}

class Post(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    description = db.Column(db.String(255), nullable=False)
    image_url = db.Column(db.String(255))
    created_at = db.Column(db.DateTime, default=db.func.now())

    user = db.relationship('User', backref='posts', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'description': self.description,
            'image_url': self.image_url,
            'created_at': self.created_at,
        }

class Message(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    post_id = db.Column(db.Integer, db.ForeignKey('post.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    text = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=db.func.now())

    post = db.relationship('Post', backref='messages', lazy=True)
    user = db.relationship('User', backref='messages', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'post_id': self.post_id,
            'user_id': self.user_id,
            'text': self.text,
            'created_at': self.created_at,
            'username': self.user.username,
        }

# Routes
@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    print(f"Received data: {data}")  # Log incoming data to see what is coming
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    existing_user = User.query.filter((User.username == username) | (User.email == email)).first()
    if existing_user:
        return jsonify({'message': 'User already exists!'}), 400

    hashed_password = generate_password_hash(password)
    new_user = User(username=username, email=email, password=hashed_password)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message': 'User registered successfully!'}), 201


@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    user = User.query.filter_by(username=username).first()
    if user and check_password_hash(user.password, password):
        access_token = create_access_token(identity=user.id)
        return jsonify(access_token=access_token), 200
    return jsonify({"message": "Invalid credentials"}), 401

@app.route('/api/posts', methods=['POST'])
@jwt_required()
def create_post():
    user_id = get_jwt_identity()
    title = request.form.get('title')
    content = request.form.get('content')
    image = request.files.get('image')  # Get the image from form-data

    image_url = None
    if image:
        filename = secure_filename(image.filename)
        image_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        image.save(image_path)
        image_url = image_path  # Store the image URL/path for the post

    # Create a new post
    new_post = Post(user_id=user_id, description=content, image_url=image_url)
    db.session.add(new_post)
    db.session.commit()

    return jsonify(new_post.to_dict()), 201

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
    }, room=str(post_id))

@app.route('/api/chatroom/<int:post_id>', methods=['GET'])
def get_chatroom_messages(post_id):
    messages = Message.query.filter_by(post_id=post_id).all()
    return jsonify([message.to_dict() for message in messages])

@socketio.on('join_chatroom')
def on_join(data):
    post_id = data['post_id']
    join_room(str(post_id))

@socketio.on('leave_chatroom')
def on_leave(data):
    post_id = data['post_id']
    leave_room(str(post_id))

@app.route('/api/random-posts', methods=['GET'])
def get_random_posts():
    # Fetch 5 random posts
    posts = Post.query.order_by(db.func.random()).limit(5).all()
    return jsonify([post.to_dict() for post in posts])

@app.route('/api/posts/<int:post_id>/comments', methods=['GET'])
def get_comments(post_id):
    # Fetch comments related to the given post
    post = Post.query.get_or_404(post_id)
    comments = Message.query.filter_by(post_id=post.id).all()
    
    # Convert comments to a list of dictionaries
    comments_list = [
        {
            'id': comment.id,
            'desc': comment.text,
            'name': comment.user.username,
            'profilePicture': comment.user.profile_picture,  # Assuming you have a profile_picture field
            'userId': comment.user.id,
        }
        for comment in comments
    ]
    
    return jsonify(comments_list)

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
        'profilePicture': new_comment.user.profile_picture,  # Assuming profile picture field
        'userId': new_comment.user.id
    }), 201

if __name__ == '__main__':
    with app.app_context():
        db.create_all()  # Create all tables in the database
    socketio.run(app, debug=True)
