const express = require("express");
const course_universityRouter = express.Router();
const connection = require("../../server/server.js");
const idCheck = require("../../middleware/idCheckAsNum.js");
const stringCheck = require("../../middleware/stringParamCheck.js");


//get all relations course/university with useful info with inner join,  method get at api/relation
course_universityRouter.get("/", (req, res) => {
  getAllRelationsQuery = `SELECT courses.courses_id, courses.course_name,typology.typology_name,
   university.university_id, university.university_name,university.university_city 
   FROM relation_courses_university 
   INNER JOIN courses ON courses.courses_id= relation_courses_university.courses_id 
   INNER JOIN university on university.university_id=relation_courses_university.university_id
    INNER join typology on courses.fk_typology = typology.typology_id;`;
  connection.query(getAllRelationsQuery, (err, response) => {
    if (err) {
      console.error("Errore nell'esecuzione della query:", err);
      res.status(500).json({ error: "Errore nel server" });
      return;
    }

    res.status(200).json(response);
  });
});
/*search by course name or typologyname,
 case insensitive search,      method get at  api/relation/search?typology_name=INSERT_EXISTING_TYPOLOGY_NAME&course_name=INSERT_EXISTING_COURSE_NAME */
course_universityRouter.get('/search', (req, res) => {
  const course_name = req.query.course_name;
  const typology_name = req.query.typology_name;

  const conditionArray = [];
  const parameterArray = [];

  if (course_name) {
    conditionArray.push(`LOWER(courses.course_name) LIKE ?`);
    parameterArray.push(`%${course_name.toLowerCase()}%`);
  }
  if (typology_name) {
    if (typology_name.length === 0) {
      conditionArray.push(`LOWER(typology.typology_name) = ?`);
      parameterArray.push(typology_name.toLowerCase());
    } else {
      conditionArray.push(`LOWER(typology.typology_name) LIKE ?`);
      parameterArray.push(`%${typology_name.toLowerCase()}%`);
    }
  }

  let conditionClause = "";
  if (conditionArray.length > 0) {
    conditionClause = "WHERE " + conditionArray.join(" AND ");
  }

  const getAllRelationsQuery = `SELECT courses.courses_id, courses.course_name, typology.typology_name,
    university.university_id, university.university_name, university.university_city 
    FROM relation_courses_university 
    INNER JOIN courses ON courses.courses_id = relation_courses_university.courses_id 
    INNER JOIN university ON university.university_id = relation_courses_university.university_id
    INNER JOIN typology ON courses.fk_typology = typology.typology_id
    ${conditionClause};`;

  connection.query(getAllRelationsQuery, parameterArray, (err, response) => {
    if (err) {
      console.error("Errore nell'esecuzione della query:", err);
      res.status(500).json({ error: "Errore nel server" });
      return;
    }
    res.json(response);
  });
});
// post relations URL?course_id=MUST_EXIST_VALUE&university_id=MUST_EXIST_VALUE
course_universityRouter.post("", (req, res) => {
  const courses_id = req.query.course_id;
  const university_id = req.query.university_id;
  addRelationQuery =
    "INSERT INTO relation_courses_university (courses_id, university_id) VALUES (?,?)";
  connection.query(
    addRelationQuery,
    [courses_id, university_id],
    (err, results) => {
      if (err) {
        console.error("Errore nell'esecuzione della query:", err);
        res.status(500).json({ error: "Errore nel server" });
        return;
      }
      res.json(
        `Hai aggiunto una relazione tra il corso n° ${courses_id} e l'università n° ${university_id}`
      );
    }
  );
});
//modify by id   method put at  api/relation/relation_id?course_id=MUST_EXIST_VALUE&university_id=MUST_EXIST_VALUE
course_universityRouter.put("/:relation_id", idCheck('relation_id'), (req, res) => {
  const relation_id = req.params.relation_id;
  const courses_id = req.query.course_id;
  const university_id = req.query.university_id;

  if (!university_id && !courses_id) {
    return res.status(400).json({ error: "Nessun dato da aggiornare" });
  }
  const findCourseQuery = `SELECT * FROM courses WHERE courses_id = ?`;
  connection.query(findCourseQuery, courses_id, (err, results) => {
    if (err) {
      console.error("Errore nell'esecuzione della query di ricerca:", err);
      res.status(500).json({ error: "Errore nel server" });
      return;
    }
    if (results.length === 0) {
      res
        .status(404)
        .json({ error: `Il corso con ID ${courses_id} non esiste` });
      return;
    }
    const findUniversityQuery = `SELECT * FROM university WHERE university_id = ?`;
    connection.query(findUniversityQuery, university_id, (err, results) => {
      if (err) {
        console.error("Errore nell'esecuzione della query di ricerca:", err);
        res.status(500).json({ error: "Errore nel server" });
        return;
      }
      if (results.length === 0) {
        res
          .status(404)
          .json({ error: `L'università con ID ${university_id} non esiste` });
        return;
      }
      updateRelationQuery =
        "UPDATE relation_courses_university SET courses_id=?, university_id=? WHERE relation_id=? ";
      connection.query(
        updateRelationQuery,
        [courses_id, university_id, relation_id],
        (err, results) => {
          if (err) {
            console.error("Errore nell'esecuzione della query:", err);
            res.status(500).json({ error: "Errore nel server" });
            return;
          }

          if (results.affectedRows === 0) {
            res
              .status(404)
              .json({ error: "La relazione specificata non esiste" });
            return;
          }
          res.json(
            `Hai aggiornato la relazione tra il corso n° ${courses_id} e l'università n° ${university_id}`
          );
        }
      );
    });
  });
});

module.exports = course_universityRouter;
