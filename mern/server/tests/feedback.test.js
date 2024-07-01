import { describe, it, expect, jest, beforeAll, afterAll } from '@jest/globals';
import express from 'express';
import request from 'supertest';
import db from '../db/connection.js';
import router from '../routes/feedback.js';

const app = express();
app.use(express.json());
app.use('/', router);

describe('POST /feedback', () => {
  const dummyFeedback = {
    name: 'Kate',
    email: 'kate@gmail.com',
    comment: 'This is test feedback.',
    coordinates: [-73.9712, 40.7831],
  };

  beforeAll(() => {
    jest.mock('../db/connection.js');
  });

  it('with coordinates should return 201 if feedback is inserted and no error occurs', async () => {
    const mockCollection = {
      insertOne: jest.fn(),
    };
    jest.spyOn(db, 'collection').mockReturnValue(mockCollection);

    const response = await request(app).post('/').send(dummyFeedback);
    expect(response.status).toBe(201);
    expect(mockCollection.insertOne).toHaveBeenCalledTimes(1);
    expect(mockCollection.insertOne).toHaveBeenCalledWith({
      ...dummyFeedback,
      date: expect.any(Date),
    });
  });

  it('without coordinates should return 201 if feedback is inserted and no error occurs', async () => {
    const { coordinates, ...feedbackWithoutCoordinates} = dummyFeedback;
    const mockCollection = {
      insertOne: jest.fn(),
    };
    jest.spyOn(db, 'collection').mockReturnValue(mockCollection);

    const response = await request(app).post('/').send(feedbackWithoutCoordinates);
    expect(response.status).toBe(201);
    expect(mockCollection.insertOne).toHaveBeenCalledTimes(1);
    expect(mockCollection.insertOne).toHaveBeenCalledWith({
      ...feedbackWithoutCoordinates,
      date: expect.any(Date),
    });
  });

  it('should return 400 if any of name/email/comment parameter is not provided', async () => {
    const { comment, ...feedbackWithoutComment } = dummyFeedback;
    const response1 = await request(app).post('/').send(feedbackWithoutComment);
    expect(response1.status).toBe(400);

    const { name, ...feedbackWithoutName } = dummyFeedback;
    const response2 = await request(app).post('/').send(feedbackWithoutName);
    expect(response2.status).toBe(400);

    const { email, ...feedbackWithoutEmail } = dummyFeedback;
    const response3 = await request(app).post('/').send(feedbackWithoutEmail);
    expect(response3.status).toBe(400);
  });

  it('should return 500 if database error occurs', async () => {
    jest.spyOn(db, 'collection').mockImplementation(() => {
      throw new Error('Database error');
    });

    const response = await request(app).post('/').send(dummyFeedback);
    expect(response.status).toBe(500);
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });
});