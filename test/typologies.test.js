const sinon = require('sinon');
const express = require('express');
const request = require('supertest');
const { expect } = require('chai'); // Importa la funzione expect da chai
const typologiesRouter = require('../models/typologies/typologies'); // Assicurati di impostare il percorso corretto
const connection = require('../server/server.js');

describe('Typologies Router', () => {
  let connectionStub; // Dichiarazione del mock di connessione
  let app;

  beforeEach(() => {
    connectionStub = sinon.stub(connection, 'query'); // Usa sinon.stub su connection.query direttamente
    app = express();
    app.use('/api/typology', typologiesRouter);
  });

  afterEach(() => {
    connectionStub.restore(); // Ripristina lo stato originale del mock di connessione
  });

  it('should handle GET /api/typology', async () => {
    // Configura il comportamento desiderato per la query
    connectionStub.yields(null, [{ id: 1, name: 'Typology 1' }]);

    const response = await request(app).get('/api/typology');

    expect(response.status).to.equal(200);
    expect(response.body).to.deep.equal([{ id: 1, name: 'Typology 1' }]);
  });

  it('should handle GET /api/typology/:typology_id', async () => {
    // Configura il comportamento desiderato per la query
    connectionStub.yields(null, [{ id: 2, name: 'Typology 2' }]);

    const response = await request(app).get('/api/typology/2');

    expect(response.status).to.equal(200);
    expect(response.body).to.deep.equal([{ id: 2, name: 'Typology 2' }]);
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
