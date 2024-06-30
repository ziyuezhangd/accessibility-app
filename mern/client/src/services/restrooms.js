import _ from 'lodash';
import { getCurrentTimeInNewYork, getDayString, isTimeInRange, parseTimeRangeFromString } from '../utils/dateTime';
import { calculateDistanceBetweenTwoCoordinates } from '../utils/MapUtils';

/**
 *
 * Queries the backend for restrooms
 *  @param ('all' | 'incl-partial' | 'full')  accessibility
 * @return {Promise<PublicRestroom[]>} list of retrooms
 */
export const getPublicRestrooms = async (accessibility = 'all') => {
  const response = await fetch('/api/restrooms?' + new URLSearchParams({ accessibility }));
  if (!response.ok) {
    const message = `An error has occurred: ${response.statusText}`;
    console.error(message);
    return;
  }

  const restrooms = await response.json();

  return restrooms.map((restroom) => new PublicRestroom(restroom));
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
   * @param {string} options.latitude - The latitude coordinate of the restroom.
   * @param {string} options.longitude - The longitude coordinate of the restroom.
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
   * @return {boolean} true if open
   */
  isOpenNow() {
    try {
      const hoursString = this.hours;
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
    } catch (e) {
      console.error(e);
      return false; // Return false for now
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
    const placesSorted = _.sortBy(restrooms, (r) => calculateDistanceBetweenTwoCoordinates(r.latitude, r.longitude, lat, lng));
    return placesSorted.slice(0, qty);
  };
}
