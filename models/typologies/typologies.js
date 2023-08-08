const express = require("express");
const typologiesRouter = express.Router();
const connection = require("../../server/server.js");
const idCheck = require('../../middleware/idCheckAsNum.js')
const stringCheck = require('../../middleware/stringParamCheck.js')
const { sendErrorByStatusCode } = require("../../function/errorHandling.js");

// get all from typology method get at api/typology
typologiesRouter.get("/",
 (req, res) => {
  const query = "SELECT * FROM typology";
  connection.query(query, (err, results) => {
    if (err) {
   sendErrorByStatusCode(res,500)
      return;
    }
      res.status(200).json(results);;
  });
});
//single typology get by existing id method get at  api/typology/EXISTING_ID
typologiesRouter.get("/:typology_id",
idCheck("typology_id"),(req,res)=>{
 const typology_id= req.params.typology_id
 const singleGetQuery = `Select * from typology where typology_id = ?`
 connection.query(singleGetQuery,typology_id,(err, results)=>{
if(err){
sendErrorByStatusCode(res,500)
  return;
}
if (results.length === 0) {
  sendErrorByStatusCode(res, 404);
  return;
}


  res.status(200).json(response);;
 })

})

// add new typology from url : method post at api/typology/NEW_TYPOLOGY_NAME
typologiesRouter.post("/:typology_name",
stringCheck("typology_name"), (req, res) => {
  const typology_name = req.params.typology_name;
  const newTypologyQuery = "INSERT INTO typology (typology_name) VALUES (?)";
  connection.query(newTypologyQuery, [typology_name], (err, results) => {
    if (err) {
  sendErrorByStatusCode(res,500)
      return;
    }
    sendErrorByStatusCode(res,200, `Tipologia aggiunta correttamente: ${typology_name}`)
  });
});

// delete typology by existing id : method delete at api/typology/EXISTING_TYPOLOGY_ID
typologiesRouter.delete("/:typology_id",
idCheck("typology_id"), (req, res) => {
  const typology_id = req.params.typology_id;
  const typology_name_query = "SELECT typology_name FROM typology WHERE typology_id = ?";
  connection.query(typology_name_query, [typology_id], (err, selectResult) => {
    if (err) {
    sendErrorByStatusCode(res,500)
      return;
    }

    if (selectResult.length === 0) {
sendErrorByStatusCode(res,404, "Tipologia non trovata") 
     return;
    }

    const typology_name = selectResult[0].typology_name;
    const deleteTypology = "DELETE FROM typology WHERE typology_id = ?";
    connection.query(deleteTypology, [typology_id], (err, deleteResult) => {
      if (err) {
sendErrorByStatusCode(res,500)
        return;
      }
      sendErrorByStatusCode(res,200,`Tipologia eliminata correttamente: ${typology_name}`)
    });
  });
});

// update typology_name from existing id : method put at api/typology?new_typology_name=INSERT_NEW_NAME
typologiesRouter.put("/:typology_id",
 idCheck("typology_id"), (req, res) => {
  const typology_id = req.params.typology_id;
  const new_typology_name = req.query.new_name;

  const typology_name_query = "SELECT * FROM typology WHERE typology_id = ?";
  connection.query(typology_name_query, [typology_id], (err, selectResult) => {
    if (err) {
  sendErrorByStatusCode(res,500)
      return;
    }

    if (selectResult.length === 0) {
      // Tipologia non trovata
     sendErrorByStatusCode(res,404,`Tipologia n° ${typology_id}, non trovata.` )
      return;
    }

    if (!new_typology_name) {
      // Nessun nuovo nome specificato nei query parameters
sendErrorByStatusCode(res,400, "Nuovo nome della tipologia mancante nei query parameters ricorda che l'url deve essere /id?new_name=nuovo_valore")
      return;
    }

    const query = "UPDATE typology SET typology_name = ? WHERE typology_id = ?";
    connection.query(query, [new_typology_name, typology_id], (err, results) => {
      if (err) {
       sendErrorByStatusCode(res,500)
        return;
      }
sendErrorByStatusCode(res,200,`Tipologia modificata con successo: ${new_typology_name}`)
    });
  });
});

module.exports = typologiesRouter;
