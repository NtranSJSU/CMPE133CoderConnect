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
-- Table structure for table `chatroom`
--

DROP TABLE IF EXISTS `chatroom`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chatroom` (
  `replyID` smallint unsigned NOT NULL AUTO_INCREMENT,
  `chatroomID` smallint NOT NULL,
  `postID` smallint unsigned NOT NULL,
  `userID` varchar(60) NOT NULL,
  `replyBody` text,
  `replyDate` datetime DEFAULT CURRENT_TIMESTAMP,
  `replyFile` blob,
  PRIMARY KEY (`replyID`,`chatroomID`,`postID`,`userID`),
  KEY `userID` (`userID`),
  KEY `chatroom_ibfk_1` (`postID`),
  CONSTRAINT `chatroom_ibfk_1` FOREIGN KEY (`postID`) REFERENCES `posts` (`postID`),
  CONSTRAINT `chatroom_ibfk_2` FOREIGN KEY (`userID`) REFERENCES `users` (`userID`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chatroom`
--

LOCK TABLES `chatroom` WRITE;
/*!40000 ALTER TABLE `chatroom` DISABLE KEYS */;
INSERT INTO `chatroom` VALUES (1,1,1,'user1','This is a chatroom','2024-11-30 14:35:58',NULL),(2,1,1,'user2','This a chat for a post','2024-11-30 17:54:35',NULL);
/*!40000 ALTER TABLE `chatroom` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-11-30 17:55:29
