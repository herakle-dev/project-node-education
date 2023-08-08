const express = require("express");
const universityRouter = express.Router();
const connection = require("../../server/server.js");
const idCheck = require("../../middleware/idCheckAsNum.js");
const stringCheck = require("../../middleware/stringParamCheck.js");

//GET all from university method get at api/university
universityRouter.get("/",
 (req, res) => {
  const query = "select * from university";
  connection.query(query, (err, results) => {
    if (err) {
      console.error("Errore nell'esecuzione della query:", err);
      res.status(500).json({ error: "Errore nel server" });
      return;
    }
      res.status(200).json(results);;
  });
});

//single get by id from university method GET at api/university/MUST_EXIST_ID
universityRouter.get("/:university_id",
  idCheck("university_id"),
  (req, res) => {
    const university_id = req.params.university_id;
    const singleUniQuery = "select * from university where university_id = ?";
    connection.query(singleUniQuery, university_id, (err, results) => {
      if (err) {
        console.error("Errore nell'esecuzione della query:", err);
        res.status(500).json({ error: "Errore nel server" });
        return;
      }
        res.status(200).json(results);;
    });
  }
);

//add new university method POST at : api/university/UNIVERSITY_CITY/UNIVERSITY_NAME
universityRouter.post("/:university_city/:university_name/",
  stringCheck("university_city"),
  stringCheck("university_name"),
  (req, res) => {
    const university_name = req.params.university_name;
    const university_city = req.params.university_city;
    const newUniversityQuery =
      "insert into university (university_city,university_name) values (?, ?)";

    connection.query(
      newUniversityQuery,
      [university_city, university_name],
      (err, results) => {
        if (err) {
          console.error("Errore nell'esecuzione della query:", err);
          res.status(500).json({ error: "Errore nel server" });
          return;
        }

        res.json(
          `Hai aggiunto una nuova università che si trova : ${university_city}, con nome ${university_name}`
        );
      }
    );
  }
);

//modify university by id method PUT  at : api/university/ID_MUST_EXIST?new_name=INSERT_NEW_NAME&new_city=INSERT_NEW_CITY
universityRouter.put("/:university_id",
idCheck('university_id'),
 (req, res) => {
  const university_id = req.params.university_id;
  const { new_name, new_city } = req.query;

  if (!new_name && !new_city) {
    return res.status(400).json({ error: "Nessun dato da aggiornare" });
  }

  const findQuery = `SELECT * FROM university WHERE university_id = ?`;
  connection.query(findQuery, university_id, (err, results) => {
    if (err) {
      console.error("Errore nell'esecuzione della query di ricerca:", err);
      res.status(500).json({ error: "Errore nel server" });
      return;
    }

    if (results.length === 0) {
      res.status(404).json({ error: `Il corso con ID ${university_id} non esiste` });
      return;
    }
 

  const updateData = {};
  if (new_name) {
    updateData.university_name = new_name;
  }

  if (new_city) {
    updateData.university_city = new_city;
  }

  const updateQuery = "UPDATE university SET ? WHERE university_id = ?";

  connection.query(
    updateQuery,
    [updateData, university_id],
    (err, results, fields) => {
      if (err) {
        console.error("Errore nell'esecuzione della query di modifica:", err);
        res.status(500).json({ error: "Errore nel server" });
        return;
      }

        res.status(200).json(results);;
    }
  );
});});

//delete university by id method DELETE at api/university/ID_MUST_EXIST
universityRouter.delete('/:university_id',
 idCheck('university_id'),
 (req,res)=>{
    const university_id = req.params.university_id;   
  const university_name_query = "SELECT university_name FROM university WHERE university_id = ?";
  connection.query(university_name_query, [university_id], (err, selectResult) => {
    if (err) {
      console.error("Errore nell'esecuzione della query di selezione:", err);
      res.status(500).json({ error: "Errore nel server" });
      return;
    }

    if (selectResult.length === 0) {
      res.status(404).json({ error: "Università non trovata" });
      return;
    }

    const university_name = selectResult[0].university_name;
    const deleteUniversityQuery = "DELETE FROM university WHERE university_id = ?";
    connection.query(deleteUniversityQuery, [university_id], (err, deleteResult) => {
      if (err) {
        console.error("Errore nell'esecuzione della query di eliminazione:", err);
        res.status(500).json({ error: "Errore nel server" });
        return;
      }
      res.json(`Università eliminata correttamente: ${university_name}`);
    });
  });
})

module.exports = universityRouter;
