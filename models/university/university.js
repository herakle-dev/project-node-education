const express = require("express");
const universityRouter = express.Router();
const connection = require("../../server/server.js");
const idCheck = require("../../middleware/idCheckAsNum.js");
const stringCheck = require("../../middleware/stringParamCheck.js");
//get all from university
universityRouter.get("/",
 (req, res) => {
  const query = "select * from university";
  connection.query(query, (err, results) => {
    if (err) {
      console.error("Errore nell'esecuzione della query:", err);
      res.status(500).json({ error: "Errore nel server" });
      return;
    }
    res.json(results);
  });
});
//single get by id from university
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
      res.json(results);
    });
  }
);
//add new university with query param new_city& new_name
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
//update university
universityRouter.put("/:university_id",
idCheck('university_id'),
 (req, res) => {
  const university_id = req.params.university_id;
  const { new_name, new_city } = req.query;

  if (!new_name && !new_city) {
    return res.status(400).json({ error: "Nessun dato da aggiornare" });
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

      res.json(results);
    }
  );
});

//delete university
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
      // Tipologia non trovata
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
