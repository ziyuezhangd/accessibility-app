import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { getPedestrianSignals, PedestrianSignal } from '../src/services/pedestrianSignals';

describe('Function getPedestrianSignals', () => {
  const dummyPedestrianSignals = [
    {'latitude':'40.712731','longitude':'-73.988491'},
    {'latitude':'40.782928','longitude':'-73.943914'}
  ];
  beforeEach(() => {
    fetch.resetMocks();
    jest.clearAllMocks();
  });
  
  it('should fetch pedestrian signals and return PedestrianSignal instances', async () => {
    fetch.mockResponseOnce(JSON.stringify(dummyPedestrianSignals));
  
    const pedestrianSignals = await getPedestrianSignals();

    expect(fetch).toHaveBeenCalledWith('/api/pedestrian-signals');
    expect(pedestrianSignals).toHaveLength(2);
    expect(pedestrianSignals[0]).toBeInstanceOf(PedestrianSignal);
    expect(pedestrianSignals[1]).toBeInstanceOf(PedestrianSignal);
    expect(pedestrianSignals[0].latitude).toBe(40.712731);
    expect(pedestrianSignals[1].longitude).toBe(-73.943914);
  });
  
  it('should handle fetch error', async () => {
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        statusText: 'API error',
      })
    );
    jest.spyOn(console, 'error');
  
    const pedestrianSignals = await getPedestrianSignals();
  
    expect(fetch).toHaveBeenCalledWith('/api/pedestrian-signals');
    expect(pedestrianSignals).toBeNull();
    expect(console.error).toHaveBeenCalledTimes(4);
  });
});
  
describe('Class PedestrianSignal', () => {
  const testPedestrianSignal = {'latitude':'40.712731','longitude':'-73.988491'};
  
  let pedestrianSignal;
  
  beforeEach(() => {
    pedestrianSignal = new PedestrianSignal(testPedestrianSignal);
  });
  
  it('should initialize with correct properties', () => {
    expect(pedestrianSignal.latitude).toBe(parseFloat(testPedestrianSignal.latitude));
    expect(pedestrianSignal.longitude).toBe(parseFloat(testPedestrianSignal.longitude));
    expect(pedestrianSignal.latitude).toEqual(expect.any(Number));
    expect(pedestrianSignal.longitude).toEqual(expect.any(Number));
  });
});