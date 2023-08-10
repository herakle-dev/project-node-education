const request = require('supertest');
const { expect } = require('chai');
const express = require('express');
const idCheck = require('../middleware/idCheckAsNum');

describe('idCheck Middleware', () => {
  let app;

  beforeEach(() => {
    app = express();
  });

  it('should respond with an error if the parameter is missing', async () => {
    app.use('/api/:idParam', idCheck('idParam'), (req, res) => {
      res.send('Success');
    });

    const response = await request(app).get('/api/');
    
    expect(response.body).to.deep.equal({});
  });

  it('should respond with an error if the parameter is not a number', async () => {
    app.use('/api/:idParam', idCheck('idParam'), (req, res) => {
      res.send('Success');
    });

    const response = await request(app).get('/api/:abc');
    expect(response.body).to.deep.equal({ error: 'Parametro idParam deve essere un numero' });
  });

  it('should call the next middleware if the parameter is valid', async () => {
    app.use('/api/:idParam', idCheck('idParam'), (req, res) => {
      res.send('Success');
    });

    const response = await request(app).get('/api/123');
    
    expect(response.status).to.equal(200);
    expect(response.text).to.equal('Success');
  });
});
