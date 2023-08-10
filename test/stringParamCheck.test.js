const request = require('supertest');
const { expect } = require('chai');
const express = require('express');
const checkString = require('../middleware/stringParamCheck');

describe('checkString Middleware', () => {
  let app;

  beforeEach(() => {
    app = express();
  });

  it('should respond with an error if the parameter is missing', async () => {
    app.use('/api/:stringParam', checkString('stringParam'), (req, res) => {
      res.send('Success');
    });

    const response = await request(app).get('/api/');
    
    expect(response.body).to.deep.equal({});
  });

  it('should call the next middleware if the parameter is not empty', async () => {
    app.use('/api/:stringParam', checkString('stringParam'), (req, res) => {
      res.send('Success');
    });

    const response = await request(app).get('/api/someValue');
    
    expect(response.status).to.equal(200);
    expect(response.text).to.equal('Success');
  });
});
