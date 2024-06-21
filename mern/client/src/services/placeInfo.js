import _ from 'lodash';
import { calculateDistanceBetweenTwoCoordinates } from '../utils/MapUtils';

/**
 *
 * Queries the backend for all accessibility cloud place infos in Manhattan
 * which are fully wheelchair accessible.
 *
 * @returns Place Info object:
 * {
 *  category: string,
 *  name: string,
 *  address: string,
 *  latitude: number,
 *  longitude: number,
 * }
 */
export const getPlaceInfos = async () => {
  const response = await fetch(`/api/place-infos`);

  const placeInfo = await response.json();
  if (placeInfo.error) {
    console.error(placeInfo.error);
    return;
  }
  return placeInfo;
};

/**
 *
 * Queries the backend for all possible placeInfo categories
 *
 * @returns Array of categories (strings)
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

export class PlaceInfoUtilities {
  /**
   * Given a placeInfo object, gets a human-readable string of the address -
   * if not available, returns empty string.
   *
   * @param {{
   *  category: string,
   *  name: string,
   *  address: string,
   *  latitude: string,
   *  longitude: string,
   *  accessibility: string,
   *  hasWheelchairAccessibleRestroom: string}
   * } placeInfo - a placeInfo object
   * @return {string} eg: "100 S Broadway"
   */
  static getStreetAddressText = (placeInfo) => {
    if (placeInfo.address && placeInfo.address.street !== null) {
      return placeInfo.address.text;
    }
    return '';
  };

  /**
   * Given a placeInfo object, checks if it has a wheelchair accessible restroom.
   *
   * @param {{
   *  category: string,
   *  name: string,
   *  address: string,
   *  latitude: string,
   *  longitude: string,
   *  accessibility: string,
   *  hasWheelchairAccessibleRestroom: string}
   * } placeInfo - a placeInfo object
   * @return {boolean} true if restroom is accessible.
   */
  static hasWheelchairAccessibleRestroom = (placeInfo) => {
    return placeInfo.hasWheelchairAccessibleRestroom || placeInfo.category === 'toilets';
  };

  /**
   * Finds the closest placeInfo to a given coordinate from a list of placeInfos. By
   * default, returns the closest. Optionally provide a qty number to get the closest
   * x places.
   *
   * @param {{
   *  category: string,
   *  name: string,
   *  address: string,
   *  latitude: string,
   *  longitude: string,
   *  accessibility: string,
   *  hasWheelchairAccessibleRestroom: string}
   * } placeInfo - a placeInfo object
   * @return {array} list of places
   */
  static getNearest = (placeInfos, lat, lng, qty = 1) => {
    const placesSorted = _.sortBy(placeInfos, (r) => calculateDistanceBetweenTwoCoordinates(r.latitude, r.longitude, lat, lng));
    return placesSorted.slice(0, qty);
  };

  static isSubwayStation = (placeInfo) => placeInfo.category === 'train_station' || placeInfo.category === 'subway_station';
  /**
   *
   * Train station placeInfo objects will have a list of the subway lines in the name field.
   * This function extracts the subway lines and returns them as an array.
   *
   * @param {{
   *  category: string,
   *  name: string,
   *  address: string,
   *  latitude: string,
   *  longitude: string,
   *  accessibility: string,
   *  hasWheelchairAccessibleRestroom: string}
   * } placeInfo - a placeInfo object
   * @return {array} list of subway lines
   * /**
   * @throws {} Will throw an error if the placeInfo is not a station.
   */
  static getSubwayLines = (placeInfo) => {
    if (!this.isSubwayStation(placeInfo)) {
      throw new Error(`Attempted to extract subway lines from a ${placeInfo.category} placeInfo object.`);
    }
    if (!placeInfo.name) {
      console.warn(`Subway station has no name: `, placeInfo);
      return [];
    }
    const openingParenIdx = placeInfo.name.indexOf('(');
    const closingParenIdx = placeInfo.name.indexOf(')');
    const linesString = placeInfo.name.substring(openingParenIdx + 1, closingParenIdx);
    const linesArr = linesString.split(',');
    return linesArr;
  };

  /**
   *
   * Given a plaaceInfo object, extracts the name of the subway station.
   *
   * @param {{
   *  category: string,
   *  name: string,
   *  address: string,
   *  latitude: string,
   *  longitude: string,
   *  accessibility: string,
   *  hasWheelchairAccessibleRestroom: string}
   * } placeInfo - a placeInfo object
   * @return {string} subway station name
   * /**
   * @throws {} Will throw an error if the placeInfo is not a station.
   */
  static getSubwayStationName = (placeInfo) => {
    if (!this.isSubwayStation(placeInfo)) {
      throw new Error(`Attempted to extract subway lines from a ${placeInfo.category} placeInfo object.`);
    }
    if (!placeInfo.name) {
      console.warn(`Subway station has no name: `, placeInfo);
      return [];
    }
    const openingParenIdx = placeInfo.name.indexOf('(');
    return placeInfo.name.substring(0, openingParenIdx);
  };
}
