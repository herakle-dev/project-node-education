CREATE DATABASE IF NOT EXISTS reach17-db;
USE reach17-db;

-- Creazione della tabella "Corsi"
CREATE TABLE Corsi (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nome VARCHAR(100) NOT NULL,
  tipologia VARCHAR(50) NOT NULL
);

-- Creazione della tabella "Istituti"
CREATE TABLE Istituti (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nome VARCHAR(100) NOT NULL,
  città VARCHAR(50) NOT NULL
);

-- Creazione della tabella di relazione "CorsoIstituto"
CREATE TABLE CorsoIstituto (
  corso_id INT,
  istituto_id INT,
  PRIMARY KEY (corso_id, istituto_id),
  FOREIGN KEY (corso_id) REFERENCES Corsi(id) ON DELETE CASCADE,
  FOREIGN KEY (istituto_id) REFERENCES Istituti(id) ON DELETE CASCADE
);
