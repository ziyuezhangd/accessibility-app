import { describe, it, expect, jest, beforeAll, afterAll } from '@jest/globals';
import express from 'express';
import request from 'supertest';
import db from '../db/connection.js';
import router from '../routes/noiseRating.js';

const app = express();
app.use('/', router);

describe('GET', () => {
  beforeAll(() => {
    jest.mock('../db/connection.js');
  });
  
  describe('/noiseRating', () => {
    // This test requires knowledge of how data is retrieved.
    it('should return 200 and prediction if model is retrieved and no error occurs', async () => {
      const dummyPredictions = [{ _id: '1', rating: 'A' }, { _id: '2', rating: 'C' }];
      const mockLatestModel = {
        predict: jest.fn().mockReturnValue(dummyPredictions),
      };
      const mockCollection = {
        findOne: jest.fn().mockResolvedValue(mockLatestModel),
      };
      jest.spyOn(db, 'collection').mockReturnValue(mockCollection);
  
      const response = await request(app).get('?datetime=2024-06-18T12:34:56Z');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(dummyPredictions);
    });
  
    it('should return 500 if database error occurs', async () => {
      jest.spyOn(db, 'collection').mockImplementation(() => {
        throw new Error('Database error');
      });
  
      const response = await request(app).get('?datetime=2024-06-18T12:34:56Z');
      expect(response.status).toBe(500);
    });
  
    it('should return 400 if a datetime parameter is not provided', async () => {
      const response = await request(app).get('/');
      expect(response.status).toBe(400);
    });
  });
  
  describe('/noiseRating/location', () => {
    // This test requires knowledge of how data is retrieved.
    it('should return 200 and prediction if model is retrieved', async () => {
      const dummyPrediction = { rating: 'A' };
      const mockLatestModel = {
        predict: jest.fn().mockReturnValue(dummyPrediction),
      };
      const mockCollection = {
        findOne: jest.fn().mockResolvedValue(mockLatestModel),
      };
      jest.spyOn(db, 'collection').mockReturnValue(mockCollection);
  
      const response = await request(app).get('?datetime=2024-06-18T12:34:56Z&lat=40.7646&long=-73.9990');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(dummyPrediction);
    });
  
    it('should return 500 if database error occurs', async () => {
      jest.spyOn(db, 'collection').mockImplementation(() => {
        throw new Error('Database error');
      });
  
      const response = await request(app).get('/location?datetime=2024-06-18T12:34:56Z&lat=40.7646&long=-73.9990');
      expect(response.status).toBe(500);
    });
  
    it('should return 400 if any of datetime/lat/long parameter is not provided', async () => {
      const response1 = await request(app).get('/location?lat=40.7646&long=-73.9990');
      expect(response1.status).toBe(400);
      const response2 = await request(app).get('/location?datetime=2024-06-18T12:34:56Z&lat=40.7646');
      expect(response2.status).toBe(400);
      const response3 = await request(app).get('/location?datetime=2024-06-18T12:34:56Z&long=-73.9990');
      expect(response3.status).toBe(400);
      const response4 = await request(app).get('/location?datetime=2024-06-18T12:34:56Z');
      expect(response4.status).toBe(400);
      const response5 = await request(app).get('/location?lat=40.7646');
      expect(response5.status).toBe(400);
      const response6 = await request(app).get('/location?long=-73.9990');
      expect(response6.status).toBe(400);
    });
  });
  
  afterAll(() => {
    jest.restoreAllMocks();
  });
});