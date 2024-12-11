
import mysql.connector

def create_database_and_user():
    conn = mysql.connector.connect(
        user='root', password='root', host='localhost')
    cursor = conn.cursor()

    cursor.execute("CREATE DATABASE IF NOT EXISTS coderconnect")
    cursor.execute("CREATE USER IF NOT EXISTS 'root'@'localhost' IDENTIFIED BY 'root'")
    cursor.execute("GRANT ALL PRIVILEGES ON coderconnect.* TO 'root'@'localhost'")
    cursor.execute("FLUSH PRIVILEGES")

    cursor.close()
    conn.close()

if __name__ == '__main__':
    create_database_and_user()