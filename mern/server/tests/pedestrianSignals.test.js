import { describe, it, expect, jest, beforeAll, afterAll } from '@jest/globals';
import express from 'express';
import request from 'supertest';
import cityofNY from '../apis/cityofNY.js';
import router from '../routes/pedestrianSignals.js';

const app = express();
app.use('/', router);

describe('GET /pedestrianSignals', () => {
  const dummySignals = [{'latitude':'40.712731','longitude':'-73.988491'},{'latitude':'40.782928','longitude':'-73.943914'}];

  beforeAll(() => {
    jest.mock('../apis/cityofNY.js');
  });

  it('should return 200 and result if external API call succeeds', async () => {
    jest.spyOn(cityofNY, 'getPedestrianSignals').mockResolvedValue(dummySignals);

    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.body).toEqual(dummySignals);
  });

  it('should return 500 if external API call fails', async () => {
    jest.spyOn(cityofNY, 'getPedestrianSignals').mockImplementation(() => {
      throw new Error('Exteral API error');
    });
    
    const response = await request(app).get('/');
    expect(response.status).toBe(500);
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });
});