-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: localhost    Database: talynx
-- ------------------------------------------------------
-- Server version	5.5.5-10.4.32-MariaDB

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
-- Table structure for table `candidat`
--

DROP TABLE IF EXISTS `candidat`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `candidat` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nom` varchar(100) DEFAULT NULL,
  `prenom` varchar(100) DEFAULT NULL,
  `telephone` varchar(20) DEFAULT NULL,
  `ville` varchar(100) DEFAULT NULL,
  `dateNaissance` date DEFAULT NULL,
  `ecole` varchar(150) DEFAULT NULL,
  `diplome` varchar(150) DEFAULT NULL,
  `specialite` varchar(150) DEFAULT NULL,
  `niveauEtude` varchar(50) DEFAULT NULL,
  `bio` text DEFAULT NULL,
  `profilValide` tinyint(1) DEFAULT 0,
  `utilisateur_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_candidat_utilisateur` (`utilisateur_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `candidat`
--

LOCK TABLES `candidat` WRITE;
/*!40000 ALTER TABLE `candidat` DISABLE KEYS */;
INSERT INTO `candidat` VALUES (1,'Amir','Youssef','0600000001',NULL,'2000-05-10',NULL,NULL,NULL,NULL,NULL,0,1),(2,'Haddad','Sara','0600000002',NULL,'1999-03-22',NULL,NULL,NULL,NULL,NULL,0,2),(3,'Benali','Nabil','0600000003',NULL,'2001-01-11',NULL,NULL,NULL,NULL,NULL,0,3),(4,'Azzam','Lina','0600000004',NULL,'1998-11-30',NULL,NULL,NULL,NULL,NULL,0,4),(5,'Amir','Radia','0600000000','Marrakech','2004-06-15','ENSA Marrakech','Ingénierie','Génie Informatique','Bac+5','Étudiante en ingénierie informatique.',0,11);
/*!40000 ALTER TABLE `candidat` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `candidat_competence`
--

DROP TABLE IF EXISTS `candidat_competence`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `candidat_competence` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `candidat_id` int(11) DEFAULT NULL,
  `competence_id` int(11) DEFAULT NULL,
  `niveau` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_candidat_competence` (`candidat_id`,`competence_id`),
  KEY `competence_id` (`competence_id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `candidat_competence`
--

LOCK TABLES `candidat_competence` WRITE;
/*!40000 ALTER TABLE `candidat_competence` DISABLE KEYS */;
INSERT INTO `candidat_competence` VALUES (1,1,1,5),(2,1,2,4),(3,1,3,3),(4,1,4,4),(5,2,5,5),(6,2,6,4),(7,2,2,3),(8,2,11,4),(9,3,8,5),(10,3,9,4),(11,3,11,4),(12,3,12,3),(13,4,1,3),(14,4,6,4),(15,4,10,4),(16,4,11,5),(17,5,1,4),(18,5,2,3),(19,5,3,5);
/*!40000 ALTER TABLE `candidat_competence` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `challenge`
--

DROP TABLE IF EXISTS `challenge`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `challenge` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `titre` varchar(200) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `niveau` varchar(50) DEFAULT NULL,
  `dateDebut` date DEFAULT NULL,
  `dateFin` date DEFAULT NULL,
  `entreprise_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_challenge_entreprise` (`entreprise_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `challenge`
--

LOCK TABLES `challenge` WRITE;
/*!40000 ALTER TABLE `challenge` DISABLE KEYS */;
INSERT INTO `challenge` VALUES (1,'AI Prediction System','Build a predictive ML model using real datasets','advanced','2026-04-01','2026-04-15',1),(2,'Data Cleaning Challenge','Prepare and analyze a messy dataset','intermediate','2026-04-05','2026-04-18',2),(3,'Cyber Attack Simulation','Detect and mitigate simulated cyber attacks','advanced','2026-04-07','2026-04-20',3),(4,'Fullstack Web Platform','Create a web platform using React and Node','intermediate','2026-04-10','2026-04-25',4),(5,'Challenge React avancé','Créer une interface React responsive avec composants réutilisables','avance','2026-03-20','2026-03-30',5);
/*!40000 ALTER TABLE `challenge` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `challenge_competence`
--

DROP TABLE IF EXISTS `challenge_competence`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `challenge_competence` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `challenge_id` int(11) DEFAULT NULL,
  `competence_id` int(11) DEFAULT NULL,
  `poids` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_challenge_competence` (`challenge_id`,`competence_id`),
  KEY `competence_id` (`competence_id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `challenge_competence`
--

LOCK TABLES `challenge_competence` WRITE;
/*!40000 ALTER TABLE `challenge_competence` DISABLE KEYS */;
INSERT INTO `challenge_competence` VALUES (1,1,1,5),(2,1,3,5),(3,1,4,3),(4,2,2,4),(5,2,4,5),(6,2,1,3),(7,3,8,5),(8,3,9,5),(9,3,11,3),(10,4,5,5),(11,4,6,5),(12,4,11,3),(13,5,1,3),(14,5,2,4),(15,5,3,2);
/*!40000 ALTER TABLE `challenge_competence` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `challenge_eligibilite`
--

DROP TABLE IF EXISTS `challenge_eligibilite`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `challenge_eligibilite` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `challenge_id` int(11) NOT NULL,
  `type_critere` varchar(50) NOT NULL,
  `valeur` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_challenge_eligibilite_challenge` (`challenge_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `challenge_eligibilite`
--

LOCK TABLES `challenge_eligibilite` WRITE;
/*!40000 ALTER TABLE `challenge_eligibilite` DISABLE KEYS */;
INSERT INTO `challenge_eligibilite` VALUES (1,5,'ville','marrakech'),(2,5,'specialite','génie informatique');
/*!40000 ALTER TABLE `challenge_eligibilite` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `competence`
--

DROP TABLE IF EXISTS `competence`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `competence` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nom` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `competence`
--

LOCK TABLES `competence` WRITE;
/*!40000 ALTER TABLE `competence` DISABLE KEYS */;
INSERT INTO `competence` VALUES (1,'Python'),(2,'SQL'),(3,'Machine Learning'),(4,'Data Analysis'),(5,'React'),(6,'Node.js'),(7,'Java'),(8,'Cybersecurity'),(9,'Network Security'),(10,'Docker'),(11,'Git'),(12,'C++'),(13,'JavaScript'),(14,'React'),(15,'Node.js'),(16,'MySQL'),(17,'Python'),(18,'API REST'),(19,'HTML'),(20,'CSS');
/*!40000 ALTER TABLE `competence` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `entreprise`
--

DROP TABLE IF EXISTS `entreprise`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `entreprise` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nomEntreprise` varchar(150) DEFAULT NULL,
  `secteur` varchar(100) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `ville` varchar(100) DEFAULT NULL,
  `telephone` varchar(30) DEFAULT NULL,
  `siteWeb` varchar(150) DEFAULT NULL,
  `utilisateur_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_entreprise_utilisateur` (`utilisateur_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `entreprise`
--

LOCK TABLES `entreprise` WRITE;
/*!40000 ALTER TABLE `entreprise` DISABLE KEYS */;
INSERT INTO `entreprise` VALUES (1,'TechCorp','Artificial Intelligence',NULL,NULL,NULL,'www.techcorp.com',5),(2,'DataVision','Data Science',NULL,NULL,NULL,'www.datavision.com',6),(3,'CyberSecure','Cybersecurity',NULL,NULL,NULL,'www.cybersecure.com',7),(4,'WebSolutions','Software Development',NULL,NULL,NULL,'www.websolutions.com',8),(5,'Talynx','Technologie','Plateforme de matching entre candidats et entreprises.','Casablanca','0522000000','https://talynx.com',10),(6,'Talynx',NULL,NULL,NULL,NULL,NULL,12);
/*!40000 ALTER TABLE `entreprise` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `evaluation_challenge`
--

DROP TABLE IF EXISTS `evaluation_challenge`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `evaluation_challenge` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `soumission_id` int(11) NOT NULL,
  `entreprise_id` int(11) NOT NULL,
  `note_finale` decimal(5,2) NOT NULL,
  `commentaire` text DEFAULT NULL,
  `est_qualifie` tinyint(1) DEFAULT 0,
  `date_evaluation` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_evaluation_soumission` (`soumission_id`),
  KEY `fk_evaluation_entreprise` (`entreprise_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `evaluation_challenge`
--

LOCK TABLES `evaluation_challenge` WRITE;
/*!40000 ALTER TABLE `evaluation_challenge` DISABLE KEYS */;
/*!40000 ALTER TABLE `evaluation_challenge` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `matching_resultat`
--

DROP TABLE IF EXISTS `matching_resultat`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `matching_resultat` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `candidat_id` int(11) NOT NULL,
  `challenge_id` int(11) NOT NULL,
  `score` decimal(5,2) NOT NULL DEFAULT 0.00,
  `eligible` tinyint(1) NOT NULL DEFAULT 0,
  `date_matching` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_matching_resultat` (`candidat_id`,`challenge_id`),
  KEY `fk_matching_challenge` (`challenge_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `matching_resultat`
--

LOCK TABLES `matching_resultat` WRITE;
/*!40000 ALTER TABLE `matching_resultat` DISABLE KEYS */;
INSERT INTO `matching_resultat` VALUES (1,5,5,76.00,1,'2026-03-12 00:48:00'),(2,5,4,0.00,1,'2026-03-12 00:48:00'),(3,5,3,0.00,1,'2026-03-12 00:48:00'),(4,5,2,40.00,1,'2026-03-12 00:48:00'),(5,5,1,69.00,1,'2026-03-12 00:48:00');
/*!40000 ALTER TABLE `matching_resultat` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notification`
--

DROP TABLE IF EXISTS `notification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notification` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `utilisateur_id` int(11) NOT NULL,
  `type` varchar(50) NOT NULL,
  `message` text NOT NULL,
  `est_lue` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `utilisateur_id` (`utilisateur_id`),
  CONSTRAINT `notification_ibfk_1` FOREIGN KEY (`utilisateur_id`) REFERENCES `utilisateur` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notification`
--

LOCK TABLES `notification` WRITE;
/*!40000 ALTER TABLE `notification` DISABLE KEYS */;
/*!40000 ALTER TABLE `notification` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `soumission_challenge`
--

DROP TABLE IF EXISTS `soumission_challenge`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `soumission_challenge` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `candidat_id` int(11) NOT NULL,
  `challenge_id` int(11) NOT NULL,
  `contenu_reponse` text DEFAULT NULL,
  `fichier_reponse` varchar(255) DEFAULT NULL,
  `lien_github` varchar(255) DEFAULT NULL,
  `date_soumission` timestamp NOT NULL DEFAULT current_timestamp(),
  `statut` enum('soumis','corrige') DEFAULT 'soumis',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_soumission` (`candidat_id`,`challenge_id`),
  KEY `fk_soumission_challenge` (`challenge_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `soumission_challenge`
--

LOCK TABLES `soumission_challenge` WRITE;
/*!40000 ALTER TABLE `soumission_challenge` DISABLE KEYS */;
/*!40000 ALTER TABLE `soumission_challenge` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `utilisateur`
--

DROP TABLE IF EXISTS `utilisateur`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `utilisateur` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nom` varchar(100) NOT NULL,
  `prenom` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `type` enum('candidat','entreprise') NOT NULL,
  `dateInscription` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `uq_utilisateur_email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `utilisateur`
--

LOCK TABLES `utilisateur` WRITE;
/*!40000 ALTER TABLE `utilisateur` DISABLE KEYS */;
INSERT INTO `utilisateur` VALUES (1,'','','youssef.amir@mail.com','1234','candidat','2026-03-06 00:48:02'),(2,'','','sara.haddad@mail.com','1234','candidat','2026-03-06 00:48:02'),(3,'','','nabil.benali@mail.com','1234','candidat','2026-03-06 00:48:02'),(4,'','','lina.azzam@mail.com','1234','candidat','2026-03-06 00:48:02'),(5,'','','hr@techcorp.com','1234','entreprise','2026-03-06 00:48:02'),(6,'','','careers@datavision.com','1234','entreprise','2026-03-06 00:48:02'),(7,'','','jobs@cybersecure.com','1234','entreprise','2026-03-06 00:48:02'),(8,'','','talent@websolutions.com','1234','entreprise','2026-03-06 00:48:02'),(9,'','','test@mail.com','$2b$10$hLnt5k8bIlLR2o4neNhBtuiy4Kms82L3w4httrYO19BfNCLPPU2sO','candidat','2026-03-06 01:24:03'),(10,'','','entreprise@test.com','$2b$10$qB2eC3r2/m0VLAzHPOHuMuTMoIXuMMWcmLrpTav/dOgxO.B5pfZZy','entreprise','2026-03-11 22:36:41'),(11,'','','candidat@test.com','$2b$10$RjxOTg0Bpgz4PptFAnkzc.c/EU5btn0.TX5EFpEDb6UvaBvXDInV.','candidat','2026-03-11 22:40:30'),(12,'','','entreprise1@test.com','$2b$10$hfyeHrj5fWI5k9EjJvtiMeZ8llLFow70gkzLueEIQL2StoiFVFeWi','entreprise','2026-03-11 22:42:59');
/*!40000 ALTER TABLE `utilisateur` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-03-13 17:51:47
