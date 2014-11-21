DROP TABLE IF EXISTS warning;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE warning (
  id bigint(20) NOT NULL AUTO_INCREMENT,
  id_message int(11) DEFAULT NULL,
  id_contact_type int(11) DEFAULT NULL,
  contact varchar(255) DEFAULT NULL,
  sent bit(1) DEFAULT NULL,
  message varchar(255) DEFAULT NULL,
  ip varchar(255) DEFAULT NULL,
  browser varchar(255) DEFAULT NULL,
  operating_system varchar(255) DEFAULT NULL,
  device varchar(255) DEFAULT NULL,
  raw varchar(255) DEFAULT NULL,
  created_by varchar(255) DEFAULT NULL,
  created_date datetime DEFAULT NULL,
  last_modified_by varchar(255) DEFAULT NULL,
  last_modified_date datetime DEFAULT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table warning
--

LOCK TABLES warning WRITE;
/*!40000 ALTER TABLE warning DISABLE KEYS */;
/*!40000 ALTER TABLE warning ENABLE KEYS */;
UNLOCK TABLES;

DROP TABLE IF EXISTS message;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE message (
  id bigint(20) NOT NULL AUTO_INCREMENT,
  name varchar(255) DEFAULT NULL,
  created_by varchar(255) DEFAULT NULL,
  created_date datetime DEFAULT NULL,
  last_modified_by varchar(255) DEFAULT NULL,
  last_modified_date datetime DEFAULT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table message
--

LOCK TABLES message WRITE;
/*!40000 ALTER TABLE message DISABLE KEYS */;
INSERT INTO message VALUES (1,'Está com Mal Hálito','system','2014-11-03 00:00:00',NULL,NULL),(2,'Está com cheio desagradável de suor','system','2014-11-03 00:00:00',NULL,NULL),(3,'Tem Sujeira nos dentes','system','2014-11-03 00:00:00',NULL,NULL),(4,'Tem Sinal de menstruação na roupa','system','2014-11-03 00:00:00',NULL,NULL),(5,'Tem Sugeira de merda no vaso de casa','system','2014-11-03 00:00:00',NULL,NULL),(6,'Está sendo traido(a)','system','2014-11-03 00:00:00',NULL,NULL),(7,'Está Fazendo barulho incomodo com a boca','system','2014-11-03 00:00:00',NULL,NULL),(8,'Está Fazendo barulho incomodo com pés ou mãos','system','2014-11-03 00:00:00',NULL,NULL),(9,'Está com chulé','system','2014-11-03 00:00:00',NULL,NULL);
/*!40000 ALTER TABLE message ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table contact_type
--

DROP TABLE IF EXISTS contact_type;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE contact_type (
  id bigint(20) NOT NULL AUTO_INCREMENT,
  name varchar(255) DEFAULT NULL,
  created_by varchar(255) DEFAULT NULL,
  created_date datetime DEFAULT NULL,
  last_modified_by varchar(255) DEFAULT NULL,
  last_modified_date datetime DEFAULT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table contact_type
--

LOCK TABLES contact_type WRITE;
/*!40000 ALTER TABLE contact_type DISABLE KEYS */;
INSERT INTO contact_type VALUES (1,'E-mail','system','2014-11-03 00:00:00',NULL,NULL),(2,'SMS','system','2014-11-03 00:00:00',NULL,NULL),(3,'Facebook','system','2014-11-03 00:00:00',NULL,NULL);
/*!40000 ALTER TABLE contact_type ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table T_USER
--
