import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import express from 'express';
import request from 'supertest';
import ml from '../apis/ml.js';
import router from '../routes/odourRating.js';

const app = express();
app.use('/', router);

jest.mock('../apis/ml.js');

const testDateTime = '2024-06-18T12:34:56';

describe('GET /odourRating', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 200 and prediction if model is retrieved and no error occurs', async () => {
    const dummyPredictions = [
      { location: {lat: 40.71, lng: -74.00}, rating: 'A' }, 
      { location: {lat: 40.73, lng: -74.65}, rating: 'C' }
    ];
    ml.getOdourPredictions = jest.fn().mockResolvedValue(dummyPredictions);

    const response = await request(app).get(`?datetime=${testDateTime}`);
    expect(response.status).toBe(200);
    expect(response.body).toEqual(dummyPredictions);
    expect(ml.getOdourPredictions).toHaveBeenCalledWith(testDateTime);
  });

  it('should return 500 if database error occurs', async () => {
    ml.getOdourPredictions = jest.fn().mockImplementation(() => {
      throw new Error('API error');
    });

    const response = await request(app).get(`?datetime=${testDateTime}`);
    expect(response.status).toBe(500);
  });

  it('should return 400 if a datetime parameter is not provided', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(400);
  });

  it('should return 400 if the datetime parameter format is inconsistent', async () => {
    const response1 = await request(app).get('?datetime=2024-06-18T12:34:56.000');
    expect(response1.status).toBe(400);

    const response2 = await request(app).get('?datetime=2024-06-18T12:34:56Z');
    expect(response2.status).toBe(400);
  });
});