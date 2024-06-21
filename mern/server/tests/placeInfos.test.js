import { describe, it, expect, jest, beforeAll, afterAll } from '@jest/globals';
import express from 'express';
import request from 'supertest';
import router from '../routes/placeInfos.js';
import accessibilityCloud from '../services/accessibilityCloud.js';

const app = express();
app.use('/', router);

describe('GET', () => {
  const dummyPlaces = [
    {'category':'police','name':'New York City Police Headquarters','latitude':40.7119414,'longitude':-74.0020911},
    {'category':'library','name':'Chatham Square Library','latitude':40.7133126,'longitude':-73.9963202}
  ];
  const dummyCategories = ['airport','biergarten','books'];

  beforeAll(() => {
    jest.mock('../services/accessibilityCloud.js');
  });

  describe('/placeInfo', () => {
    it('should return 200 and result if external API call succeeds', async () => {
      jest.spyOn(accessibilityCloud, 'getPlaceInfos').mockResolvedValue(dummyPlaces);

      const response = await request(app).get('/');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(dummyPlaces);
    });
    it('should return 500 if external API call fails', async () => {
      jest.spyOn(accessibilityCloud, 'getPlaceInfos').mockImplementation(() => {
        throw new Error('Exteral API error');
      });
      
      const response = await request(app).get('/');
      expect(response.status).toBe(500);
    });
  });

  describe('/placeInfo/categories', () => {
    it('should return 200 and result if external API call succeeds', async () => {
      jest.spyOn(accessibilityCloud, 'getCategories').mockResolvedValue(dummyCategories);

      const response = await request(app).get('/categories');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(dummyCategories);
    });
    it('should return 500 if external API call fails', async () => {
      jest.spyOn(accessibilityCloud, 'getCategories').mockImplementation(() => {
        throw new Error('Exteral API error');
      });

      const response = await request(app).get('/categories');
      expect(response.status).toBe(500);
    });
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });
});