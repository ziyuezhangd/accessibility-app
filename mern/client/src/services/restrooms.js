import dayjs from 'dayjs';
import _ from 'lodash';
import { getCurrentTimeInNewYork, getDayString, isTimeInRange, parseTimeRangeFromString, isDST} from '../utils/dateTime';
import { calculateDistanceBetweenTwoCoordinates } from '../utils/MapUtils';
import { retryFetch } from '../utils/retryFetch';

/**
 *
 * Queries the backend for restrooms
 *  @param ('all' | 'incl-partial' | 'full')  accessibility
 * @return {Promise<PublicRestroom[]>} list of retrooms
 */
export const getPublicRestrooms = async (accessibility = 'all') => {
  try {
    const restrooms = await retryFetch('/api/restrooms?' + new URLSearchParams({ accessibility }));
    return restrooms.map((restroom) => {
      return new PublicRestroom({
        ...restroom,
        latitude: parseFloat(restroom.latitude),
        longitude: parseFloat(restroom.longitude)
      });
    });
  } catch(error) {
    console.error('Failed to fetch public restrooms:', error.message);
    return null;
  }
};

/**
 * Represents a public restroom.
 */
export class PublicRestroom {
  /**
   * Creates an instance of PublicRestroom.
   * @param {Object} options - The options for the restroom.
   * @param {string} options.name - The name of the restroom.
   * @param {string} options.status - The status of the restroom
   * @param {string} options.hours - The operating hours of the restroom.
   * @param {boolean} options.isAccessible - Indicates if the restroom is accessible.
   * @param {boolean} options.isFullyAccessible - Indicates if the restroom is fully accessible.
   * @param {boolean} options.isPartiallyAccessible - Indicates if the restroom is partially accessible.
   * @param {string} options.restroomType - The type of the restroom (e.g., single, multiple).
   * @param {boolean} options.hasChangingStations - Indicates if the restroom has changing stations.
   * @param {object} options.url - The URL for more information about the restroom.
   * @param {string} options.url.url
   * @param {number} options.latitude - The latitude coordinate of the restroom.
   * @param {number} options.longitude - The longitude coordinate of the restroom.
   */
  constructor({ name, status, hours, isAccessible, isFullyAccessible, isPartiallyAccessible, restroomType, hasChangingStations, url, latitude, longitude }) {
    this.name = name;
    this.status = status;

    /**
     * @type {string}
     * @example
     *
     * ```js
     * "8am-4pm, Open later seasonally"
     * "Sunday: Closed Monday: 10:00 am - 7:00 pm Tuesday: 10:00 am - 7:00 pm Wednesday: 11:00 am - 7:00 pm Thursday: 11:00 am - 7:00 pm Friday: 10:00 am - 5:00 pm Saturday: 10:00 am - 5:00 pm"
     * ```
     *
     */
    this.hours = hours;
    this.isAccessible = isAccessible;
    this.isFullyAccessible = isFullyAccessible;
    this.isPartiallyAccessible = isPartiallyAccessible;

    /**
     * @todo need to put the possible restroom types here
     * @type {string}
     * @example
     *
     * ```js
     *
     * ```
     *
     */
    this.restroomType = restroomType;
    this.hasChangingStations = hasChangingStations;
    this.url = url;
    this.latitude = latitude;
    this.longitude = longitude;
  }

  /**
   *
   * Formats the hours property into a string with new lines between each
   * day's hours
   *
   * @example
   * ```js
   * Sunday: Closed
   * Monday: 9am - 5pm
   * Tuesday: 9am: 5pm
   * ```
   *
   * @returns {string} hours formatted to a list
   */
  formatHours() {
    const parsedHours = parseTimeRangeFromString(this.hours);
    if (parsedHours === null) {
      return this.hours;
    }
    if (parsedHours.length === 1) {
      return this.hours;
    }
    let formattedHours = '';
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    for (const segment of parsedHours) {
      const day = segment.date().getDay();
      const dayString = days[day];
      if (!segment.start.isCertain('hour')) {
        if (days.includes(segment.start.text) || days.includes(segment.text)) {
          formattedHours += `\n${dayString}: Closed`;
        }
        continue;
      }
      const start = segment.start.date();
      const end = segment.end.date();
      formattedHours += `\n${dayString}: ${start.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}-${end.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
    }
    return formattedHours.substring(1);
  }

  /**
   * Checks if a restroom is open right now (in NYC timezone)
   *
   * @return {boolean} true if open, null if unsure
   */
  isOpen(dateTime) {
    if (dateTime === null || dateTime === undefined) {
      dateTime = getCurrentTimeInNewYork();
    } else {
      dateTime = dayjs(dateTime);
    }
    
    try {
      const hoursString = this.hours;
      let openingTime, closingTime;

      const parsedHours = parseTimeRangeFromString(hoursString);
      if (parsedHours === null) {
        return null;
      }
      if (parsedHours.length === 1) {
        // Hours are the same daily
        openingTime = parsedHours[0].start?.date();
        closingTime = parsedHours[0].end?.date();
      } else if (parsedHours.length > 1) {
        // Varying hours by day
        const today = getDayString(dateTime);
        const todaysHours = parsedHours.find((h) => h.text.includes(today));
        if (todaysHours.start === null || todaysHours.end === null) {
          // Closed for that day
          return false;
        } else {
          openingTime = todaysHours.start.date();
          closingTime = todaysHours.end.date();
        }
      }
      
      openingTime = dayjs.tz(`${openingTime}`, 'America/New_York').date(dateTime.date()).format('YYYY-MM-DD[T]HH:mm:ss');
      closingTime = dayjs.tz(`${closingTime}`, 'America/New_York').date(dateTime.date()).format('YYYY-MM-DD[T]HH:mm:ss');
      
      const DST = isDST(dateTime);
      if (DST) {
        openingTime = dayjs.tz(`${openingTime}`, 'America/New_York').add(1, 'hour');
        closingTime = dayjs.tz(`${closingTime}`, 'America/New_York').add(1, 'hour');
      }
      const isOpen = isTimeInRange(dateTime, openingTime, closingTime);
      return isOpen;
    } catch (e) {
      console.error(e.message);
      return null;
    }
  }
}

export class PublicRestroomUtilities {
  /**
   * Finds the closest restroom to a given coordinate from a list of restrooms. By
   * default, returns the closest. Optionally provide a qty number to get the closest
   * x places.
   *
   * @param {PublicRestroom[]} restrooms - a list of restrooms to look in
   * @return {PublicRestroom[]} list of restrooms
   */
  static getNearest = (restrooms, lat, lng, qty = 1) => {
    const operationalRestrooms = restrooms.filter((r) => r.status.toLowerCase() === 'operational');
    const placesSorted = _.sortBy(operationalRestrooms, (r) => calculateDistanceBetweenTwoCoordinates(r.latitude, r.longitude, lat, lng));
    return placesSorted.slice(0, qty);
  };
}
