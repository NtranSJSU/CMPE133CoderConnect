-- MySQL dump 10.13  Distrib 8.0.38, for Win64 (x86_64)
--
-- Host: localhost    Database: coderconnect
-- ------------------------------------------------------
-- Server version	9.0.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `comments`
--

DROP TABLE IF EXISTS `comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comments` (
  `commentID` smallint unsigned NOT NULL,
  `commentDate` datetime DEFAULT CURRENT_TIMESTAMP,
  `commentBody` text,
  `commentFile` blob,
  `postID` smallint unsigned NOT NULL,
  `userID` varchar(60) NOT NULL,
  `commentpoints` int DEFAULT '0',
  PRIMARY KEY (`commentID`,`postID`,`userID`),
  KEY `postID` (`postID`),
  CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`postID`) REFERENCES `posts` (`postID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comments`
--

LOCK TABLES `comments` WRITE;
/*!40000 ALTER TABLE `comments` DISABLE KEYS */;
INSERT INTO `comments` VALUES (1,'2024-11-02 14:21:45','Commenting on first post',NULL,1,'user2',1),(2,'2024-11-02 16:22:23','Post creator can also comment',NULL,1,'user1',-1);
/*!40000 ALTER TABLE `comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `followers`
--

DROP TABLE IF EXISTS `followers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `followers` (
  `followeeID` varchar(60) NOT NULL,
  `followerID` varchar(60) NOT NULL,
  PRIMARY KEY (`followeeID`,`followerID`),
  KEY `followerID` (`followerID`),
  CONSTRAINT `followers_ibfk_1` FOREIGN KEY (`followerID`) REFERENCES `users` (`userID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `followers`
--

LOCK TABLES `followers` WRITE;
/*!40000 ALTER TABLE `followers` DISABLE KEYS */;
INSERT INTO `followers` VALUES ('user2','user1'),('user1','user2');
/*!40000 ALTER TABLE `followers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `followtags`
--

DROP TABLE IF EXISTS `followtags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `followtags` (
  `userID` varchar(60) NOT NULL,
  `tag` varchar(60) NOT NULL,
  PRIMARY KEY (`userID`,`tag`),
  CONSTRAINT `followtags_ibfk_1` FOREIGN KEY (`userID`) REFERENCES `users` (`userID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `followtags`
--

LOCK TABLES `followtags` WRITE;
/*!40000 ALTER TABLE `followtags` DISABLE KEYS */;
INSERT INTO `followtags` VALUES ('user1','CS'),('user1','Java');
/*!40000 ALTER TABLE `followtags` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `posts`
--

DROP TABLE IF EXISTS `posts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `posts` (
  `postID` smallint unsigned NOT NULL AUTO_INCREMENT,
  `postTitle` varchar(200) NOT NULL,
  `postDate` datetime DEFAULT CURRENT_TIMESTAMP,
  `postBody` text,
  `postFile` blob,
  `userID` varchar(60) DEFAULT NULL,
  `postPoints` int DEFAULT '0',
  `tag` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`postID`),
  KEY `userID` (`userID`),
  CONSTRAINT `posts_ibfk_1` FOREIGN KEY (`userID`) REFERENCES `users` (`userID`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `posts`
--

LOCK TABLES `posts` WRITE;
/*!40000 ALTER TABLE `posts` DISABLE KEYS */;
INSERT INTO `posts` VALUES (1,'post1','2024-11-02 13:50:42','just a post',NULL,'user1',3,NULL),(2,'post2','2024-11-05 13:05:42','another post',NULL,'user2',-1,NULL);
/*!40000 ALTER TABLE `posts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `userID` varchar(60) NOT NULL,
  `password` varchar(60) NOT NULL DEFAULT 'password',
  `email` varchar(100) NOT NULL DEFAULT 'email@email.com',
  `isLoggedIn` tinyint NOT NULL DEFAULT '0',
  `profilePic` blob,
  PRIMARY KEY (`userID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('user1','password1','user1@email.com',0,NULL),('user2','password2','user2@email.com',1,NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-11-16 18:43:29
