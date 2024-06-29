import { describe, it, expect, jest, afterEach } from '@jest/globals';
import express from 'express';
import request from 'supertest';
import dbHandler from '../db/dbHandler.js';
import router from '../routes/odourRating.js';

const app = express();
app.use('/', router);

jest.mock('../db/dbHandler.js');

const testDateTime = '2024-06-18T12:34:56.000Z';
const testLat = 40.7646;
const testLong = -73.9990;

describe('GET', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('/odourRating', () => {
    it('should return 200 and prediction if model is retrieved and no error occurs', async () => {
      const dummyPredictions = [{ _id: '1', rating: 'A' }, { _id: '2', rating: 'C' }];
      const mockLatestModel = {
        predict: jest.fn().mockReturnValue(dummyPredictions),
      };
      dbHandler.getLatestModel = jest.fn().mockResolvedValue(mockLatestModel);
  
      const response = await request(app).get(`?datetime=${testDateTime}`);
      expect(response.status).toBe(200);
      expect(response.body).toEqual(dummyPredictions);
      expect(dbHandler.getLatestModel).toHaveBeenCalledWith('odourModel');
      expect(mockLatestModel.predict).toHaveBeenCalledWith(new Date(testDateTime));
    });
  
    it('should return 500 if database error occurs', async () => {
      dbHandler.getLatestModel = jest.fn().mockImplementation(() => {
        throw new Error('Database error');
      });
  
      const response = await request(app).get(`?datetime=${testDateTime}`);
      expect(response.status).toBe(500);
    });
  
    it('should return 400 if a datetime parameter is not provided', async () => {
      const response = await request(app).get('/');
      expect(response.status).toBe(400);
    });
  });
  
  describe('/odourRating/location', () => {
    it('should return 200 and prediction if model is retrieved', async () => {
      const dummyPrediction = { rating: 'A' };
      const mockLatestModel = {
        predict: jest.fn().mockReturnValue(dummyPrediction),
      };
      dbHandler.getLatestModel = jest.fn().mockResolvedValue(mockLatestModel);
  
      const response = await request(app).get(`/location?datetime=${testDateTime}&lat=${testLat}&long=${testLong}`);
      expect(response.status).toBe(200);
      expect(response.body).toEqual(dummyPrediction);
      expect(dbHandler.getLatestModel).toHaveBeenCalledWith('odourModel');
      expect(mockLatestModel.predict).toHaveBeenCalledWith(new Date(testDateTime), testLat, testLong);
    });
  
    it('should return 500 if database error occurs', async () => {
      dbHandler.getLatestModel = jest.fn().mockImplementation(() => {
        throw new Error('Database error');
      });
  
      const response = await request(app).get(`/location?datetime=${testDateTime}&lat=${testLat}&long=${testLong}`);
      expect(response.status).toBe(500);
    });
  
    it('should return 400 if any of datetime/lat/long parameter is not provided', async () => {
      const response1 = await request(app).get(`/location?lat=${testLat}&long=${testLong}`);
      expect(response1.status).toBe(400);
      const response2 = await request(app).get(`/location?datetime=${testDateTime}&lat=${testLat}`);
      expect(response2.status).toBe(400);
      const response3 = await request(app).get(`/location?datetime=${testDateTime}&long=${testLong}`);
      expect(response3.status).toBe(400);
      const response4 = await request(app).get(`/location?datetime=${testDateTime}`);
      expect(response4.status).toBe(400);
      const response5 = await request(app).get(`/location?lat=${testLat}`);
      expect(response5.status).toBe(400);
      const response6 = await request(app).get(`/location?long=${testLong}`);
      expect(response6.status).toBe(400);
    });
  });
});