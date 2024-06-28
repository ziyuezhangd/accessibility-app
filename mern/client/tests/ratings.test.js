import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { getBusynessRatings, getNoiseRatings, getOdourRatings } from '../src/services/ratings.js';

const testDateTime = '2024-06-18T12:34:56.000Z';
const dummyRatings = [{ _id: '1', rating: 'A' }, { _id: '2', rating: 'C' }];

describe('Function getBusynessRatings', () => {
  beforeEach(() => {
    fetch.resetMocks();
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
    expect(console.error).toHaveBeenCalledWith('An error has occurred: API error');
  });
});

describe('Function getNoiseRatings', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  it('should fetch noise ratings correctly', async () => {
    fetch.mockResponseOnce(JSON.stringify(dummyRatings));

    const ratings = await getNoiseRatings(testDateTime);

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
    
    const ratings = await getNoiseRatings(testDateTime);

    expect(fetch).toHaveBeenCalledWith('/api/noise-ratings?' + new URLSearchParams({ datetime: testDateTime }));
    expect(ratings).toBeUndefined();
    expect(console.error).toHaveBeenCalledWith('An error has occurred: API error');
  });
});

describe('Function getOdourRatings', () => {
  beforeEach(() => {
    fetch.resetMocks();
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
    expect(console.error).toHaveBeenCalledWith('An error has occurred: API error');
  });
});