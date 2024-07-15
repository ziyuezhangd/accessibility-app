import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { PlaceInfo, getPlaceInfos, getCategories, PlaceInfoUtilities } from '../src/services/placeInfo.js';

describe('Class PlaceInfo', () => {
  const testPlaceInfo = {
    'category': 'restaurant',
    'name': 'Yung Sun Seafood Restaurant',
    'address': {'street':'East Broadway','city':'New York','house':'54','postalCode':'10002','text':'East Broadway 54, 10002, New York'},
    'latitude': 40.7134411,
    'longitude': -73.9958191,
    'hasWheelchairAccessibleRestroom': true
  };

  let placeInfo;

  beforeEach(() => {
    placeInfo = new PlaceInfo(testPlaceInfo);
  });

  it('should initialize with correct properties', () => {
    expect(placeInfo.category).toBe(testPlaceInfo.category);
    expect(placeInfo.name).toBe(testPlaceInfo.name);
    expect(placeInfo.address).toEqual(testPlaceInfo.address);
    expect(placeInfo.latitude).toBe(testPlaceInfo.latitude);
    expect(placeInfo.longitude).toBe(testPlaceInfo.longitude);
    expect(placeInfo.hasWheelchairAccessibleRestroom).toBe(testPlaceInfo.hasWheelchairAccessibleRestroom);
  });

  describe('Method getStreetAddressText', () => {
    it('should return street address if it has the properties', () => {
      expect(placeInfo.getStreetAddressText()).toBe(testPlaceInfo.address.text);
    });
    it('should return empty string if it does not have address property', () => {
      placeInfo.address.street = null;
      expect(placeInfo.getStreetAddressText()).toBe('');
    });
    it('should return empty string if it does not have address.street property', () => {
      placeInfo.address = null;
      expect(placeInfo.getStreetAddressText()).toBe('');
    });
  });

  describe('Method hasWheelchairAccessibleRestrooms', () => {
    it('should return property hasWheelchairAccessibleRestrooms if it is not a toilet', () => {
      placeInfo.category = 'restaurant';
      expect(placeInfo.hasWheelchairAccessibleRestrooms()).toBe(testPlaceInfo.hasWheelchairAccessibleRestroom);

      placeInfo.hasWheelchairAccessibleRestroom = false;
      expect(placeInfo.hasWheelchairAccessibleRestrooms()).toBe(false);
    });

    it('should return true if it is a toilet', () => {
      placeInfo.category = 'toilets';
      expect(placeInfo.hasWheelchairAccessibleRestrooms()).toBe(true);

      placeInfo.category = 'toilets';
      placeInfo.hasWheelchairAccessibleRestroom = false;
      expect(placeInfo.hasWheelchairAccessibleRestrooms()).toBe(true);
    });
  });

  describe('Method isSubwayStation', () => {
    it('should return true if it is a subway station', () => {  
      placeInfo.category = 'train_station';
      expect(placeInfo.isSubwayStation()).toBe(true);
  
      placeInfo.category = 'subway_station';
      expect(placeInfo.isSubwayStation()).toBe(true);
    });
    it('should return false if it is not a subway station', () => {
      expect(placeInfo.isSubwayStation()).toBe(false);
    });
  });
  
  describe('Method getSubwayLines', () => {
    it('should return correct subway lines', () => {
      placeInfo.category = 'train_station';
      placeInfo.name = 'Canal Street (A , C , E)';
      expect(placeInfo.getSubwayLines()).toEqual(['A', 'C', 'E']);
      placeInfo.name = 'Canal Street (A,C,E)';
      expect(placeInfo.getSubwayLines()).toEqual(['A', 'C', 'E']);
      placeInfo.category = 'subway_station';
      expect(placeInfo.getSubwayLines()).toEqual(['A', 'C', 'E']);
    });
    it('should return empty array if name format is wrong or it does not have a name', () => {
      placeInfo.category = 'subway_station';
      placeInfo.name = 'Canal Street';
      expect(placeInfo.getSubwayLines()).toEqual([]);

      placeInfo.name = null;
      expect(placeInfo.getSubwayLines()).toEqual([]);
    });
    it('should throw an error if it is not a subway station', () => {
      expect(() => placeInfo.getSubwayLines()).toThrow(Error);
    });
  });
  
  describe('Method getSubwayStationName', () => {
    it('should return correct subway name', () => {
      placeInfo.category = 'train_station';
      placeInfo.name = 'Canal Street (A,C,E)';
      expect(placeInfo.getSubwayStationName()).toBe('Canal Street');
      placeInfo.name = 'Canal Street(A,C,E)';
      expect(placeInfo.getSubwayStationName()).toBe('Canal Street');
      placeInfo.category = 'subway_station';
      expect(placeInfo.getSubwayStationName()).toBe('Canal Street');
  
      placeInfo.name = 'Canal Street';
      expect(placeInfo.getSubwayStationName()).toBe('Canal Street');
    });
    it('should return empty string if it does not have a name', () => {
      placeInfo.category = 'subway_station';
      placeInfo.name = null;
      expect(placeInfo.getSubwayStationName()).toBe('');
    });
    it('should throw an error if it is not a subway station', () => {
      expect(() => placeInfo.getSubwayStationName()).toThrow(Error);
    });
  });
});

