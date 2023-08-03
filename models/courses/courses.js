const express = require("express");
const coursesRouter = express.Router();
const connection = require("../../server/server.js");
const idCheck = require("../../middleware/idCheckAsNum.js");
const stringCheck = require("../../middleware/stringParamCheck.js");
// Ottieni tutti i corsi
coursesRouter.get("/",
 (req, res) => {
  const query = "SELECT * FROM courses";

  connection.query(query, (err, results, fields) => {
    if (err) {
      console.error("Errore nell'esecuzione della query:", err);
      res.status(500).json({ error: "Errore nel server" });
      return;
    }

    res.json(results);
  });
});
// filter courses by typology id (foreign key)
coursesRouter.get('/typology/:fk_typology', idCheck('fk_typology'), (req, res) => {
  const fk_typology = req.params.fk_typology;
  const query = 'SELECT * FROM courses WHERE fk_typology = ?';

  connection.query(query, fk_typology, (err, results) => {
    if (err) {
      console.error('Errore nell\'esecuzione della query:', err);
      res.status(500).json({ error: 'Errore nel server' });
      return;
    }

    res.json(results);
  });
});
//single courses get
coursesRouter.get("/:course_id",
 idCheck("course_id"), (req, res) => {
  const course_id = req.params.course_id;
  const singleGetQuery = "SELECT * FROM courses where courses_id= ?";
  connection.query(singleGetQuery, course_id, (err, results, fields) => {
    if (err) {
      console.error("Errore nell'esecuzione della query:", err);
      res.status(500).json({ error: "Errore nel server" });
      return;
    }
    res.json(results);
  });
});
// add new course
coursesRouter.post("/:course_name/:fk_typology",
  stringCheck("course_name"),
  idCheck("fk_typology"),
  (req, res) => {
    const course_name = req.params.course_name;

    const fk_typology = req.params.fk_typology;
    const insertQuery =
      "INSERT INTO courses (course_name, fk_typology) VALUES (?,?)";

    connection.query(
      insertQuery,
      [course_name, fk_typology],
      (err, results, fields) => {
        if (err) {
          console.error(
            "Errore nell'esecuzione della query di inserimento:",
            err
          );

          res.status(500).json({ error: "Errore nel server" });
          return;
        }
        res.json(`Corso inserito con successo : ${course_name} `);
      }
    );
  }
);
//  modify course name & typology with query parameter by id
coursesRouter.put("/:courses_id", idCheck("courses_id"),
 (req, res) => {
  const courses_id = req.params.courses_id;
  const { new_name, new_typology } = req.query;

  if (!new_name && !new_typology) {
    return res.status(400).json({ error: "Nessun dato da aggiornare" });
  }

  const findQuery = `SELECT * FROM courses WHERE courses_id = ?`;
  connection.query(findQuery, courses_id, (err, results) => {
    if (err) {
      console.error("Errore nell'esecuzione della query di ricerca:", err);
      res.status(500).json({ error: "Errore nel server" });
      return;
    }

    if (results.length === 0) {
      res.status(404).json({ error: `Il corso con ID ${courses_id} non esiste` });
      return;
    }

    const updateData = {};
    if (new_name) {
      updateData.course_name = new_name;
    }

    if (new_typology) {
      updateData.fk_typology = new_typology;
    }

    const updateQuery = "UPDATE courses SET ? WHERE courses_id = ?";

    connection.query(updateQuery, [updateData, courses_id], (err, results, fields) => {
      if (err) {
        console.error("Errore nell'esecuzione della query di modifica:", err);
        res.status(500).json({ error: "Errore nel server" });
        return;
      }

      res.json(`Corso con ID ${courses_id} modificato con successo.`);
    });
  });
});
//  course delete for id
coursesRouter.delete("/:course_id",
 idCheck("course_id"), (req, res) => {
  const course_id = req.params.course_id;

  const findQuery = `SELECT * FROM courses WHERE courses_id = ?`;

  connection.query(findQuery, course_id, (err, results) => {
    if (err) {
      console.error("Errore nell'esecuzione della query di ricerca:", err);
      res.status(500).json({ error: "Errore nel server" });
      return;
    }

    if (results.length === 0) {
      res
        .status(404)
        .json({ error: `Il corso con ID ${course_id} non esiste` });
      return;
    }

    const deleteQuery = `DELETE FROM courses WHERE courses_id = ?`;

    connection.query(deleteQuery, course_id, (err, results, fields) => {
      if (err) {
        console.error(
          "Errore nell'esecuzione della query di cancellazione:",
          err
        );
        res.status(500).json({ error: "Errore nel server" });
        return;
      }

      res.json(`Corso n° ${course_id} cancellato con successo!`);
    });
  });
});

module.exports = coursesRouter;
