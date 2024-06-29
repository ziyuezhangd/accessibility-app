import _ from 'lodash';
import { calculateDistanceBetweenTwoCoordinates } from '../utils/MapUtils';

/**
 *
 * Queries the backend for all accessibility cloud place infos in Manhattan
 * which are fully wheelchair accessible.
 *
 * @returns {Promise<Array<PlaceInfo>>} placeInfos
 */
export const getPlaceInfos = async () => {
  const response = await fetch(`/api/place-infos`);
  if (!response.ok) {
    const message = `An error has occurred: ${response.statusText}`;
    console.error(message);
    return;
  }

  const placeInfos = await response.json();
  return placeInfos.map((placeInfo) => new PlaceInfo(...Object.values(placeInfo)));
};

/**
 *
 * Queries the backend for all possible placeInfo categories
 *
 * @returns {Promise<Array<string>>} list of categories
 */
export const getCategories = async () => {
  const response = await fetch(`/api/place-infos/categories`);
  if (!response.ok) {
    const message = `An error has occurred: ${response.statusText}`;
    console.error(message);
    return;
  }
  const categories = await response.json();
  return categories;
};

/**
 * Class representing a the place info returned from the accessibility endpoint
 */
export class PlaceInfo {
  /**
   * Create a Location.
   * @param {string} category - The category of the place info.
   * @param {string} name - The name of the place info.
   * @param {string} address - The address of the place info.
   * @param {number} latitude - The latitude of the place info.
   * @param {number} longitude - The longitude of the place info.
   * @param {string} accessibility - The accessibility information of the place info.
   * @param {string} hasWheelchairAccessibleRestroom - Indicates if the place info has a wheelchair-accessible restroom.
   */
  constructor(category, name, address, latitude, longitude, accessibility, hasWheelchairAccessibleRestroom) {
    this.category = category;
    this.name = name;
    this.address = address;
    this.latitude = latitude;
    this.longitude = longitude;
    this.accessibility = accessibility;
    this.hasWheelchairAccessibleRestroom = hasWheelchairAccessibleRestroom;
  }

  /**
   * Gets a human-readable string of the address - if not available, returns empty string.
   * */
  getStreetAddressText() {
    if (this.address && this.address.street !== null) {
      return this.address.text;
    }
    return '';
  }

  /**
   * Check is the place either is a toilet or has a wheelchair accessible restroom
   *
   * @returns {boolean} true if restroom is accessible.
   */
  hasWheelchairAccessibleRestrooms() {
    return this.hasWheelchairAccessibleRestroom || this.category === 'toilets';
  }
  /**
   * Check if the place is a subway station
   *
   * @returns {boolean} true if the place is a subway station
   */
  isSubwayStation() {
    return this.category === 'train_station' || this.category === 'subway_station';
  }

  /**
   *
   * Train station placeInfo objects will have a list of the subway lines in the name field (Example: Canal Street (A,2,3)).
   * This function extracts the subway lines and returns them as an array.
   *
   * @return {Array<string>} list of subway lines
   * @throws {} Will throw an error if the placeInfo is not a station.
   */
  getSubwayLines() {
    if (!this.isSubwayStation()) {
      throw new Error(`Attempted to extract subway lines from a ${this.category} placeInfo object.`);
    }
    if (!this.name) {
      console.log(`Subway station has no name`);
      return [];
    }

    const openingParenIdx = this.name.indexOf('(');
    const closingParenIdx = this.name.indexOf(')');
    if (openingParenIdx === -1 || closingParenIdx === -1 || openingParenIdx >= closingParenIdx) {
      console.log(`Subway station name format is incorrect`);
      return [];
    }
    const linesString = this.name.substring(openingParenIdx + 1, closingParenIdx);
    const linesArr = linesString.split(',').map(line => line.trim());
    return linesArr;
  }

  /**
   *
   * Get the subway station name from a subway station place
   *
   * @return {string} subway station name
   * @throws {} Will throw an error if the placeInfo is not a station.
   */
  getSubwayStationName() {
    if (!this.isSubwayStation()) {
      throw new Error(`Attempted to extract subway lines from a ${this.category} placeInfo object.`);
    }
    if (!this.name) {
      console.log(`Subway station has no name`);
      return '';
    }
    const openingParenIdx = this.name.indexOf('(');
    if (openingParenIdx === -1) {
      return this.name;
    }
    return this.name.substring(0, openingParenIdx).trim();
  }
}

export class PlaceInfoUtilities {
  /**
   * Finds the closest placeInfo to a given coordinate from a list of placeInfos. By
   * default, returns the closest. Optionally provide a qty number to get the closest
   * x places.
   *
   * @param {PlaceInfo[]} placeInfos - a list of placeinfos to search in
   * @return {Array<PlaceInfo>} list of places
   */
  static getNearest = (placeInfos, lat, lng, qty = 1) => {
    const placesSorted = _.sortBy(placeInfos, (r) => calculateDistanceBetweenTwoCoordinates(r.latitude, r.longitude, lat, lng));
    return placesSorted.slice(0, qty);
  };
}
