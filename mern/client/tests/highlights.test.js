import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { getAccessibilityHighlightPlaces } from '../src/services/highlights';

const dummyHighlights = [{ _id: '1', name: 'Place 1' }, { _id: '2', name: 'Place 2' }];

describe('Function getAccessibilityHighlightPlaces', () => {
  beforeEach(() => {
    fetch.resetMocks();
    jest.clearAllMocks();
  });

  it('should fetch accessibility highlight places correctly', async () => {
    fetch.mockResponseOnce(JSON.stringify(dummyHighlights));

    const highlights = await getAccessibilityHighlightPlaces();

    expect(fetch).toHaveBeenCalledWith('/api/accessibility-highlight-place');
    expect(highlights).toEqual(dummyHighlights);
  });

  it('should handle fetch error', async () => {
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        statusText: 'API error',
      })
    );
    jest.spyOn(console, 'error');
    
    const highlights = await getAccessibilityHighlightPlaces();

    expect(fetch).toHaveBeenCalledWith('/api/accessibility-highlight-place');
    expect(highlights).toBeNull();
    expect(console.error).toHaveBeenCalledTimes(4);
  });
});