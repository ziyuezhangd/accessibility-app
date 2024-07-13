import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { getPublicRestrooms, PublicRestroom, PublicRestroomUtilities } from '../src/services/restrooms.js';
import { getCurrentTimeInNewYork } from '../src/utils/dateTime.js';

describe('Function getPublicRestrooms', () => {
  const dummyRestrooms = [
    {
      'name':'Corporal Thompson Playground',
      'status':'Operational',
      'hours':'8am-4pm, Open later seasonally',
      'isAccessible':true,
      'isFullyAccessible':true,
      'isPartiallyAccessible':false,
      'restroomType':'Multi-Stall W/M Restrooms',
      'hasChangingStations':false,
      'latitude':'40.638516',
      'longitude':'-74.117934'},
    {
      'name':'Bushwick Library, BPL',
      'status':'Operational',
      'hours':'Monday\t10 am - 6 pm\nTuesday\t1 pm - 8 pm\nWednesday\t10 am - 6 pm\nThursday\t10 am - 8 pm\nFriday\t10 am - 6 pm\nSaturday\t10 am - 5 pm\nSunday\tCLOSED',
      'isAccessible':true,
      'isFullyAccessible':true,
      'isPartiallyAccessible':false,
      'restroomType':'Single-Stall All Gender Restroom(s)',
      'hasChangingStations':true,
      'url':{'url':'https://www.bklynlibrary.org/locations/bushwick'},
      'latitude':'40.704567',
      'longitude':'-73.939620'}
  ];

  beforeEach(() => {
    fetch.resetMocks();
    jest.clearAllMocks();
  });

  it('should fetch publicRestrooms and return PublicRestroom instances', async () => {
    fetch.mockResponseOnce(JSON.stringify(dummyRestrooms));

    const restrooms = await getPublicRestrooms('all');

    expect(fetch).toHaveBeenCalledWith('/api/restrooms?' + new URLSearchParams({ accessibility: 'all' }));
    expect(restrooms).toHaveLength(2);
    expect(restrooms[0]).toBeInstanceOf(PublicRestroom);
    expect(restrooms[1]).toBeInstanceOf(PublicRestroom);
    expect(restrooms[0].name).toBe('Corporal Thompson Playground');
    expect(restrooms[1].restroomType).toBe('Single-Stall All Gender Restroom(s)');
    expect(typeof restrooms[0].latitude).toBe('number');
    expect(typeof restrooms[0].longitude).toBe('number');
  });

  it('should handle fetch error', async () => {
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        statusText: 'API error',
      })
    );
    jest.spyOn(console, 'error');

    const restrooms = await getPublicRestrooms('incl-partial');

    expect(fetch).toHaveBeenCalledWith('/api/restrooms?' + new URLSearchParams({ accessibility: 'incl-partial' }));
    expect(restrooms).toBeNull();
    expect(console.error).toHaveBeenCalledTimes(4);
  });
});

