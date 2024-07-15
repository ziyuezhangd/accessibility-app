import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { getSeatingAreas, SeatingArea } from '../src/services/seatingAreas';

describe('Function getSeatingAreas', () => {
  const dummySeatingAreas = [
    {'seatType':'LEANING BAR','category':'SBS','latitude':'40.744235','longitude':'-73.973042'},
    {'seatType':'BACKED 1.0','category':'Municipal Facilities','latitude':'40.802362','longitude':'-73.948246'}
  ];
  beforeEach(() => {
    fetch.resetMocks();
    jest.clearAllMocks();
  });
    
  it('should fetch seating areas and return SeatingArea instances', async () => {
    fetch.mockResponseOnce(JSON.stringify(dummySeatingAreas));
    
    const seatingAreas = await getSeatingAreas();
  
    expect(fetch).toHaveBeenCalledWith('/api/seating-areas');
    expect(seatingAreas).toHaveLength(2);
    expect(seatingAreas[0]).toBeInstanceOf(SeatingArea);
    expect(seatingAreas[1]).toBeInstanceOf(SeatingArea);
    expect(seatingAreas[0].seatType).toBe('LEANING BAR');
    expect(seatingAreas[1].longitude).toBe(-73.948246);
  });
    
  it('should handle fetch error', async () => {
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        statusText: 'API error',
      })
    );
    jest.spyOn(console, 'error');
    
    const seatingAreas = await getSeatingAreas();
    
    expect(fetch).toHaveBeenCalledWith('/api/seating-areas');
    expect(seatingAreas).toBeNull();
    expect(console.error).toHaveBeenCalledTimes(4);
  });
});
    
describe('Class SeatingArea', () => {
  const testSeatingArea = {'seatType':'LEANING BAR','category':'SBS','latitude':'40.744235','longitude':'-73.973042'};
    
  let seatingArea;
    
  beforeEach(() => {
    seatingArea = new SeatingArea(testSeatingArea);
  });
    
  it('should initialize with correct properties', () => {
    expect(seatingArea.seatType).toBe(testSeatingArea.seatType);
    expect(seatingArea.category).toBe(testSeatingArea.category);
    expect(seatingArea.latitude).toBe(parseFloat(testSeatingArea.latitude));
    expect(seatingArea.longitude).toBe(parseFloat(testSeatingArea.longitude));
    expect(seatingArea.latitude).toEqual(expect.any(Number));
    expect(seatingArea.longitude).toEqual(expect.any(Number));
  });
});