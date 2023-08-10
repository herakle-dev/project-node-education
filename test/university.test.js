const sinon = require('sinon');
const express = require('express');
const request = require('supertest');
const { expect } = require('chai'); 
const universityRouter = require('../models/university/university');
const connection = require('../server/server.js');


describe('University Router', () => {
    let connectionStub; 
    let app;
  
    beforeEach(() => {
      connectionStub = sinon.stub(connection, 'query'); 
      app = express();
      app.use('/api/university', universityRouter);
    });
  
    afterEach(() => {
      connectionStub.restore(); 
    });
    it('should handle GET /api/university', async () => {
        connectionStub.yields(null, [ 
        {	university_id: 1,university_name: "poli", university_city: "milano"},
        {	university_id: 2,university_name: "artistico", university_city: "roma"},
        {	university_id: 3,university_name: "informatico", university_city: "napoli"},

    ]);
        const response = await request(app).get('/api/university');
        expect(response.status).to.equal(200);
        expect(response.body).to.deep.equal([ 
            {	university_id: 1,university_name: "poli", university_city: "milano"},
        {	university_id: 2,university_name: "artistico", university_city: "roma"},
        {	university_id: 3,university_name: "informatico", university_city: "napoli"},]);
      });
      it('should handle single university GET /api/university/:university_id', async () => {
        connectionStub.yields(null, [    
            {	university_id: 2,university_name: "artistico", university_city: "roma"},
        ]);  
        const response = await request(app).get('/api/university/2');
        expect(response.status).to.equal(200);
        expect(response.body).to.deep.equal([
            {	university_id: 2,university_name: "artistico", university_city: "roma"},

        ]);
      });
      it('should handle POST /api/university/:university_city/:university_name', async () => {
        const university_name = 'New UNI name';
        const university_city= 'Torino'
        connectionStub.yields(null, { insertId: 1 });
    
        const response = await request(app)
          .post(`/api/university/${university_city}/${university_name}`)
          .send();

        expect(response.status).to.equal(200);
        expect(response.body.message).to.equal(`Hai aggiunto ${university_name} come università e come città: ${university_city}.`);
      });
    
      it('should handle PUT /api/university/:university_id', async () => {
        const university_id = 1;
        const new_university_name = 'New UNI Name';
        const new_university_city = 'Roma';
        
        connectionStub.onFirstCall().yields(null, [{ university_id }]);
        connectionStub.onSecondCall().yields(null, {});
        
        const response = await request(app)
          .put(`/api/university/${university_id}`)
          .query({ new_name: new_university_name, new_city: new_university_city });
          
        expect(response.status).to.equal(200);
        expect(response.body.message).to.equal(`Universita aggiornata correttamente con : ${new_university_name},${new_university_city}`);
      });
      
      it('should handle DELETE /api/university/:university_id', async () => {
        const university_id = 1;
        const university_name = 'Existing university';
      
        // Simula la risposta della prima chiamata al database
        connectionStub.onFirstCall().yields(null, [{ university_name }]);
        
        // Simula la risposta della seconda chiamata al database (DELETE)
        connectionStub.onSecondCall().yields(null, {});
      
        const response = await request(app).delete(`/api/university/${university_id}`);
      
        expect(response.status).to.equal(200);
        expect(response.body.message).to.equal(`Università eliminata correttamente: ${university_name}`);
      });
      
})  