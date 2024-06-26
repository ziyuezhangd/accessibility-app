import { describe, it, expect, jest, afterEach } from '@jest/globals';
import express from 'express';
import request from 'supertest';
import dbHandler from '../db/dbHandler.js';
import router from '../routes/accessibilityHighlightPlace.js';

const app = express();
app.use('/', router);

jest.mock('../db/dbHandler.js');

describe('GET /accessibilityHighlightPlace', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  
  it('should return 200 and result if documents are retrieved and no error occurs', async () => {
    const dummyResults = [{ _id: '1', name: 'Place 1' }, { _id: '2', name: 'Place 2' }];
    dbHandler.getAccessibilityHighlightPlaces = jest.fn().mockResolvedValue(dummyResults);

    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.body).toEqual(dummyResults);
    expect(dbHandler.getAccessibilityHighlightPlaces).toHaveBeenCalledTimes(1);
  });

  it('should return 500 if database error occurs', async () => {
    dbHandler.getAccessibilityHighlightPlaces = jest.fn().mockImplementation(() => {
      throw new Error('Database error');
    });
    const response = await request(app).get('/');
    expect(response.status).toBe(500);
  });
});