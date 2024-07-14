import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { getPedestrianRamps, PedestrianRamp } from '../src/services/pedestrianRamps';

describe('Function getPedestrianRamps', () => {
  const dummyPedestrianRamps = [
    {'latitude':40.7467994372694,'longitude':-73.9883520547057,'width':'40.8'},
    {'latitude':40.77621584906011,'longitude':-73.964196820598,'width':'49.2'}
  ];
  beforeEach(() => {
    fetch.resetMocks();
    jest.clearAllMocks();
  });

  it('should fetch pedestrian ramps and return PedestrianRamp instances', async () => {
    fetch.mockResponseOnce(JSON.stringify(dummyPedestrianRamps));

    const pedestrianRamps = await getPedestrianRamps();
    expect(fetch).toHaveBeenCalledWith('/api/pedestrian-ramps');
    expect(pedestrianRamps).toHaveLength(2);
    expect(pedestrianRamps[0]).toBeInstanceOf(PedestrianRamp);
    expect(pedestrianRamps[1]).toBeInstanceOf(PedestrianRamp);
    expect(pedestrianRamps[0].latitude).toBe(40.7467994372694);
    expect(pedestrianRamps[1].longitude).toBe(-73.964196820598);
  });

  it('should handle fetch error', async () => {
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        statusText: 'API error',
      })
    );
    jest.spyOn(console, 'error');

    const pedestrianRamps = await getPedestrianRamps();

    expect(fetch).toHaveBeenCalledWith('/api/pedestrian-ramps');
    expect(pedestrianRamps).toBeNull();
    expect(console.error).toHaveBeenCalledTimes(4);
  });
});

describe('Class PedestrianRamp', () => {
  const testPedestrianRamp = {'latitude':40.7467994372694,'longitude':-73.9883520547057,'width':'40.8'};

  let pedestrianRamp;

  beforeEach(() => {
    pedestrianRamp = new PedestrianRamp(testPedestrianRamp);
  });

  it('should initialize with correct properties', () => {
    expect(pedestrianRamp.latitude).toBe(testPedestrianRamp.latitude);
    expect(pedestrianRamp.longitude).toBe(testPedestrianRamp.longitude);
    expect(pedestrianRamp.width).toBe(testPedestrianRamp.width);
    expect(pedestrianRamp.latitude).toEqual(expect.any(Number));
    expect(pedestrianRamp.longitude).toEqual(expect.any(Number));
  });
});