describe('Function getPlaceInfos', () => {
  const dummyPlaces = [
    {'category':'police','name':'New York City Police Headquarters','latitude':40.7119414,'longitude':-74.0020911},
    {'category':'library','name':'Chatham Square Library','latitude':40.7133126,'longitude':-73.9963202}
  ];

  beforeEach(() => {
    fetch.resetMocks();
    jest.clearAllMocks();
  });

  it('should fetch placeInfo and return PlaceInfo instances', async () => {
    fetch.mockResponseOnce(JSON.stringify(dummyPlaces));

    const placeInfos = await getPlaceInfos();

    expect(fetch).toHaveBeenCalledWith('/api/place-infos');
    expect(placeInfos).toHaveLength(2);
    expect(placeInfos[0]).toBeInstanceOf(PlaceInfo);
    expect(placeInfos[1]).toBeInstanceOf(PlaceInfo);
    expect(placeInfos[0].name).toBe('New York City Police Headquarters');
    expect(placeInfos[1].category).toBe('library');
  });

  it('should handle fetch error', async () => {
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        statusText: 'API error',
      })
    );
    jest.spyOn(console, 'error');

    const placeInfos = await getPlaceInfos();

    expect(fetch).toHaveBeenCalledWith('/api/place-infos');
    expect(placeInfos).toBeNull();
    expect(console.error).toHaveBeenCalledTimes(4);
  });
});

describe('Function getCategories', () => {
  const dummyCategories = ['airport','biergarten','books'];

  beforeEach(() => {
    fetch.resetMocks();
    jest.clearAllMocks();
  });

  it('should fetch categories', async () => {
    fetch.mockResponseOnce(JSON.stringify(dummyCategories));

    const categories = await getCategories();

    expect(fetch).toHaveBeenCalledWith('/api/place-infos/categories');
    expect(categories).toEqual(dummyCategories);
  });

  it('should handle fetch error', async () => {
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        statusText: 'API error',
      })
    );
    jest.spyOn(console, 'error');

    const categories = await getCategories();

    expect(fetch).toHaveBeenCalledWith('/api/place-infos/categories');
    expect(categories).toBeUndefined();
    expect(console.error).toHaveBeenCalledTimes(1);
  });
});

describe('Class PlaceInfoUtilities', () => {
  describe('Method getNearest', () => {
    const testPlaceInfos = [
      new PlaceInfo({ 'category':'test', 'name': 'Place A', 'address': 'test address', 'latitude': 41, 'longitude': -71, 'hasWheelchairAccessibleRestroom': true }),
      new PlaceInfo({ 'category':'test', 'name': 'Place B', 'address': 'test address', 'latitude': 40, 'longitude': -70, 'hasWheelchairAccessibleRestroom': true }),
      new PlaceInfo({ 'category':'test', 'name': 'Place C', 'address': 'test address', 'latitude': 39, 'longitude': -70, 'hasWheelchairAccessibleRestroom': true }),
      new PlaceInfo({ 'category':'test', 'name': 'Place D', 'address': 'test address', 'latitude': 41, 'longitude': -70, 'hasWheelchairAccessibleRestroom': true }),
    ];
    const testLat = 40;
    const testLon = -71;

    it('should return the nearest place based on calculateDistanceBetweenTwoCoordinates', () => {
      const closestPlace = PlaceInfoUtilities.getNearest(testPlaceInfos, testLat, testLon);

      expect(closestPlace).toHaveLength(1);
      expect(closestPlace[0]).toBeInstanceOf(PlaceInfo);
      expect(closestPlace[0].name).toBe('Place B');
    });
    it('should return the specified number of places', () => {
      const closestPlaces = PlaceInfoUtilities.getNearest(testPlaceInfos, testLat, testLon, 3);

      expect(closestPlaces).toHaveLength(3);
      expect(closestPlaces[1]).toBeInstanceOf(PlaceInfo);
      expect(closestPlaces[0].name).toBe('Place B');
      expect(closestPlaces[1].name).toBe('Place A');
      expect(closestPlaces[2].name).toBe('Place D');
    });
    
    it('should handle qty=0', () => {
      const closestPlace = PlaceInfoUtilities.getNearest(testPlaceInfos, testLat, testLon, 0);

      expect(closestPlace).toEqual([]);
    });
    it('should handle empty placeInfos', () => {
      const closestPlace = PlaceInfoUtilities.getNearest([], testLat, testLon);

      expect(closestPlace).toEqual([]);
    });
    it('should handle invalid placeInfos', () => {
      const invalidInfos = [1, 2];
      const closestPlace = PlaceInfoUtilities.getNearest(invalidInfos, testLat, testLon);

      expect(closestPlace).toEqual([]);
    });
    it('should handle qty>length', () => {
      const closestPlaces = PlaceInfoUtilities.getNearest(testPlaceInfos, testLat, testLon, 5);

      expect(closestPlaces).toHaveLength(testPlaceInfos.length);
      expect(closestPlaces[0].name).toBe('Place B');
      expect(closestPlaces[1].name).toBe('Place A');
      expect(closestPlaces[2].name).toBe('Place D');
      expect(closestPlaces[3].name).toBe('Place C');
    });
    it('should handle lat/lng in string', () => {
      const testLatStr = '40';
      const testLonStr = '-71';
      const closestPlace = PlaceInfoUtilities.getNearest(testPlaceInfos, testLatStr, testLonStr);

      expect(closestPlace).toHaveLength(1);
      expect(closestPlace[0]).toBeInstanceOf(PlaceInfo);
      expect(closestPlace[0].name).toBe('Place B');
    });
  });
});