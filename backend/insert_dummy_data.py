from app import create_database_if_not_exists, app
from database import db  # Import db from database.py
from models import Post, Message, Like, User  # Ensure this import is correct and unique
import bcrypt

# Ensure the database exists
create_database_if_not_exists()

# Use the application context
with app.app_context():
    # Create all tables
    db.create_all()

    # Insert dummy users
    default_avatar_url = 'frontend/src/assets/default-avatar.png'
    user1 = User(username='user1', email='user1@example.com', password=bcrypt.hashpw('password1'.encode('utf-8'), bcrypt.gensalt()).decode('utf-8'), profile_picture=default_avatar_url)
    user2 = User(username='user2', email='user2@example.com', password=bcrypt.hashpw('password2'.encode('utf-8'), bcrypt.gensalt()).decode('utf-8'), profile_picture=default_avatar_url)
    user3 = User(username='user3', email='user3@example.com', password=bcrypt.hashpw('password3'.encode('utf-8'), bcrypt.gensalt()).decode('utf-8'), profile_picture=default_avatar_url)
    user4 = User(username='user4', email='user4@example.com', password=bcrypt.hashpw('password4'.encode('utf-8'), bcrypt.gensalt()).decode('utf-8'), profile_picture=default_avatar_url)
    user5 = User(username='user5', email='user5@example.com', password=bcrypt.hashpw('password5'.encode('utf-8'), bcrypt.gensalt()).decode('utf-8'), profile_picture=default_avatar_url)
    user6 = User(username='user6', email='user6@example.com', password=bcrypt.hashpw('password6'.encode('utf-8'), bcrypt.gensalt()).decode('utf-8'), profile_picture=default_avatar_url)
    user7 = User(username='user7', email='user7@example.com', password=bcrypt.hashpw('password7'.encode('utf-8'), bcrypt.gensalt()).decode('utf-8'), profile_picture=default_avatar_url)
    user8 = User(username='user8', email='user8@example.com', password=bcrypt.hashpw('password8'.encode('utf-8'), bcrypt.gensalt()).decode('utf-8'), profile_picture=default_avatar_url)

    db.session.add_all([user1, user2, user3, user4, user5, user6, user7, user8])
    db.session.commit()

    # Insert dummy posts
    post1 = Post(user_id=user1.id, description='This is post number 1', image_url=None)
    post2 = Post(user_id=user2.id, description='This is post number 2', image_url=None)
    post3 = Post(user_id=user3.id, description='This is post number 3', image_url=None)
    post4 = Post(user_id=user4.id, description='This is post number 4', image_url=None)
    post5 = Post(user_id=user5.id, description='This is post number 5', image_url=None)
    post6 = Post(user_id=user6.id, description='This is post number 6', image_url=None)
    post7 = Post(user_id=user7.id, description='This is post number 7', image_url=None)
    post8 = Post(user_id=user8.id, description='This is post number 8', image_url=None)

    db.session.add_all([post1, post2, post3, post4, post5, post6, post7, post8])
    db.session.commit()

    # Insert dummy messages
    message1 = Message(post_id=post1.id, user_id=user1.id, text='This is a comment on post number 1')
    message2 = Message(post_id=post2.id, user_id=user2.id, text='This is a comment on post number 2')
    message3 = Message(post_id=post3.id, user_id=user3.id, text='This is a comment on post number 3')
    message4 = Message(post_id=post4.id, user_id=user4.id, text='This is a comment on post number 4')
    message5 = Message(post_id=post5.id, user_id=user5.id, text='This is a comment on post number 5')
    message6 = Message(post_id=post6.id, user_id=user6.id, text='This is a comment on post number 6')
    message7 = Message(post_id=post7.id, user_id=user7.id, text='This is a comment on post number 7')
    message8 = Message(post_id=post8.id, user_id=user8.id, text='This is a comment on post number 8')

    db.session.add_all([message1, message2, message3, message4, message5, message6, message7, message8])
    db.session.commit()

    # Insert dummy likes
    like1 = Like(user_id=user1.id, post_id=post1.id)
    like2 = Like(user_id=user2.id, post_id=post2.id)
    like3 = Like(user_id=user3.id, post_id=post3.id)
    like4 = Like(user_id=user4.id, post_id=post4.id)
    like5 = Like(user_id=user5.id, post_id=post5.id)
    like6 = Like(user_id=user6.id, post_id=post6.id)
    like7 = Like(user_id=user7.id, post_id=post7.id)
    like8 = Like(user_id=user8.id, post_id=post8.id)

    db.session.add_all([like1, like2, like3, like4, like5, like6, like7, like8])
    db.session.commit()

    # Insert dummy chatroom messages
    chatroom_message1 = Message(post_id=post1.id, user_id=user1.id, text='Hello from user1 in the chatroom! Message 1')
    chatroom_message2 = Message(post_id=post2.id, user_id=user2.id, text='Hello from user2 in the chatroom! Message 1')
    chatroom_message3 = Message(post_id=post3.id, user_id=user3.id, text='Hello from user3 in the chatroom! Message 1')
    chatroom_message4 = Message(post_id=post4.id, user_id=user4.id, text='Hello from user4 in the chatroom! Message 1')
    chatroom_message5 = Message(post_id=post5.id, user_id=user5.id, text='Hello from user5 in the chatroom! Message 1')
    chatroom_message6 = Message(post_id=post6.id, user_id=user6.id, text='Hello from user6 in the chatroom! Message 1')
    chatroom_message7 = Message(post_id=post7.id, user_id=user7.id, text='Hello from user7 in the chatroom! Message 1')
    chatroom_message8 = Message(post_id=post8.id, user_id=user8.id, text='Hello from user8 in the chatroom! Message 1')

    db.session.add_all([chatroom_message1, chatroom_message2, chatroom_message3, chatroom_message4, chatroom_message5, chatroom_message6, chatroom_message7, chatroom_message8])
    db.session.commit()

print("Dummy data inserted successfully!")