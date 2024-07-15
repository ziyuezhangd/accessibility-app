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
      { segment_id: '0018123', prediction: 1 },
      { segment_id: '0018148', prediction: 3 },
    ]));

    const datetime = '2024-07-01T14:30:00';
    const predictions = await ml.getNoisePredictionsDaily(datetime);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith('http://127.0.0.1:5000/noise-ratings/daily?hour=14&dayOfWeek=0');
    expect(predictions).toEqual([
      { 
        location: {
          'start': {'lat': 40.706174448019596, 'lng': -74.01793044362333}, 
          'end': {'lat': 40.70683944743645, 'lng': -74.01757419963172}
        }, 
        prediction: 1 
      },
      { 
        location: {
          'start': {'lat': 40.708456986731186, 'lng': -74.0173977906187}, 
          'end': {'lat': 40.70879474369141, 'lng': -74.01814829015251}
        }, 
        prediction: 3 
      },
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

    await expect(ml.getNoisePredictionsDaily(datetime)).rejects.toThrow(Error);
  });
});

describe('getBusynessPredictions', () => {
  beforeEach(() => {
    fetch.resetMocks();
    jest.clearAllMocks();
  });

  it('should return predictions with lat/lng', async () => {
    fetch.mockResponseOnce(JSON.stringify([
      { segment_id: '0018123', prediction: 'B' },
      { segment_id: '0018148', prediction: 'F' },
    ]));

    const datetime = '2024-07-01T14:30:00';
    const predictions = await ml.getBusynessPredictions(datetime);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith('http://127.0.0.1:5000/busyness-ratings?month=7&day=1&hour=14&dayOfWeek=0');
    expect(predictions).toEqual([
      { 
        location: {
          'start': {'lat': 40.706174448019596, 'lng': -74.01793044362333}, 
          'end': {'lat': 40.70683944743645, 'lng': -74.01757419963172}
        }, 
        prediction: 'B' 
      },
      { 
        location: {
          'start': {'lat': 40.708456986731186, 'lng': -74.0173977906187}, 
          'end': {'lat': 40.70879474369141, 'lng': -74.01814829015251}
        }, 
        prediction: 'F' 
      },
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
      { MODZCTA: '10001', prediction: 'D' },
      { MODZCTA: '10002', prediction: 'A' },
    ]));

    const datetime = '2024-07-01T14:30:00';
    const predictions = await ml.getOdourPredictions(datetime);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith('http://127.0.0.1:5000/odour-ratings?month=7&day=1&hour=14');
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