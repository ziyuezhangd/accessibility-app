import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { getBusynessRatings, getNoiseRatingsHourly, getOdourRatings } from '../src/services/ratings.js';

const testDateTime = '2024-06-18T12:34:56';
const dummyRatings = [{ _id: '1', rating: 'A' }, { _id: '2', rating: 'C' }];

describe('Function getBusynessRatings', () => {
  beforeEach(() => {
    fetch.resetMocks();
    jest.clearAllMocks();
  });

  it('should fetch busyness ratings correctly', async () => {
    fetch.mockResponseOnce(JSON.stringify(dummyRatings));

    const ratings = await getBusynessRatings(testDateTime);

    expect(fetch).toHaveBeenCalledWith('/api/busyness-ratings?' + new URLSearchParams({ datetime: testDateTime }));
    expect(ratings).toEqual(dummyRatings);
  });

  it('should handle fetch error', async () => {
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        statusText: 'API error',
      })
    );
    jest.spyOn(console, 'error');
    
    const ratings = await getBusynessRatings(testDateTime);

    expect(fetch).toHaveBeenCalledWith('/api/busyness-ratings?' + new URLSearchParams({ datetime: testDateTime }));
    expect(ratings).toBeUndefined();
    expect(console.error).toHaveBeenCalledTimes(1);
  });

  it('should handle inconsistent datetime format', async () => {
    jest.spyOn(console, 'error');

    const ratings1 = await getBusynessRatings('?datetime=2024-06-18T12:34:56.000');
    expect(ratings1).toBeUndefined();

    const ratings2 = await getBusynessRatings('?datetime=2024-06-18T12:34:56Z');
    expect(ratings2).toBeUndefined();
    expect(fetch).toHaveBeenCalledTimes(0);
    expect(console.error).toHaveBeenCalledTimes(2);
  });
});

describe('Function getNoiseRatings', () => {
  beforeEach(() => {
    fetch.resetMocks();
    jest.clearAllMocks();
  });

  it('should fetch noise ratings correctly', async () => {
    fetch.mockResponseOnce(JSON.stringify(dummyRatings));

    const ratings = await getNoiseRatingsHourly(testDateTime);

    expect(fetch).toHaveBeenCalledWith('/api/noise-ratings?' + new URLSearchParams({ datetime: testDateTime }));
    expect(ratings).toEqual(dummyRatings);
  });

  it('should handle fetch error', async () => {
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        statusText: 'API error',
      })
    );
    jest.spyOn(console, 'error');
    
    const ratings = await getNoiseRatingsHourly(testDateTime);

    expect(fetch).toHaveBeenCalledWith('/api/noise-ratings?' + new URLSearchParams({ datetime: testDateTime }));
    expect(ratings).toBeUndefined();
    expect(console.error).toHaveBeenCalledTimes(1);
  });

  it('should handle inconsistent datetime format', async () => {
    jest.spyOn(console, 'error');

    const ratings1 = await getNoiseRatingsHourly('?datetime=2024-06-18T12:34:56.000');
    expect(ratings1).toBeUndefined();

    const ratings2 = await getNoiseRatingsHourly('?datetime=2024-06-18T12:34:56Z');
    expect(ratings2).toBeUndefined();
    expect(fetch).toHaveBeenCalledTimes(0);
    expect(console.error).toHaveBeenCalledTimes(2);
  });
});

describe('Function getOdourRatings', () => {
  beforeEach(() => {
    fetch.resetMocks();
    jest.clearAllMocks();
  });

  it('should fetch odour ratings correctly', async () => {
    fetch.mockResponseOnce(JSON.stringify(dummyRatings));

    const ratings = await getOdourRatings(testDateTime);

    expect(fetch).toHaveBeenCalledWith('/api/odour-ratings?' + new URLSearchParams({ datetime: testDateTime }));
    expect(ratings).toEqual(dummyRatings);
  });

  it('should handle fetch error', async () => {
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        statusText: 'API error',
      })
    );
    jest.spyOn(console, 'error');
    
    const ratings = await getOdourRatings(testDateTime);

    expect(fetch).toHaveBeenCalledWith('/api/odour-ratings?' + new URLSearchParams({ datetime: testDateTime }));
    expect(ratings).toBeUndefined();
    expect(console.error).toHaveBeenCalledTimes(1);
  });

  it('should handle inconsistent datetime format', async () => {
    jest.spyOn(console, 'error');

    const ratings1 = await getOdourRatings('?datetime=2024-06-18T12:34:56.000');
    expect(ratings1).toBeUndefined();

    const ratings2 = await getOdourRatings('?datetime=2024-06-18T12:34:56Z');
    expect(ratings2).toBeUndefined();
    expect(fetch).toHaveBeenCalledTimes(0);
    expect(console.error).toHaveBeenCalledTimes(2);
  });
});