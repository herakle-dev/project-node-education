const express = require("express");
const universityRouter = express.Router();
const connection = require("../../server/server.js");
const idCheck = require("../../middleware/idCheckAsNum.js");
const stringCheck = require("../../middleware/stringParamCheck.js");
const { sendErrorByStatusCode } = require("../../function/errorHandling.js");

//GET all from university method get at api/university
universityRouter.get("/",
 (req, res) => {
  const query = "select * from university";
  connection.query(query, (err, results) => {
    if (err) {
      sendErrorByStatusCode(res, 500);
      return;
    }
    if (results.length === 0) {
      sendErrorByStatusCode(res, 404);
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
        sendErrorByStatusCode(res, 500);
        return;
      }
      if (results.length === 0) {
        sendErrorByStatusCode(res, 404, "Università non trovata");
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
          sendErrorByStatusCode(res, 500);
          return;
        }
  sendErrorByStatusCode(res,200,`Hai aggiunto ${university_name} come università e come città: ${university_city}.` )
      
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
     return sendErrorByStatusCode(res, 400,'Nessun dato da aggiornare')

  }

  const findQuery = `SELECT * FROM university WHERE university_id = ?`;
  connection.query(findQuery, university_id, (err, results) => {
    if (err) {
 sendErrorByStatusCode(res,500)
      return;
    }

    if (results.length === 0) {
      sendErrorByStatusCode(res, 404,  `L'università con ID ${university_id} non esiste` )
    
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
        sendErrorByStatusCode(res,500,"Errore nell'esecuzione della query di modifica:")
        return;
      }
      sendErrorByStatusCode(res,200, `Universita aggiornata correttamente con : ${new_name},${new_city}`)
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
   sendErrorByStatusCode(res,500,"Errore nella cancellazione dell'università ")
      return;
    }

    if (selectResult.length === 0) {
      sendErrorByStatusCode(res,404,"Università non trovata" )
      return;
    }

    const university_name = selectResult[0].university_name;
    const deleteUniversityQuery = "DELETE FROM university WHERE university_id = ?";
    connection.query(deleteUniversityQuery, [university_id], (err, deleteResult) => {
      if (err) {
        sendErrorByStatusCode(res,500, "Errore nell'esecuzione della query di eliminazione" )
        return;
      }
     sendErrorByStatusCode(res,200,`Università eliminata correttamente: ${university_name}`)
    });
  });
})

module.exports = universityRouter;
