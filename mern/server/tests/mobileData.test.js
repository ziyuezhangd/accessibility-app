import { describe, it, expect, jest, afterEach } from '@jest/globals';
import express from 'express';
import request from 'supertest';
import dbHandler from '../db/dbHandler.js';
import router from '../routes/mobileData.js';

const app = express();
app.use(express.json());
app.use('/', router);

jest.mock('../db/dbHandler.js');

const dummyHealthData = {
  userId: 'aprilpolubiec',
  clinicalRecords: [
    {
      displayName: '', // Short name for the record
      id: '54D63F66-FB1E-4DF3-852F-6D8C4648CE81',
      startDate: '2021-07-01T15:11:09.041-0400',
      endDate: '2021-07-01T15:11:09.041-0400',
      sourceId: 'com.apple.public.health.clinical.B0734C79-CD39-D049-84F6-CBE9A5629AB8',
      fhirData: {}, // FHIR record for the requested data type
      fhirRelease: 'DSTU2', // HKFHIRRelease
      fhirVersion: '1.0.2', // HKFHIRVersion.stringRepresentation
    },
  ],
  bloodPressure: [
    {
      bloodPressureSystolicValue: 120,
      bloodPressureDiastolicValue: 81,
      startDate: '2016-06-29T17:55:00.000-0400',
      endDate: '2016-06-29T17:55:00.000-0400',
    },
    {
      bloodPressureSystolicValue: 119,
      bloodPressureDiastolicValue: 77,
      startDate: '2016-03-12T13:22:00.000-0400',
      endDate: '2016-03-12T13:22:00.000-0400',
    },
  ],
  heartRate: [
    {
      id: '5013eca7-4aee-45af-83c1-dbe3696b2e51', // The universally unique identifier (UUID) for this HealthKit object.
      value: 74.02,
      startDate: '2016-06-29T17:55:00.000-0400',
      endDate: '2016-06-29T17:55:00.000-0400',
      metadata: {
        HKWasUserEntered: false,
      },
    },
    {
      id: '4ea9e479-86e2-4e82-8030-86a9a9b8e569',
      value: 74,
      startDate: '2016-03-12T13:22:00.000-0400',
      endDate: '2016-03-12T13:22:00.000-0400',
      metadata: {
        HKWasUserEntered: false,
      },
    },
  ],
  audioLevel: [
    {
      value: 69.14085783652334,
      sourceId: 'com.apple.health',
      id: 'FACC239C-F822-4BF6-BEC5-F5AB03346497',
      sourceName: 'Source',
      startDate: '2021-07-12T20:09:00.699-0400',
      endDate: '2021-07-12T20:38:55.700-0400',
      metadata: {
        HKWasUserEntered: false,
      },
    },
    {
      value: 58.22141899831717,
      sourceId: 'com.apple.health',
      id: '64323F3B-EF8D-41EA-BA6E-7215DC4F9055',
      sourceName: 'Source',
      startDate: '2021-07-12T19:39:05.699-0400',
      endDate: '2021-07-12T20:09:00.699-0400',
      metadata: {
        HKWasUserEntered: false,
      },
    },
  ],
};

const dummyLocationData = {
  latitude: 40.7831,
  longitude: -73.9712,
  accuracy: 5,
  altitude: 5,
  audioLevel: 69.14085783652334,
  userId: 'aprilpolubiec',
  clinicalRecords: [
    {
      displayName: '', // Short name for the record
      id: '54D63F66-FB1E-4DF3-852F-6D8C4648CE81',
      startDate: '2021-07-01T15:11:09.041-0400',
      endDate: '2021-07-01T15:11:09.041-0400',
      sourceId: 'com.apple.public.health.clinical.B0734C79-CD39-D049-84F6-CBE9A5629AB8',
      fhirData: {}, // FHIR record for the requested data type
      fhirRelease: 'DSTU2', // HKFHIRRelease
      fhirVersion: '1.0.2', // HKFHIRVersion.stringRepresentation
    },
  ],
  heartRate: 74.02,
  bloodPressure: { systolic: 119, diastolic: 77 },
};

describe('POST /health-data', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 201 if health data is inserted and no error occurs', async () => {
    dbHandler.upsertUser = jest.fn();

    const response = await request(app).post('/').send(dummyHealthData);
    expect(response.status).toBe(201);
    expect(dbHandler.upsertUser).toHaveBeenCalledTimes(1);
    expect(dbHandler.upsertUser).toHaveBeenCalledWith(dummyHealthData);
  });

  it('without userid should return 400', async () => {
    const { userId, ...invalidHealthData } = dummyHealthData;
    jest.spyOn(dbHandler, 'upsertUser');

    const response = await request(app).post('/').send(invalidHealthData);
    expect(response.status).toBe(400);
    expect(dbHandler.upsertUser).toHaveBeenCalledTimes(0);
  });

  it('should return 500 if database error occurs', async () => {
    jest.spyOn(dbHandler, 'upsertUser').mockImplementation(() => {
      throw new Error('Database error');
    });

    const response = await request(app).post('/').send(dummyHealthData);
    expect(response.status).toBe(500);
  });
});

describe('POST /location-data', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 201 if location data is inserted and no error occurs', async () => {
    dbHandler.insertLocationData = jest.fn();

    const response = await request(app).post('/').send(dummyLocationData);
    expect(response.status).toBe(201);
    expect(dbHandler.insertLocationData).toHaveBeenCalledTimes(1);
    expect(dbHandler.insertLocationData).toHaveBeenCalledWith(dummyLocationData);
  });

  it('without latitude/longitude should return 400', async () => {
    const { latitude, longitude, ...invalidLocationData } = dummyLocationData;
    jest.spyOn(dbHandler, 'insertLocationData');

    const response = await request(app).post('/').send(invalidLocationData);
    expect(response.status).toBe(400);
    expect(dbHandler.insertLocationData).toHaveBeenCalledTimes(0);
  });

  it('should return 500 if database error occurs', async () => {
    jest.spyOn(dbHandler, 'insertLocationData').mockImplementation(() => {
      throw new Error('Database error');
    });

    const response = await request(app).post('/').send(dummyLocationData);
    expect(response.status).toBe(500);
  });
});
