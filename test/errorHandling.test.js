const request = require('supertest');
const { expect } = require('chai');
const express = require('express');
const { sendErrorByStatusCode } = require('../function/errorHandling');

describe('sendErrorByStatusCode', () => {
  let app;

  beforeEach(() => {
    app = express();
  });

  it('should respond with the correct error message and status code', async () => {
    const errorMessage = 'Richiesta non valida';
    const statusCode = 400;

    app.use((req, res) => {
      sendErrorByStatusCode(res, statusCode);
    });

    const response = await request(app).get('/');

    expect(response.status).to.equal(statusCode);
    expect(response.body).to.deep.equal({ error: errorMessage, message: '' });
  });

  it('should respond with a custom error message if provided', async () => {
    const customMessage = 'Errore nel server';
    const statusCode = 500;

    app.use((req, res) => {
      sendErrorByStatusCode(res, statusCode, customMessage);
    });

    const response = await request(app).get('/');

    expect(response.status).to.equal(statusCode);
    expect(response.body).to.deep.equal({ error: 'Errore nel server', message: customMessage });
  });

  it('should respond with a default error message for unknown status codes', async () => {
    const unknownStatusCode = 999;

    app.use((req, res) => {
      sendErrorByStatusCode(res, unknownStatusCode);
    });

    const response = await request(app).get('/');

    expect(response.status).to.equal(unknownStatusCode);
    expect(response.body).to.deep.equal({ error: 'Errore sconosciuto', message: '' });
  });
});