describe('Class PublicRestroom', () => {
  const testRestroom = {
    'name':'Bushwick Library, BPL',
    'status':'Operational',
    'hours':'Monday\t10 am - 6 pm\nTuesday\t1 pm - 8 pm\nWednesday\t10 am - 6 pm\nThursday\t10 am - 8 pm\nFriday\t10 am - 6 pm\nSaturday\t10 am - 5 pm\nSunday\tCLOSED',
    'isAccessible':true,
    'isFullyAccessible':true,
    'isPartiallyAccessible':false,
    'restroomType':'Single-Stall All Gender Restroom(s)',
    'hasChangingStations':true,
    'url':{'url':'https://www.bklynlibrary.org/locations/bushwick'},
    'latitude':'40.704567',
    'longitude':'-73.939620'
  };
      
  let publicRestroom;

  beforeEach(() => {
    publicRestroom = new PublicRestroom(testRestroom);
  });

  it('should initialize with correct properties', () => {
    expect(publicRestroom.name).toBe(testRestroom.name);
    expect(publicRestroom.status).toBe(testRestroom.status);
    expect(publicRestroom.hours).toEqual(testRestroom.hours);
    expect(publicRestroom.isAccessible).toBe(testRestroom.isAccessible);
    expect(publicRestroom.isFullyAccessible).toBe(testRestroom.isFullyAccessible);
    expect(publicRestroom.isPartiallyAccessible).toBe(testRestroom.isPartiallyAccessible);
    expect(publicRestroom.restroomType).toBe(testRestroom.restroomType);
    expect(publicRestroom.hasChangingStations).toBe(testRestroom.hasChangingStations);
    expect(publicRestroom.url).toBe(testRestroom.url);
    expect(publicRestroom.latitude).toBe(testRestroom.latitude);
    expect(publicRestroom.longitude).toBe(testRestroom.longitude);
  });

  describe('Method formatHours', () => {
    it('should return the original hours string when only one time segment', () => {
      publicRestroom.hours = '8am-4pm, Open later seasonally';
      const formattedHours1 = publicRestroom.formatHours();
      expect(formattedHours1).toBe(publicRestroom.hours);

      publicRestroom.hours = 'Everyday 8:00 am-10:00 pm';
      const formattedHours2 = publicRestroom.formatHours();
      expect(formattedHours2).toBe(publicRestroom.hours);

      publicRestroom.hours = 'Fall, spring summer: 7am - 9pm. Winter: 7am - 5:30pm';
      const formattedHours3 = publicRestroom.formatHours();
      expect(formattedHours3).toBe(publicRestroom.hours);

      publicRestroom.hours = '8am - dusk';
      const formattedHours4 = publicRestroom.formatHours();
      expect(formattedHours4).toBe(publicRestroom.hours);

      publicRestroom.hours = 'Open by permit';
      const formattedHours5 = publicRestroom.formatHours();
      expect(formattedHours5).toBe(publicRestroom.hours);

    });

    it('should format correctly for multiple time segments', () => {
      const formattedHours1 = publicRestroom.formatHours();
      const expectedOutput1 = 
`Monday: 10:00 AM-06:00 PM
Tuesday: 01:00 PM-08:00 PM
Wednesday: 10:00 AM-06:00 PM
Thursday: 10:00 AM-08:00 PM
Friday: 10:00 AM-06:00 PM
Saturday: 10:00 AM-05:00 PM
Sunday: Closed`.trim();
      expect(formattedHours1).toBe(expectedOutput1);

      publicRestroom.hours = 'Sunday: Closed \nMonday: 11:00 am - 6:00 pm \nTuesday: 11:00 am - 6:00 pm \nWednesday: 11:00 am - 6:00 pm \nThursday: 11:00 am - 6:00 pm \nFriday: 11:00 am - 6:00 pm \nSaturday: 11:00 am - 6:00 pm';
      const formattedHours2 = publicRestroom.formatHours();
      const expectedOutput2 = 
`Sunday: Closed
Monday: 11:00 AM-06:00 PM
Tuesday: 11:00 AM-06:00 PM
Wednesday: 11:00 AM-06:00 PM
Thursday: 11:00 AM-06:00 PM
Friday: 11:00 AM-06:00 PM
Saturday: 11:00 AM-06:00 PM`.trim();
      expect(formattedHours2).toBe(expectedOutput2);

      publicRestroom.hours = 'Monday to Saturday: 7:00 am-11:00 pm; Sunday & holidays: 11:00 am-7:00 pm';
      const formattedHours3 = publicRestroom.formatHours();
      const expectedOutput3 = 
`Monday: 07:00 AM-11:00 PM
Tuesday: 07:00 AM-11:00 PM
Wednesday: 07:00 AM-11:00 PM
Thursday: 07:00 AM-11:00 PM
Friday: 07:00 AM-11:00 PM
Saturday: 07:00 AM-11:00 PM
Sunday: 11:00 AM-07:00 PM`.trim();
      expect(formattedHours3).toBe(expectedOutput3);

      publicRestroom.hours = 'Monday to Friday: 8:00 am-7:00 pm';
      const formattedHours4 = publicRestroom.formatHours();
      const expectedOutput4 = 
`Monday: 08:00 AM-07:00 PM
Tuesday: 08:00 AM-07:00 PM
Wednesday: 08:00 AM-07:00 PM
Thursday: 08:00 AM-07:00 PM
Friday: 08:00 AM-07:00 PM
Saturday: Closed
Sunday: Closed`.trim();
      console.log(formattedHours4);
      expect(formattedHours4).toBe(expectedOutput4);
    });
  });

  describe('Method isOpenNow', () => {
    const now = getCurrentTimeInNewYork();
    const hourNow = now.hour(); // hour in NY time with DST
    const dayNow = now.day();
    const minNow = now.minute();
    it('should return correctly for restrooms with same daily opening hours', () => {
      publicRestroom.hours = '8am-4pm, Open later seasonally';
      const isOpen1 = publicRestroom.isOpenNow();
      if (hourNow >= 8 && hourNow < 16){
        expect(isOpen1).toBe(true);
      } else {
        expect(isOpen1).toBe(false);
      }

      publicRestroom.hours = 'Bathrooms are open from 7 a.m.-7 p.m., with a one-hour closure for cleaning from 12 noon-1 p.m.';
      const isOpen2 = publicRestroom.isOpenNow();
      if (hourNow >= 7 && hourNow < 19){
        expect(isOpen2).toBe(true);
      } else {
        expect(isOpen2).toBe(false);
      }
    });

    it('should return correctly for restrooms with varying daily opening hours', () => {
      publicRestroom.hours = 'Monday\t10 am - 6 pm\nTuesday\t1 pm - 8 pm\nWednesday\t10 am - 6 pm\nThursday\t10 am - 8 pm\nFriday\t10 am - 6 pm\nSaturday\t10 am - 5 pm\nSunday\tCLOSED';
      const isOpen3 = publicRestroom.isOpenNow();
      switch(dayNow){
      case 0:
        expect(isOpen3).toBe(false);
        break;
      case 1:
        if (hourNow >= 10 && hourNow < 18){
          expect(isOpen3).toBe(true);
        } else {
          expect(isOpen3).toBe(false);
        }
        break;
      case 2:
        if (hourNow >= 13 && hourNow < 20){
          expect(isOpen3).toBe(true);
        } else {
          expect(isOpen3).toBe(false);
        }
        break;
      case 3:
        if (hourNow >= 10 && hourNow < 18){
          expect(isOpen3).toBe(true);
        } else {
          expect(isOpen3).toBe(false);
        }
        break;
      case 4:
        if (hourNow >= 11 && hourNow < 20){
          expect(isOpen3).toBe(true);
        } else {
          expect(isOpen3).toBe(false);
        }
        break;
      case 5:
        if (hourNow >= 10 && hourNow < 18){
          expect(isOpen3).toBe(true);
        } else {
          expect(isOpen3).toBe(false);
        }
        break;
      case 6:
        if (hourNow >= 10 && hourNow < 17){
          expect(isOpen3).toBe(true);
        } else {
          expect(isOpen3).toBe(false);
        }
        break;
      }

      publicRestroom.hours = 'Monday to Saturday:  8:30 am-10:00 pm; Sundays: 10:00 am-7:00 pm.';
      const isOpen4 = publicRestroom.isOpenNow();
      switch(dayNow){
      case 0:
        if (hourNow >= 10 && hourNow < 19){
          expect(isOpen4).toBe(true);
        } else {
          expect(isOpen4).toBe(false);
        }
        break;
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
      case 6:
        if (hourNow === 8 && minNow < 30){
          expect(isOpen4).toBe(false);
        } else if (hourNow >= 8 && hourNow < 22) {
          expect(isOpen4).toBe(true);
        } else {
          expect(isOpen4).toBe(false);
        }
        break;
      }
    });
  });
});

