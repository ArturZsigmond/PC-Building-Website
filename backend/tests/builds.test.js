const request = require('supertest');
const express = require('express');
const buildsRouter = require('../builds');

const app = express();
app.use(express.json());
app.use('/api/builds', buildsRouter);

describe('Builds API', () => {
  it('should return an empty array initially', async () => {
    const res = await request(app).get('/api/builds');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('should create a new build', async () => {
    const newBuild = {
      cpu: 'Intel',
      ram: '16GB',
      gpu: 'RTX 5080',
      case: 'case1.jpg',
      price: 2500,
    };

    const res = await request(app).post('/api/builds').send(newBuild);
    expect(res.statusCode).toBe(201);
    expect(res.body).toMatchObject(newBuild);
  });
});

it('should filter builds by CPU', async () => {
    await request(app).post('/api/builds').send({
      cpu: 'AMD', ram: '16GB', gpu: 'RTX 5080', case: 'case1.jpg', price: 2000
    });
  
    const res = await request(app).get('/api/builds?cpu=AMD');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0].cpu).toBe('AMD');
  });
  

  it('should update a build', async () => {
    const updated = {
      cpu: 'Intel', ram: '32GB', gpu: 'GTX 690', case: 'case2.jpg', price: 1800
    };
  
    const res = await request(app).put('/api/builds/0').send(updated);
    expect(res.statusCode).toBe(200);
    expect(res.body.cpu).toBe('Intel');
  });
  
  it('should delete a build', async () => {
    const res = await request(app).delete('/api/builds/0');
    expect(res.statusCode).toBe(200);
  });
  

  it('should return GPU stats', async () => {
    const res = await request(app).get('/api/builds/stats');
    expect(res.statusCode).toBe(200);
    expect(res.body).toBeInstanceOf(Object);
  });
  