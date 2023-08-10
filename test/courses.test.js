const sinon = require('sinon');
const express = require('express');
const request = require('supertest');
const { expect } = require('chai');
const coursesRouter = require('../models/courses/courses');
const connection = require('../server/server.js');
describe('Courses Router', () => {
    let connectionStub;
    let app;
  
    beforeEach(() => {
      connectionStub = sinon.stub(connection, 'query'); 
      app = express();
      app.use('/api/courses', coursesRouter);
    });
  
    afterEach(() => {
      connectionStub.restore(); 
    });
    it('should handle GET all courses at  /api/courses', async () => {
        connectionStub.yields(null, [ 
        {courses_id: 1, course_name: 'Courses 1', fk_typology: 1 },
        {courses_id: 2, course_name: 'Courses 2', fk_typology: 2 },
        {courses_id: 3, course_name: 'Courses 3', fk_typology: 3 },]);
        const response = await request(app).get('/api/courses');
        expect(response.status).to.equal(200);
        expect(response.body).to.deep.equal([ 
        {courses_id: 1, course_name: 'Courses 1', fk_typology: 1 },
        {courses_id: 2, course_name: 'Courses 2', fk_typology: 2 },
        {courses_id: 3, course_name: 'Courses 3', fk_typology: 3 },]);
      });
      it('should handle single course GET by id /api/courses/:course_id', async () => {
        connectionStub.yields(null, [    
             {courses_id: 2, course_name: 'Courses 2', fk_typology: 2 },]);  
        const response = await request(app).get('/api/courses/2');
        expect(response.status).to.equal(200);
        expect(response.body).to.deep.equal([
            {courses_id: 2, course_name: 'Courses 2', fk_typology: 2 },
        ]);
      });
      it('should handle GET all courses sort by typology id at api/courses/typology/:fk_typology', async () => {
        connectionStub.yields(null, [
            {
                "courses_id": 16,
                "course_name": "oooaaaa",
                "fk_typology": 6
            },
            {
                "courses_id": 21,
                "course_name": "ciao",
                "fk_typology": 6
            }
        ]);  
        const response = await request(app).get('/api/courses/typology/6');
        expect(response.status).to.equal(200);
        expect(response.body).to.deep.equal([
            {
                "courses_id": 16,
                "course_name": "oooaaaa",
                "fk_typology": 6
            },
            {
                "courses_id": 21,
                "course_name": "ciao",
                "fk_typology": 6
            }
        ]);
      });
      it('should handle  POST to add new course giving name & typology id  at /api/courses/:course_name/:fk_typology', async () => {
        const course_name = 'New Course';
        const fk_typology= 1
        connectionStub.yields(null, { insertId: 1 });
    
        const response = await request(app)
          .post(`/api/courses/${course_name}/${fk_typology}`)
          .send();
        expect(response.status).to.equal(200);
        expect(response.body.message).to.equal(`Corso inserito con successo : ${course_name}`);
      });
    
      it('should handle DELETE /api/courses/:course_id', async () => {
        const course_id = 1;
        const course_name = 'Existing Course';
        connectionStub.onFirstCall().yields(null, [{ course_name }]);
        connectionStub.onSecondCall().yields(null, {});
    
        const response = await request(app).delete(`/api/courses/${course_id}`);
    
        expect(response.status).to.equal(200);
        expect(response.body.message).to.equal(`Corso n° ${course_id} cancellato con successo!`);
      });
    
      it('should handle PUT /api/courses/:courses_id', async () => {
        const courses_id = 1;
        const new_course_name = 'New Name';
        connectionStub.onFirstCall().yields(null, [{ courses_id }]);
        connectionStub.onSecondCall().yields(null, {});
        const response = await request(app)
          .put(`/api/courses/${courses_id}`)
          .query({ new_name: new_course_name });
        expect(response.status).to.equal(200);
        expect(response.body.message).to.equal(`Corso con ID ${courses_id} modificato con successo.`);
      });
})  