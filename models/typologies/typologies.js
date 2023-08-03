const express = require("express");
const typologiesRouter = express.Router();
const connection = require("../../server/server.js");

// get all from typology
typologiesRouter.get("/", (req, res) => {
  const query = "SELECT * FROM typology";
  connection.query(query, (err, results, fields) => {
    if (err) {
      console.error("Errore nell'esecuzione della query:", err);
      res.status(500).json({ error: "Errore nel server" });
      return;
    }

    res.json(results);
  });
});

// add new typology from url
typologiesRouter.post("/:typology_name", (req, res) => {
  const typology_name = req.params.typology_name;
  const newTypologyQuery = "INSERT INTO typology (name_typology) VALUES (?)";
  connection.query(newTypologyQuery, [typology_name], (err, results) => {
    if (err) {
      console.error("Errore nell'esecuzione della query:", err);
      res.status(500).json({ error: "Errore nel server" });
      return;
    }
    res.json(`Tipologia aggiunta correttamente: ${typology_name}`);
  });
});

// delete
typologiesRouter.delete("/:typology_id", (req, res) => {
  const typology_id = req.params.typology_id;

  const typology_name_query = "SELECT name_typology FROM typology WHERE typology_id = ?";
  connection.query(typology_name_query, [typology_id], (err, selectResult) => {
    if (err) {
      console.error("Errore nell'esecuzione della query di selezione:", err);
      res.status(500).json({ error: "Errore nel server" });
      return;
    }

    if (selectResult.length === 0) {
      // Tipologia non trovata
      res.status(404).json({ error: "Tipologia non trovata" });
      return;
    }

    const typology_name = selectResult[0].name_typology;
    const deleteTypology = "DELETE FROM typology WHERE typology_id = ?";
    connection.query(deleteTypology, [typology_id], (err, deleteResult) => {
      if (err) {
        console.error("Errore nell'esecuzione della query di eliminazione:", err);
        res.status(500).json({ error: "Errore nel server" });
        return;
      }
      res.json(`Tipologia eliminata correttamente: ${typology_name}`);
    });
  });
});

// update typology_name
typologiesRouter.put("/:typology_id/:new_typology_name", (req, res) => {
  const typology_id = req.params.typology_id;
  const new_typology_name = req.params.new_typology_name;

  const query = "UPDATE typology SET name_typology = ? WHERE typology_id = ?";
  connection.query(query, [new_typology_name, typology_id], (err, results) => {
    if (err) {
      console.error("Errore nell'esecuzione della query di aggiornamento:", err);
      res.status(500).json({ error: "Errore nel server" });
      return;
    }

    if (results.affectedRows === 0) {
      // Tipologia non trovata
      res.status(404).json({ error: "Tipologia non trovata" });
      return;
    }

    res.json(`Tipologia modificata con successo: ${new_typology_name}`);
  });
});

module.exports = typologiesRouter;
