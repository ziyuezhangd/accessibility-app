import { describe, it, expect, jest, beforeEach, afterAll } from '@jest/globals';
import express from 'express';
import request from 'supertest';
import cityofNY from '../apis/cityofNY.js';
import router from '../routes/publicRestrooms.js';

const app = express();
app.use('/', router);

jest.mock('../apis/cityofNY.js');

const dummyRestrooms = [
  {
    'name':'Restroom 1',
    'status':'Not Operational',
    'hours':'8am-4pm',
    'isAccessible':true,
    'isFullyAccessible':true,
    'isPartiallyAccessible':true,
    'hasChangingStations':true,
    'latitude':'40.715899',
    'longitude':'-73.975189'
  },
  {
    'name':'Restroom 2',
    'status':'Operational',
    'hours':'8am-4pm',
    'isAccessible':false,
    'isFullyAccessible':false,
    'isPartiallyAccessible':false,
    'hasChangingStations':false,
    'latitude':'40.751662',
    'longitude':'-73.843252'
  }
];

describe('GET /publicRestrooms', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 200 and full-only accessible restrooms', async () => {
    jest.spyOn(cityofNY, 'getAccessibleRestrooms').mockResolvedValue(dummyRestrooms);
    jest.spyOn(cityofNY, 'getPublicRestrooms');

    const response = await request(app).get('?accessibility=full-only');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(dummyRestrooms);
    expect(cityofNY.getAccessibleRestrooms).toHaveBeenCalledWith(false);
    expect(cityofNY.getPublicRestrooms).toHaveBeenCalledTimes(0);
  });

  it('should return 200 and incl-partial accessible restrooms', async () => {
    jest.spyOn(cityofNY, 'getAccessibleRestrooms').mockResolvedValue(dummyRestrooms);

    const response = await request(app).get('?accessibility=incl-partial');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(dummyRestrooms);
    expect(cityofNY.getAccessibleRestrooms).toHaveBeenCalledWith(true);
    expect(cityofNY.getPublicRestrooms).toHaveBeenCalledTimes(0);
  });

  it('should return 200 and all public restrooms', async () => {
    jest.spyOn(cityofNY, 'getPublicRestrooms').mockResolvedValue(dummyRestrooms);

    const response = await request(app).get('?accessibility=all');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(dummyRestrooms);
    expect(cityofNY.getPublicRestrooms).toHaveBeenCalledTimes(1);
    expect(cityofNY.getAccessibleRestrooms).toHaveBeenCalledTimes(0);
  });
  it('should return 500 if external API call fails', async () => {
    jest.spyOn(cityofNY, 'getAccessibleRestrooms').mockImplementation(() => {
      throw new Error('Exteral API error');
    });
    jest.spyOn(cityofNY, 'getPublicRestrooms').mockImplementation(() => {
      throw new Error('Exteral API error');
    });
    
    const response1 = await request(app).get('?accessibility=full-only');
    expect(response1.status).toBe(500);
    const response2 = await request(app).get('?accessibility=incl-partial');
    expect(response2.status).toBe(500);
    const response3 = await request(app).get('?accessibility=all');
    expect(response3.status).toBe(500);
  });
});