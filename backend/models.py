import base64
from database import db
from datetime import datetime

# User model
class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    profile_picture = db.Column(db.String(255), default='frontend/src/assets/default-avatar.png')  # Use forward slashes

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'profile_picture': self.profile_picture
        }

# Post model
class Post(db.Model):
    __tablename__ = 'posts'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    description = db.Column(db.String(255), nullable=False)
    image_url = db.Column(db.String(255))
    image_data = db.Column(db.LargeBinary(length=(2**24)-1))  # Increase the size of image_data
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    likes = db.Column(db.Integer, default=0)

    user = db.relationship('User', backref='posts', lazy=True)

    def to_dict(self, exclude=[]):
        post_dict = {
            'id': self.id,
            'user_id': self.user_id,
            'description': self.description,
            'image_url': self.image_url,
            'created_at': self.created_at,
            'likes': self.likes
        }
        if 'image_data' not in exclude and self.image_data:
            post_dict['image_data'] = base64.b64encode(self.image_data).decode('utf-8')
        return post_dict

# Message model
class Message(db.Model):
    __tablename__ = 'messages'
    id = db.Column(db.Integer, primary_key=True)
    post_id = db.Column(db.Integer, db.ForeignKey('posts.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    text = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    post = db.relationship('Post', backref='messages', lazy=True)
    user = db.relationship('User', backref='messages', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'post_id': self.post_id,
            'user_id': self.user_id,
            'text': self.text,
            'created_at': self.created_at,
            'username': self.user.username
        }

# Like model
class Like(db.Model):
    __tablename__ = 'likes'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    post_id = db.Column(db.Integer, db.ForeignKey('posts.id'), nullable=False)

    user = db.relationship('User', backref='user_likes', lazy=True)  # Rename backref to avoid conflict
    post = db.relationship('Post', backref='post_likes', lazy=True)  # Rename backref to avoid conflict

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'post_id': self.post_id
        }
