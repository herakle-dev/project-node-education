SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

CREATE DATABASE IF NOT EXISTS `node_education` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `node_education`;

CREATE TABLE `courses` (
  `courses_id` int(11) NOT NULL,
  `course_name` varchar(255) NOT NULL,
  `fk_typology` int(11) NOT NULL COMMENT 'foreign key'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `relation_courses_university` (
  `relation_id` int(11) NOT NULL,
  `courses_id` int(11) NOT NULL,
  `university_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `typology` (
  `typology_id` int(11) NOT NULL,
  `typology_name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `university` (
  `university_id` int(11) NOT NULL,
  `university_name` varchar(255) NOT NULL,
  `university_city` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


ALTER TABLE `courses`
  ADD PRIMARY KEY (`courses_id`),
  ADD KEY `fk_typology` (`fk_typology`);

ALTER TABLE `relation_courses_university`
  ADD PRIMARY KEY (`relation_id`),
  ADD UNIQUE KEY `unique_relation` (`courses_id`,`university_id`),
  ADD KEY `university_id` (`university_id`);

ALTER TABLE `typology`
  ADD UNIQUE KEY `typology_id` (`typology_id`);

ALTER TABLE `university`
  ADD PRIMARY KEY (`university_id`);


ALTER TABLE `courses`
  MODIFY `courses_id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `relation_courses_university`
  MODIFY `relation_id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `typology`
  MODIFY `typology_id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `university`
  MODIFY `university_id` int(11) NOT NULL AUTO_INCREMENT;


ALTER TABLE `courses`
  ADD CONSTRAINT `courses_ibfk_1` FOREIGN KEY (`fk_typology`) REFERENCES `typology` (`typology_id`);

ALTER TABLE `relation_courses_university`
  ADD CONSTRAINT `relation_courses_university_ibfk_1` FOREIGN KEY (`courses_id`) REFERENCES `courses` (`courses_id`),
  ADD CONSTRAINT `relation_courses_university_ibfk_2` FOREIGN KEY (`university_id`) REFERENCES `university` (`university_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
