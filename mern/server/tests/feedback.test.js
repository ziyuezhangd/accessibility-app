import { describe, it, expect, jest, afterEach } from '@jest/globals';
import express from 'express';
import request from 'supertest';
import dbHandler from '../db/dbHandler.js';
import router from '../routes/feedback.js';

const app = express();
app.use(express.json());
app.use('/', router);

jest.mock('../db/dbHandler.js');

const dummyFeedback = {
  name: 'Kate',
  email: 'kate@gmail.com',
  comment: 'This is test feedback.',
  coordinates: [-73.9712, 40.7831],
};

describe('POST /feedback', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  
  it('should return 201 if feedback is inserted and no error occurs', async () => {
    dbHandler.insertFeedback = jest.fn();

    const response = await request(app).post('/').send(dummyFeedback);
    expect(response.status).toBe(201);
    expect(dbHandler.insertFeedback).toHaveBeenCalledTimes(1);
    expect(dbHandler.insertFeedback).toHaveBeenCalledWith(expect.objectContaining({
      ...dummyFeedback,
      date: expect.any(Date),
    }));
  });

  it('without coordinates should return 500', async () => {
    const { coordinates, ...feedbackWithoutCoordinates} = dummyFeedback;
    jest.spyOn(dbHandler, 'insertFeedback');

    const response = await request(app).post('/').send(feedbackWithoutCoordinates);
    expect(response.status).toBe(500);
    expect(dbHandler.insertFeedback).toHaveBeenCalledTimes(0);
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
    jest.spyOn(dbHandler, 'insertFeedback').mockImplementation(() => {
      throw new Error('Database error');
    });

    const response = await request(app).post('/').send(dummyFeedback);
    expect(response.status).toBe(500);
  });
  
});