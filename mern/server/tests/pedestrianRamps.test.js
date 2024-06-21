import { describe, it, expect, jest, beforeAll, afterAll } from '@jest/globals';
import express from 'express';
import request from 'supertest';
import router from '../routes/pedestrianRamps.js';
import cityofNY from '../services/cityofNY.js';

const app = express();
app.use('/', router);

describe('GET /pedestrianRamps', () => {
  const dummyRamps = [
    {'latitude':40.7467994372694,'longitude':-73.9883520547057,'width':'40.8'},
    {'latitude':40.77621584906011,'longitude':-73.964196820598,'width':'49.2'}
  ];

  beforeAll(() => {
    jest.mock('../services/cityofNY.js');
  });

  it('should return 200 and result if external API call succeeds', async () => {
    jest.spyOn(cityofNY, 'getPedestrianRamps').mockResolvedValue(dummyRamps);

    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.body).toEqual(dummyRamps);
  });

  it('should return 500 if external API call fails', async () => {
    jest.spyOn(cityofNY, 'getPedestrianRamps').mockImplementation(() => {
      throw new Error('Exteral API error');
    });
    
    const response = await request(app).get('/');
    expect(response.status).toBe(500);
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });
});