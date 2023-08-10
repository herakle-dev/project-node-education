const sinon = require('sinon');
const express = require('express');
const request = require('supertest');
const { expect } = require('chai'); 
const typologiesRouter = require('../models/typologies/typologies'); 
const connection = require('../server/server.js');

describe('Typologies Router', () => {
  let connectionStub; 
  let app;

  beforeEach(() => {
    connectionStub = sinon.stub(connection, 'query'); 
    app = express();
    app.use('/api/typology', typologiesRouter);
  });

  afterEach(() => {
    connectionStub.restore(); 
  });

  it('should handle GET /api/typology', async () => {
    connectionStub.yields(null, [
      { typology_id: 1, typology_name: 'Typology 1' },
      { typology_id: 2, typology_name: 'Typology 2' },
      { typology_id: 3, typology_name: 'Typology 3' }]);

    const response = await request(app).get('/api/typology');

    expect(response.status).to.equal(200);
    expect(response.body).to.deep.equal([  
      { typology_id: 1, typology_name: 'Typology 1' },
    { typology_id: 2, typology_name: 'Typology 2' },
    { typology_id: 3, typology_name: 'Typology 3' }]);
  });

  it('should handle single typology GET by id /api/typology/:typology_id', async () => {
    connectionStub.yields(null, [{ typology_id: 2, typology_name: 'Typology 2' }]);

    const response = await request(app).get('/api/typology/2');

    expect(response.status).to.equal(200);
    expect(response.body).to.deep.equal([{ typology_id: 2, typology_name: 'Typology 2' }]);
  });
  it('should handle POST /api/typology/:typology_name', async () => {
    const typology_name = 'New Typology';
    connectionStub.yields(null, { insertId: 1 });

    const response = await request(app)
      .post(`/api/typology/${typology_name}`)
      .send();

    expect(response.status).to.equal(200);
    expect(response.body.message).to.equal(`Tipologia aggiunta correttamente: ${typology_name}`);
  });

  it('should handle DELETE /api/typology/:typology_id', async () => {
    const typology_id = 1;
    const typology_name = 'Existing Typology';
    connectionStub.onFirstCall().yields(null, [{ typology_name }]);
    connectionStub.onSecondCall().yields(null, {});

    const response = await request(app).delete(`/api/typology/${typology_id}`);

    expect(response.status).to.equal(200);
    expect(response.body.message).to.equal(`Tipologia eliminata correttamente: ${typology_name}`);
  });

  it('should handle PUT /api/typology/:typology_id', async () => {
    const typology_id = 1;
    const new_typology_name = 'New Name';
    connectionStub.onFirstCall().yields(null, [{ typology_id }]);
    connectionStub.onSecondCall().yields(null, {});

    const response = await request(app)
      .put(`/api/typology/${typology_id}`)
      .query({ new_name: new_typology_name });
    expect(response.status).to.equal(200);
    expect(response.body.message).to.equal(`Tipologia modificata con successo: ${new_typology_name}`);
  });
});