describe('Class PublicRestroomUtilities', () => {
  describe('Method getNearest', () => {
    const testPublicRestrooms = [
      new PublicRestroom({name: 'Restroom A', latitude: 41, longitude: -71}),
      new PublicRestroom({name: 'Restroom B', latitude: 40, longitude: -70}),
      new PublicRestroom({name: 'Restroom C', latitude: 39, longitude: -70}),
      new PublicRestroom({name: 'Restroom D', latitude: 41, longitude: -70}),
    ];
    const testLat = 40;
    const testLon = -71;

    it('should return the nearest restroom based on calculateDistanceBetweenTwoCoordinates', () => {
      const closestRestroom = PublicRestroomUtilities.getNearest(testPublicRestrooms, testLat, testLon);

      expect(closestRestroom).toHaveLength(1);
      expect(closestRestroom[0]).toBeInstanceOf(PublicRestroom);
      expect(closestRestroom[0].name).toBe('Restroom B');
    });
    it('should return the specified number of restrooms', () => {
      const closestRestrooms = PublicRestroomUtilities.getNearest(testPublicRestrooms, testLat, testLon, 3);

      expect(closestRestrooms).toHaveLength(3);
      expect(closestRestrooms[1]).toBeInstanceOf(PublicRestroom);
      expect(closestRestrooms[0].name).toBe('Restroom B');
      expect(closestRestrooms[1].name).toBe('Restroom A');
      expect(closestRestrooms[2].name).toBe('Restroom D');
    });
  });
});