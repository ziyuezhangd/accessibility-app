import { describe, it, expect, jest, beforeAll, afterAll } from '@jest/globals';
import express from 'express';
import request from 'supertest';
import cityofNY from '../apis/cityofNY.js';
import router from '../routes/seatingAreas.js';

const app = express();
app.use('/', router);

describe('GET /seatingAreas', () => {
  const dummySeatings = [
    {'seatType':'LEANING BAR','category':'SBS','latitude':'40.744235','longitude':'-73.973042'},
    {'seatType':'BACKED 1.0','category':'Municipal Facilities','latitude':'40.802362','longitude':'-73.948246'}
  ];

  beforeAll(() => {
    jest.mock('../apis/cityofNY.js');
  });

  it('should return 200 and result if external API call succeeds', async () => {
    jest.spyOn(cityofNY, 'getSeatingAreas').mockResolvedValue(dummySeatings);

    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.body).toEqual(dummySeatings);
  });

  it('should return 500 if external API call fails', async () => {
    jest.spyOn(cityofNY, 'getSeatingAreas').mockImplementation(() => {
      throw new Error('Exteral API error');
    });
    
    const response = await request(app).get('/');
    expect(response.status).toBe(500);
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });
});