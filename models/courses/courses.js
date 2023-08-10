const express = require("express");
const coursesRouter = express.Router();
const connection = require("../../server/server.js");
const idCheck = require("../../middleware/idCheckAsNum.js");
const stringCheck = require("../../middleware/stringParamCheck.js");
const { sendErrorByStatusCode } = require("../../function/errorHandling.js");

// get all courses  method GET at api/courses
coursesRouter.get("/", (req, res) => {
  const query = "SELECT * FROM courses";
  connection.query(query, (err, results, fields) => {
    if (err) {
      sendErrorByStatusCode(res,500)
      return;
    }
    res.status(200).json(results);
  });
});

// search courses by typology id (foreign key) method get at api/courses/typology/TYPOLOGY_ID_MUST_EXIST
coursesRouter.get(
  "/typology/:fk_typology",
  idCheck("fk_typology"),
  (req, res) => {
    const fk_typology = req.params.fk_typology;
    const query = "SELECT * FROM courses WHERE fk_typology = ?";

    connection.query(query, fk_typology, (err, results) => {
      if (err) {
        sendErrorByStatusCode(res,500)
        return;
      }
      if (results.length === 0) {
        sendErrorByStatusCode(res, 404, "Tipologia non trovata");
        return;
      }
      res.status(200).json(results);
    });
  }
);

//single courses get method GET at api/courses/ID_MUST_EXIST
coursesRouter.get("/:course_id", idCheck("course_id"), (req, res) => {
  const course_id = req.params.course_id;
  const singleGetQuery = "SELECT * FROM courses where courses_id= ?";
  connection.query(singleGetQuery, course_id, (err, results, fields) => {
    if (err) {
      sendErrorByStatusCode(res,500)

      return;
    }
    if (results.length === 0) {
      sendErrorByStatusCode(res, 404, "Corso non trovato");
      return;
    }
    
    res.status(200).json(results);
  });
});

// add new course method POST at api/courses/INSERT_COURSE_NAME/INSERT_TYPOLOGY_ID(MUST_EXIST)
coursesRouter.post(
  "/:course_name/:fk_typology",
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
          sendErrorByStatusCode(res,500)
    
          return;
        }
    sendErrorByStatusCode(res, 200,`Corso inserito con successo : ${course_name}`)
      }
    );
  }
);

/*                        modify course name & typology 
method PUT at api/courses/ID_MUST_EXIST?new_name=INSERT_NEW_COURSE_NAME&new_typology=INSERT_NEW_TYPOLOGY_ID(MUST_EXIST) */
coursesRouter.put("/:courses_id", idCheck("courses_id"), (req, res) => {
  const courses_id = req.params.courses_id;
  const { new_name, new_typology } = req.query;

  if (!new_name && !new_typology) {
  return  sendErrorByStatusCode(res, 400, "Nessun dato da aggiornare")
  }

  const findQuery = `SELECT * FROM courses WHERE courses_id = ?`;
  connection.query(findQuery, courses_id, (err, results) => {
    if (err) {
     sendErrorByStatusCode(res,500)
      return;
    }

    if (results.length === 0) {
      sendErrorByStatusCode(res, 404, `Il corso con ID ${courses_id} non esiste` )
   
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

    connection.query(
      updateQuery,
      [updateData, courses_id],
      (err, results, fields) => {
        if (err) {
          sendErrorByStatusCode(res,500)
          return;
        }
sendErrorByStatusCode(res, 200,`Corso con ID ${courses_id} modificato con successo.` )
      }
    );
  });
});

//  course delete for id method DELETE at api/courses/ID_MUST_EXIST
coursesRouter.delete("/:course_id", idCheck("course_id"), (req, res) => {
  const course_id = req.params.course_id;

  const findQuery = `SELECT * FROM courses WHERE courses_id = ?`;

  connection.query(findQuery, course_id, (err, results) => {
    if (err) {
sendErrorByStatusCode(res,500)
      return;
    }

    if (results.length === 0) {
    sendErrorByStatusCode(res,404,`Il corso con ID ${course_id} non esiste` )
      return;
    }

    const deleteQuery = `DELETE FROM courses WHERE courses_id = ?`;

    connection.query(deleteQuery, course_id, (err, results, fields) => {
      if (err) {
    sendErrorByStatusCode(res,500)
        return;
      }
sendErrorByStatusCode(res,200,`Corso n° ${course_id} cancellato con successo!`)
    });
  });
});

module.exports = coursesRouter;
