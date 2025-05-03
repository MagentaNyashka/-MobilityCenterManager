/*M!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19-11.7.2-MariaDB, for Linux (x86_64)
--
-- Host: localhost    Database: mobile_center_db
-- ------------------------------------------------------
-- Server version	11.7.2-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*M!100616 SET @OLD_NOTE_VERBOSITY=@@NOTE_VERBOSITY, NOTE_VERBOSITY=0 */;

--
-- Table structure for table `connections`
--

DROP TABLE IF EXISTS `connections`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `connections` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `station_from_id` int(11) DEFAULT NULL,
  `station_to_id` int(11) DEFAULT NULL,
  `travel_time` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  UNIQUE KEY `station_from_id` (`station_from_id`,`station_to_id`)
) ENGINE=InnoDB AUTO_INCREMENT=47 DEFAULT CHARSET=utf8mb3 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `connections`
--

LOCK TABLES `connections` WRITE;
/*!40000 ALTER TABLE `connections` DISABLE KEYS */;
INSERT INTO `connections` VALUES
(1,14,13,2),
(2,13,14,2),
(3,13,12,2),
(4,12,13,2),
(5,12,11,2),
(6,11,12,2),
(7,11,10,2),
(8,10,11,2),
(9,10,9,2),
(10,9,10,2),
(11,9,8,2),
(12,8,9,2),
(13,8,7,2),
(14,7,8,2),
(15,7,6,2),
(16,6,7,2),
(17,6,5,2),
(18,5,6,2),
(19,5,4,2),
(20,4,5,2),
(21,4,3,2),
(22,3,4,2),
(23,3,2,2),
(24,2,3,2),
(25,2,1,2),
(26,1,2,2),
(27,1,15,2),
(28,15,1,2),
(29,15,16,2),
(30,16,15,2),
(31,16,17,2),
(32,17,16,2),
(35,17,18,2),
(36,18,17,2),
(37,18,19,2),
(38,19,18,2),
(39,19,20,2),
(40,20,19,2),
(41,20,21,2),
(42,21,20,2),
(43,21,22,2),
(44,22,21,2),
(45,22,23,2),
(46,23,22,2);
/*!40000 ALTER TABLE `connections` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `employees`
--

DROP TABLE IF EXISTS `employees`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `employees` (
  `id_employee` int(11) NOT NULL,
  `current_station` int(11) NOT NULL,
  `status` varchar(45) NOT NULL,
  `end_time` datetime NOT NULL,
  PRIMARY KEY (`id_employee`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employees`
--

LOCK TABLES `employees` WRITE;
/*!40000 ALTER TABLE `employees` DISABLE KEYS */;
INSERT INTO `employees` VALUES
(1,1,'free','0000-00-00 00:00:00'),
(2,1,'busy','0000-00-00 00:00:00'),
(3,1,'busy','0000-00-00 00:00:00'),
(4,1,'free','0000-00-00 00:00:00'),
(5,1,'free','0000-00-00 00:00:00'),
(6,1,'free','0000-00-00 00:00:00');
/*!40000 ALTER TABLE `employees` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lines`
--

DROP TABLE IF EXISTS `lines`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `lines` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `color` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb3 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lines`
--

LOCK TABLES `lines` WRITE;
/*!40000 ALTER TABLE `lines` DISABLE KEYS */;
INSERT INTO `lines` VALUES
(1,'Синяя линия','blue');
/*!40000 ALTER TABLE `lines` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id_order` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `station` int(11) NOT NULL,
  `order_time` datetime NOT NULL,
  `order_status` varchar(45) NOT NULL,
  `destination` int(11) NOT NULL,
  `employees_required` int(11) NOT NULL,
  PRIMARY KEY (`id_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES
(1,1,1,'2025-04-29 00:00:00','completed',2,0),
(2,1,1,'2025-04-28 00:00:00','completed',2,0),
(3,1,1,'2025-04-29 20:24:00','completed',2,0),
(4,1,1,'2025-04-29 20:24:01','completed',2,0),
(5,1,1,'2025-04-30 12:15:00','completed',2,3);
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pairs`
--

DROP TABLE IF EXISTS `pairs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `pairs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `order_id` int(11) DEFAULT NULL,
  `employee_id` int(11) DEFAULT NULL,
  `order_time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb3 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pairs`
--

LOCK TABLES `pairs` WRITE;
/*!40000 ALTER TABLE `pairs` DISABLE KEYS */;
/*!40000 ALTER TABLE `pairs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stations`
--

DROP TABLE IF EXISTS `stations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `stations` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `line_id` int(11) DEFAULT NULL,
  `latitude` decimal(9,6) DEFAULT NULL,
  `longitude` decimal(9,6) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb3 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stations`
--

LOCK TABLES `stations` WRITE;
/*!40000 ALTER TABLE `stations` DISABLE KEYS */;
INSERT INTO `stations` VALUES
(1,'Площадь Революции',1,NULL,NULL),
(2,'Арбатская',1,NULL,NULL),
(3,'Смоленская',1,NULL,NULL),
(4,'Киевская',1,NULL,NULL),
(5,'Парк Победы',1,NULL,NULL),
(6,'Славянский бульва',1,NULL,NULL),
(7,'Кунцевская',1,NULL,NULL),
(8,'Молодёжная',1,NULL,NULL),
(9,'Крылатское',1,NULL,NULL),
(10,'Строгино',1,NULL,NULL),
(11,'Мякинино',1,NULL,NULL),
(12,'Волокамская',1,NULL,NULL),
(13,'Митино',1,NULL,NULL),
(14,'Пятницкое шоссе',1,NULL,NULL),
(15,'Чкаловская',1,NULL,NULL),
(16,'Курская',1,NULL,NULL),
(17,'Бауманская',1,NULL,NULL),
(18,'Электрозаводская',1,NULL,NULL),
(19,'Семёновская',1,NULL,NULL),
(20,'Партизанская',1,NULL,NULL),
(21,'Измайловская',1,NULL,NULL),
(22,'Первомайская',1,NULL,NULL),
(23,'Щёлковская',1,NULL,NULL);
/*!40000 ALTER TABLE `stations` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*M!100616 SET NOTE_VERBOSITY=@OLD_NOTE_VERBOSITY */;

-- Dump completed on 2025-04-30 19:55:23
