 const express = require("express");
 const coursesRouter = express.Router();
 const connection = require("../../server/server.js");
const check = require('../../middleware/checkParamsMiddleware.js')
// Ottieni tutti i corsi
coursesRouter.get("/", (req, res) => {
  const query = "SELECT * FROM courses";

  connection.query(query, (err, results, fields) => {
    if (err) {
      console.error("Errore nell'esecuzione della query:", err);
      res.status(500).json({ error: "Errore nel server" });
      return;
    }

    console.log("Risultati:", results);
    res.json(results);
  });
});

// Aggiungi un nuovo corso
coursesRouter.post("/:course_name/:fk_typology",check, (req, res) => {
    const course_name = req.params.course_name;
    //int check

    const fk_typology =req.params.fk_typology
  const insertQuery = "INSERT INTO courses (course_name, fk_typology) VALUES (?,?)";

  connection.query(insertQuery, [course_name, fk_typology], (err, results, fields) => {
    if (err) {
      console.error("Errore nell'esecuzione della query di inserimento:", err);
      
      res.status(500).json({ error: "Errore nel server" });
      return;
    }
    res.json(`Corso inserito con successo : ${course_name} `);
  });
});

// // Modifica un corso esistente
coursesRouter.put("/:course_id/:course_name/:fk_typology",check("course_id","course_name","fk_typology"), (req, res) => {
  const  course_id  = req.params.course_id;
  const course_name=req.params.course_name;
  const fk_typology=req.params.fk_typology;
  
  const updateQuery = `UPDATE courses SET course_name = ?, fk_typology=? WHERE courses_id =?`;

  connection.query(updateQuery,[course_name,fk_typology,course_id], (err, results, fields) => {
    if (err) {
      console.error("Errore nell'esecuzione della query di modifica:", err);
      res.status(500).json({ error: "Errore nel server" });
      return;
    }

    console.log("Corso modificato con successo:", results);
    res.json(results);
  });
});

// // Cancella un corso
coursesRouter.delete("/:course_id",check, (req, res) => {
  const  course_id  = req.params.course_id;
  const deleteQuery = `DELETE FROM courses WHERE courses_id = ?`;

  connection.query(deleteQuery, course_id, (err, results, fields) => {
    if (err) {
      console.error("Errore nell'esecuzione della query di cancellazione:", err);
      res.status(500).json({ error: "Errore nel server" });
      return;
    }

    console.log("Corso cancellato con successo:", results);
    res.json(results);
  });
});

 module.exports = coursesRouter;
