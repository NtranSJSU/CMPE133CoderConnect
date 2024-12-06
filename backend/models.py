from app import db
from datetime import datetime

# User model
class User(db.Model):
    __tablename__ = 'users'
    userID = db.Column(db.String(60), primary_key=True)
    password = db.Column(db.String(60), default='password')
    email = db.Column(db.String(100), default='email@email.com')
    isLoggedIn = db.Column(db.Boolean, default=False)
    profilePic = db.Column(db.LargeBinary)
    
    def to_dict(self):
        return {
            'userID': self.userID,
            'email': self.email,
            'isLoggedIn': self.isLoggedIn
        }

# Post model
class Post(db.Model):
    __tablename__ = 'posts'
    postID = db.Column(db.SmallInteger, primary_key=True, autoincrement=True)
    postTitle = db.Column(db.String(200), nullable=False)
    postDate = db.Column(db.DateTime, default=datetime.utcnow)
    postBody = db.Column(db.Text)
    postFile = db.Column(db.LargeBinary)
    userID = db.Column(db.String(60), db.ForeignKey('users.userID'))
    postPoints = db.Column(db.Integer, default=0)
    tag = db.Column(db.String(45))

    user = db.relationship('User', backref=db.backref('posts', lazy=True))

    def to_dict(self):
        return {
            'postID': self.postID,
            'postTitle': self.postTitle,
            'postDate': self.postDate,
            'postBody': self.postBody,
            'postPoints': self.postPoints,
            'tag': self.tag
        }

# Comment model
class Comment(db.Model):
    __tablename__ = 'comments'
    commentID = db.Column(db.SmallInteger, primary_key=True)
    commentDate = db.Column(db.DateTime, default=datetime.utcnow)
    commentBody = db.Column(db.Text)
    commentFile = db.Column(db.LargeBinary)
    postID = db.Column(db.SmallInteger, db.ForeignKey('posts.postID'))
    userID = db.Column(db.String(60), db.ForeignKey('users.userID'))
    commentpoints = db.Column(db.Integer, default=0)

    post = db.relationship('Post', backref=db.backref('comments', lazy=True))
    user = db.relationship('User', backref=db.backref('comments', lazy=True))

    def to_dict(self):
        return {
            'commentID': self.commentID,
            'commentDate': self.commentDate,
            'commentBody': self.commentBody,
            'commentpoints': self.commentpoints
        }

# Follow model
class Follow(db.Model):
    __tablename__ = 'followers'
    followeeID = db.Column(db.String(60), primary_key=True)
    followerID = db.Column(db.String(60), primary_key=True)

    follower = db.relationship('User', foreign_keys=[followerID])
    followee = db.relationship('User', foreign_keys=[followeeID])

    def to_dict(self):
        return {
            'followeeID': self.followeeID,
            'followerID': self.followerID
        }

# FollowTag model
class FollowTag(db.Model):
    __tablename__ = 'followtags'
    userID = db.Column(db.String(60), primary_key=True)
    tag = db.Column(db.String(60), primary_key=True)

    def to_dict(self):
        return {
            'userID': self.userID,
            'tag': self.tag
        }

# PostChatroom model
class PostChatroom(db.Model):
    __tablename__ = 'postchatroom'
    chatroomID = db.Column(db.SmallInteger, primary_key=True)
    postID = db.Column(db.SmallInteger, primary_key=True, autoincrement=True)
    userCount = db.Column(db.Integer)
    isOpen = db.Column(db.Boolean)

    def to_dict(self):
        return {
            'chatroomID': self.chatroomID,
            'postID': self.postID,
            'userCount': self.userCount,
            'isOpen': self.isOpen
        }

# Chatroom model
class Chatroom(db.Model):
    __tablename__ = 'chatroom'
    replyID = db.Column(db.SmallInteger, primary_key=True, autoincrement=True)
    chatroomID = db.Column(db.SmallInteger, primary_key=True)
    postID = db.Column(db.SmallInteger, primary_key=True)
    userID = db.Column(db.String(60), primary_key=True)
    replyBody = db.Column(db.Text)
    replyDate = db.Column(db.DateTime, default=datetime.utcnow)
    replyFile = db.Column(db.LargeBinary)

    def to_dict(self):
        return {
            'replyID': self.replyID,
            'chatroomID': self.chatroomID,
            'postID': self.postID,
            'userID': self.userID,
            'replyBody': self.replyBody,
            'replyDate': self.replyDate
        }
