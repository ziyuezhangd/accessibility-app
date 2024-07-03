import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import fetchMock from 'jest-fetch-mock';
import ml from '../apis/ml.js';

fetchMock.enableMocks();

describe('getNoisePredictions', () => {
  beforeEach(() => {
    fetch.resetMocks();
    jest.clearAllMocks();
  });

  it('should return predictions with lat/lng', async () => {
    fetch.mockResponseOnce(JSON.stringify([
      { segment_id: '0018067', prediction: 1 },
      { segment_id: '0018123', prediction: 3 },
    ]));

    const datetime = '2024-07-01T14:30:00';
    const predictions = await ml.getNoisePredictions(datetime);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith('/flask-api/noise-ratings?hour=14');
    expect(predictions).toEqual([
      { location: { lat: 40.70691998879576, lng: -74.01869812608821 }, prediction: 1 },
      { location: { lat: 40.70651443884558, lng: -74.01777528922824 }, prediction: 3 },
    ]);
  });

  it('should throw an error if fetch fails', async () => {
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        statusText: 'Model prediction error',
      })
    );

    const datetime = '2024-07-01T14:30:00';

    await expect(ml.getNoisePredictions(datetime)).rejects.toThrow(Error);
  });
});

describe('getBusynessPredictions', () => {
  beforeEach(() => {
    fetch.resetMocks();
    jest.clearAllMocks();
  });

  it('should return predictions with lat/lng', async () => {
    fetch.mockResponseOnce(JSON.stringify([
      { segment_id: '0018067', prediction: 'B' },
      { segment_id: '0018123', prediction: 'F' },
    ]));

    const datetime = '2024-07-01T14:30:00';
    const predictions = await ml.getBusynessPredictions(datetime);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith('/flask-api/busyness-ratings?month=7&day=1&hour=14&dayOfWeek=1');
    expect(predictions).toEqual([
      { location: { lat: 40.70691998879576, lng: -74.01869812608821 }, prediction: 'B' },
      { location: { lat: 40.70651443884558, lng: -74.01777528922824 }, prediction: 'F' },
    ]);
  });

  it('should throw an error if fetch fails', async () => {
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        statusText: 'Model prediction error',
      })
    );

    const datetime = '2024-07-01T14:30:00';

    await expect(ml.getBusynessPredictions(datetime)).rejects.toThrow(Error);
  });
});

describe('getOdourPredictions', () => {
  beforeEach(() => {
    fetch.resetMocks();
    jest.clearAllMocks();
  });

  it('should return predictions with lat/lng', async () => {
    fetch.mockResponseOnce(JSON.stringify([
      { modzcta: '10001', prediction: 'D' },
      { modzcta: '10002', prediction: 'A' },
    ]));

    const datetime = '2024-07-01T14:30:00';
    const predictions = await ml.getOdourPredictions(datetime);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith('/flask-api/odour-ratings?month=7&day=1&hour=14');
    expect(predictions).toEqual([
      { location: { lat: 40.75068819675726, lng: -73.99713787189704 }, prediction: 'D' },
      { location: { lat: 40.71578031863019, lng: -73.98617431136368 }, prediction: 'A' },
    ]);
  });

  it('should throw an error if fetch fails', async () => {
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        statusText: 'Model prediction error',
      })
    );

    const datetime = '2024-07-01T14:30:00';

    await expect(ml.getOdourPredictions(datetime)).rejects.toThrow(Error);
  });
});