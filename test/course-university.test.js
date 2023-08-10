const sinon = require("sinon");
const express = require("express");
const request = require("supertest");
const { expect } = require("chai");
const course_universityRouter = require("../models/relation/course-university");
const connection = require("../server/server.js");

describe("Relation Router", () => {
  let connectionStub;
  let app;

  beforeEach(() => {
    connectionStub = sinon.stub(connection, "query");
    app = express();
    app.use("/api/relation", course_universityRouter);
  });

  afterEach(() => {
    connectionStub.restore();
  });
  it("should handle GET /api/relation", async () => {
    connectionStub.yields(null, [
      {
        courses_id: 1,
        course_name: "primo corso",
        typology_name: "tipologia x",
        university_id: 4,
        university_name: "studi",
        university_city: "bologna",
      },
      {
        courses_id: 2,
        course_name: "secondo corso",
        typology_name: "tipologia y",
        university_id: 4,
        university_name: "lavoro",
        university_city: "novara",
      },
    ]);
    const response = await request(app).get("/api/relation");
    expect(response.status).to.equal(200);
    expect(response.body).to.deep.equal([
        {
            courses_id: 1,
            course_name: "primo corso",
            typology_name: "tipologia x",
            university_id: 4,
            university_name: "studi",
            university_city: "bologna",
          },
          {
            courses_id: 2,
            course_name: "secondo corso",
            typology_name: "tipologia y",
            university_id: 4,
            university_name: "lavoro",
            university_city: "novara",
          },
    ]);
  });
  it("should handle POST at /api/relation?course_id=VALUE&university_id=VALUE", async () => {
    const course_id = 28;
    const university_id = 11; 
    connectionStub.yields(null, []); 
    const response = await request(app)
      .post(`/api/relation?course_id=${course_id}&university_id=${university_id}`)
      .expect(200);

    expect(response.body.message).to.equal(`Hai aggiunto una relazione tra il corso n° ${course_id} e l'università n° ${university_id}`);
  });;
  it("should handle errors during relation POST ", async () => {
    const invalid_course_id = 0; 
    const university_id = 2; 
    connectionStub.yields(new Error("Database error")); 
    const response = await request(app)
      .post(`/api/relation?course_id=${invalid_course_id}&university_id=${university_id}`)
      .expect(500);
    expect(response.body.error).to.equal("Errore nel server");
  });
  it("should return courses and universities based on search criteria", async () => {
    const course_name = "Math"; 
    const typology_name = "Science"; 

    const expectedResponse = [
      {
        courses_id: 1,
        course_name: "Math Course",
        typology_name: "Science",
        university_id: 4,
        university_name: "University X",
        university_city: "City A",
      },
    ];

    connectionStub.yields(null, expectedResponse);

    const response = await request(app)
      .get(`/api/relation/search?course_name=${course_name}&typology_name=${typology_name}`)
      .expect(200);

    expect(response.body).to.deep.equal(expectedResponse);
  });

  it("should handle no results from the search", async () => {
    const course_name = "Invalid Course"; 
    const typology_name = "Invalid Typology"; 

    connectionStub.yields(null, []); // Simula che la query non abbia prodotto risultati

    const response = await request(app)
      .get(`/api/relation/search?course_name=${course_name}&typology_name=${typology_name}`)
      .expect(200);
    expect(response.body).to.empty
  });
  it("should update a course-university relation", async () => {
    const relation_id = 6; 
    const updated_course_id = 16; 
    const updated_university_id = 4 ; 

    connectionStub.onFirstCall().yields(null, [
        {
            "courses_id": 2,
            "course_name": "corso_null",
            "typology_name": "dfghjhgfd",
            "university_id": 4,
            "university_name": "INSERT_NEW_NAME",
            "university_city": "INSERT_NEW_CITY"
        },
    ]); // Simula che il corso non esista
    connectionStub.onSecondCall().yields(null, [
        {
            "courses_id": 16,
            "course_name": "oooaaaa",
            "typology_name": "dfghjhgfd",
            "university_id": 333,
            "university_name": "INSERT_NEW_NAME",
            "university_city": "INSERT_NEW_CITY"
        },
    ]); // Simula che l'università non esista
    connectionStub.onThirdCall().yields(null, [	{
		"courses_id": 16,
		"course_name": "oooaaaa",
		"typology_name": "dfghjhgfd",
		"university_id": 4,
		"university_name": "INSERT_NEW_NAME",
		"university_city": "INSERT_NEW_CITY"
	},]); // Simula l'aggiornamento della relazione

    const response = await request(app)
      .put(`/api/relation/${relation_id}?`)
      .query({ course_id: updated_course_id, university_id: updated_university_id })

    expect(response.body.message).to.equal(`Hai aggiornato la relazione tra il corso n° ${updated_course_id} e l'università n° ${updated_university_id}`);
  });
});



