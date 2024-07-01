import { describe, it, expect, jest, beforeAll, afterAll } from '@jest/globals';
import express from 'express';
import request from 'supertest';
import db from '../db/connection.js';
import router from '../routes/accessibilityHighlightPlace.js';

const app = express();
app.use('/', router);

describe('GET /accessibilityHighlightPlace', () => {
  beforeAll(() => {
    jest.mock('../db/connection.js');
  });
  
  it('should return 200 if no error occurs', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
  });

  // This test requires knowledge of how data is retrieved.
  it('should return result if documents are retrieved', async () => {
    const dummyResults = [{ _id: '1', name: 'Place 1' }, { _id: '2', name: 'Place 2' }];
    const mockCollection = {
      find: jest.fn().mockReturnThis(),
      toArray: jest.fn().mockResolvedValue(dummyResults),
    };
    jest.spyOn(db, 'collection').mockReturnValue(mockCollection);

    const response = await request(app).get('/');
    expect(response.body).toEqual(dummyResults);
  });

  it('should return 500 if database error occurs', async () => {
    jest.spyOn(db, 'collection').mockImplementation(() => {
      throw new Error('Database error');
    });
    const response = await request(app).get('/');
    expect(response.status).toBe(500);
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });
});