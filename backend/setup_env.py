
import os

env_content = """FLASK_APP=app.py
FLASK_ENV=development
DATABASE_URL=mysql+pymysql://root:root@localhost/coderconnect
JWT_SECRET_KEY=supersecretkey
"""

with open('.env', 'w') as env_file:
    env_file.write(env_content)

print(".env file created successfully.")