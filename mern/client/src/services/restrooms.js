import _ from 'lodash';
import { calculateDistanceBetweenTwoCoordinates } from '../utils/MapUtils';
import { getCurrentTimeInNewYork, getDayString, isTimeInRange, parseTimeRangeFromString } from '../utils/dateTime';

/**
 *
 * Queries the backend for restrooms
 *  @param ('all' | 'incl-partial' | 'full')  accessibility
 * @return {Promise<PublicRestroom[]>} list of retrooms
 */
export const getPublicRestrooms = async (accessibility = 'all') => {
  const response = await fetch('/api/restrooms?' + new URLSearchParams({ accessibility }));

  const restrooms = await response.json();
  if (restrooms.error) {
    console.error(restrooms.error);
    return;
  }

  return restrooms;
};

/**
 * Represents a public restroom.
 */
export class PublicRestroom {
  /**
   * Creates an instance of PublicRestroom.
   * @param {Object} options - The options for the restroom.
   * @param {string} options.name - The name of the restroom.
   * @param {string} options.status - The status of the restroom (e.g., open, closed).
   * @param {string} options.hours - The operating hours of the restroom.
   * @param {boolean} options.isAccessible - Indicates if the restroom is accessible.
   * @param {boolean} options.isFullyAccessible - Indicates if the restroom is fully accessible.
   * @param {boolean} options.isPartiallyAccessible - Indicates if the restroom is partially accessible.
   * @param {string} options.restroomType - The type of the restroom (e.g., single, multiple).
   * @param {boolean} options.hasChangingStations - Indicates if the restroom has changing stations.
   * @param {string} options.url - The URL for more information about the restroom.
   * @param {number} options.latitude - The latitude coordinate of the restroom.
   * @param {number} options.longitude - The longitude coordinate of the restroom.
   */
  constructor({ name, status, hours, isAccessible, isFullyAccessible, isPartiallyAccessible, restroomType, hasChangingStations, url, latitude, longitude }) {
    /**
     * @type {string}
     */
    this.name = name;

    /**
     * @type {string}
     */
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

    /**
     * @type {boolean}
     */
    this.isAccessible = isAccessible;

    /**
     * @type {boolean}
     */
    this.isFullyAccessible = isFullyAccessible;

    /**
     * @type {boolean}
     */
    this.isPartiallyAccessible = isPartiallyAccessible;

    /**
     * @type {string}
     */
    this.restroomType = restroomType;

    /**
     * @type {boolean}
     */
    this.hasChangingStations = hasChangingStations;

    /**
     * @type {string}
     */
    this.url = url;

    /**
     * @type {number}
     */
    this.latitude = latitude;

    /**
     * @type {number}
     */
    this.longitude = longitude;
  }
}

export class PublicRestroomUtilities {
  /**
   * Finds the closest restroom to a given coordinate from a list of restrooms. By
   * default, returns the closest. Optionally provide a qty number to get the closest
   * x places.
   *
   * @param {PublicRestroom} restroom - a restroom object
   * @return {PublicRestroom[]} list of restrooms
   */
  static getNearest = (restroom, lat, lng, qty = 1) => {
    const placesSorted = _.sortBy(restroom, (r) => calculateDistanceBetweenTwoCoordinates(r.latitude, r.longitude, lat, lng));
    return placesSorted.slice(0, qty);
  };

  /**
   * Checks if a restroom is open right now (in NYC timezone)
   *
   * @param {PublicRestroom} restroom - a restroom object
   * @return {PublicRestroom[]} list of restrooms
   */
  static isRestroomOpenNow = (restroom) => {
    const hoursString = restroom.hours;
    const now = getCurrentTimeInNewYork();
    let openingTime, closingTime;

    const parsedHours = parseTimeRangeFromString(hoursString);
    if (parsedHours.length === 1) {
      // Hours are the same daily
      openingTime = parsedHours[0].start.date();
      closingTime = parsedHours[0].end.date();
    } else if (parsedHours.length > 1) {
      // Varying hours by day
      const today = getDayString(now);
      const todaysHours = parsedHours.find((h) => h.text.includes(today));
      openingTime = todaysHours.start.date();
      closingTime = todaysHours.end.date();
    } else {
      // TODO: unknown - handle this
      return;
    }
    const isOpen = isTimeInRange(now, openingTime, closingTime);
    return isOpen;
  };
}
