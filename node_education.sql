-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Creato il: Ago 03, 2023 alle 16:41
-- Versione del server: 10.4.28-MariaDB
-- Versione PHP: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `node_education`
--
CREATE DATABASE IF NOT EXISTS `node_education` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

-- --------------------------------------------------------
USE `node_education`;
--
-- Struttura della tabella `courses`
--

CREATE TABLE `courses` (
  `courses_id` int(11) NOT NULL,
  `course_name` varchar(255) NOT NULL,
  `fk_typology` int(11) NOT NULL COMMENT 'foreign key'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `relation_courses_university`
--

CREATE TABLE `relation_courses_university` (
  `courses_id` int(11) NOT NULL,
  `university_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `typology`
--

CREATE TABLE `typology` (
  `typology_id` int(11) NOT NULL,
  `typology_name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `university`
--

CREATE TABLE `university` (
  `university_id` int(11) NOT NULL,
  `university_name` varchar(255) NOT NULL,
  `university_city` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indici per le tabelle scaricate
--

--
-- Indici per le tabelle `courses`
--
ALTER TABLE `courses`
  ADD PRIMARY KEY (`courses_id`),
  ADD KEY `fk_typology` (`fk_typology`);

--
-- Indici per le tabelle `relation_courses_university`
--
ALTER TABLE `relation_courses_university`
  ADD KEY `courses_id` (`courses_id`),
  ADD KEY `university_id` (`university_id`);

--
-- Indici per le tabelle `typology`
--
ALTER TABLE `typology`
  ADD UNIQUE KEY `typology_id` (`typology_id`);

--
-- Indici per le tabelle `university`
--
ALTER TABLE `university`
  ADD PRIMARY KEY (`university_id`);

--
-- AUTO_INCREMENT per le tabelle scaricate
--

--
-- AUTO_INCREMENT per la tabella `courses`
--
ALTER TABLE `courses`
  MODIFY `courses_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT per la tabella `typology`
--
ALTER TABLE `typology`
  MODIFY `typology_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT per la tabella `university`
--
ALTER TABLE `university`
  MODIFY `university_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Limiti per le tabelle scaricate
--

--
-- Limiti per la tabella `courses`
--
ALTER TABLE `courses`
  ADD CONSTRAINT `courses_ibfk_1` FOREIGN KEY (`fk_typology`) REFERENCES `typology` (`typology_id`);

--
-- Limiti per la tabella `relation_courses_university`
--
ALTER TABLE `relation_courses_university`
  ADD CONSTRAINT `relation_courses_university_ibfk_1` FOREIGN KEY (`courses_id`) REFERENCES `courses` (`courses_id`),
  ADD CONSTRAINT `relation_courses_university_ibfk_2` FOREIGN KEY (`university_id`) REFERENCES `university` (`university_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
