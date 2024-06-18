import request from 'supertest';
import express from 'express';
import router from '../routes/accessibilityHighlightPlace.js';
import db from '../db/connection.js';
import { describe, it, expect, jest, afterAll } from '@jest/globals';

const app = express();
app.use('/', router);

describe('GET /accessibilityHighlightPlace', () => {
  
  it('should return 200 and result if documents are retrieved', async () => {
    const dummyResults = [{ _id: '1', name: 'Place 1' }, { _id: '2', name: 'Place 2' }];
    const mockCollection = {
      find: jest.fn().mockReturnThis(),
      toArray: jest.fn().mockResolvedValue(dummyResults),
    };
    jest.spyOn(db, 'collection').mockReturnValue(mockCollection);
    // db.collection = mockCollection;
    
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
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