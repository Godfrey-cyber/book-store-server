import requests from "superset";
import app from '../server';
// const { expect } = require('chai');

describe('GET /book/:id', () => {
  it('should return a product by ID', async () => {
    const response = await request(app).get('/book/60bdfdd8e404bc44e8a33f3a');
    expect(response.status).to.equal(200);
    expect(response.body).to.have.property('name');
    expect(response.body).to.have.property('price');
  });
});