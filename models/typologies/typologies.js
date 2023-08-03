const express = require("express");
const typologiesRouter = express.Router();
const connection = require("../../server/server.js");
const idCheck = require('../../middleware/idCheckAsNum.js')
const stringCheck = require('../../middleware/stringParamCheck.js')

// get all from typology
typologiesRouter.get("/",
 (req, res) => {
  const query = "SELECT * FROM typology";
  connection.query(query, (err, results) => {
    if (err) {
      console.error("Errore nell'esecuzione della query:", err);
      res.status(500).json({ error: "Errore nel server" });
      return;
    }
    res.json(results);
  });
});
//single typo get 
typologiesRouter.get("/:typology_id",
idCheck("typology_id"),(req,res)=>{
 const typology_id= req.params.typology_id
 const singleGetQuery = `Select * from typology where typology_id = ?`
 connection.query(singleGetQuery,typology_id,(err, results)=>{
if(err){
  console.error("Errore durante la richiesta della tipologia ", err);
  res.status(500).json({ error: "Errore nel server" });
  return;
}


res.json(results);
 })

})
// add new typology from url
typologiesRouter.post("/:typology_name",
stringCheck("typology_name"), (req, res) => {
  const typology_name = req.params.typology_name;
  const newTypologyQuery = "INSERT INTO typology (typology_name) VALUES (?)";
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
typologiesRouter.delete("/:typology_id",
idCheck("typology_id"), (req, res) => {
  const typology_id = req.params.typology_id;

  const typology_name_query = "SELECT typology_name FROM typology WHERE typology_id = ?";
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

    const typology_name = selectResult[0].typology_name;
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
typologiesRouter.put("/:typology_id",
 idCheck("typology_id"), (req, res) => {
  const typology_id = req.params.typology_id;
  const new_typology_name = req.query.new_name;

  const typology_name_query = "SELECT * FROM typology WHERE typology_id = ?";
  connection.query(typology_name_query, [typology_id], (err, selectResult) => {
    if (err) {
      console.error("Errore nell'esecuzione della query di selezione:", err);
      res.status(500).json({ error: "Errore nel server" });
      return;
    }

    if (selectResult.length === 0) {
      // Tipologia non trovata
      res.status(404).json({ error: `Tipologia n° ${typology_id}, non trovata.` });
      return;
    }

    if (!new_typology_name) {
      // Nessun nuovo nome specificato nei query parameters
      res.status(400).json({ error: "Nuovo nome della tipologia mancante nei query parameters ricorda che l'url deve essere /id?new_name=nuovo_valore" });
      return;
    }

    const query = "UPDATE typology SET typology_name = ? WHERE typology_id = ?";
    connection.query(query, [new_typology_name, typology_id], (err, results) => {
      if (err) {
        console.error("Errore nell'esecuzione della query di aggiornamento:", err);
        res.status(500).json({ error: "Errore nel server" });
        return;
      }

      res.json(`Tipologia modificata con successo: ${new_typology_name}`);
    });
  });
});



module.exports = typologiesRouter;
