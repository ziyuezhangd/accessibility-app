import { blue, brown, green, grey, lime, orange, purple, red, yellow } from '@mui/material/colors';
import _ from 'lodash';

export const MANHATTAN_LAT = 40.7831;

export const MANHATTAN_LNG = -73.9712;

export const DEFAULT_ZOOM = 14;

export const busynessGradient = [
  'rgba(0, 0, 255, 0)',// transparent blue
  'rgba(0, 0, 255, 1)',// blue
  'rgba(255, 0, 0, 1)'// red
];

export const noiseGradient = [
  'rgba(0, 255, 0, 0)',// green
  'rgba(0, 255, 0, 1)',
  'rgba(255, 255, 0, 1)',// yellow
  'rgba(255, 0, 0, 1)'// red
];

export const odorGradient = [
  'rgba(0, 255, 0, 0)',// green
  'rgba(0, 255, 0, 1)',
  'rgba(255, 255, 0, 1)',// yellow
  'rgba(128, 0, 128, 1)'// purple
];

// Code from https://henry-rossiter.medium.com/calculating-distance-between-geographic-coordinates-with-javascript-5f3097b61898
export const calculateDistanceBetweenTwoCoordinates = (lat1, lon1, lat2, lon2) => {
  var R = 6371.071; // Radius of the Earth in km
  var rlat1 = lat1 * (Math.PI / 180); // Convert degrees to radians
  var rlat2 = lat2 * (Math.PI / 180); // Convert degrees to radians
  var difflat = rlat2 - rlat1; // Radian difference (latitudes)
  var difflon = (lon2 - lon1) * (Math.PI / 180); // Radian difference (longitudes)

  var d = 2 * R * Math.asin(Math.sqrt(Math.sin(difflat / 2) * Math.sin(difflat / 2) + Math.cos(rlat1) * Math.cos(rlat2) * Math.sin(difflon / 2) * Math.sin(difflon / 2)));
  return d * 1000; // Meters
};

/**
 * @param {string} placeInfoString - String as returned by place-infos endpoint (eg: '42nd Street-Grand Central (S,4,5,6,7)')
 */
export const getSubwayLinesFromPlaceInfoString = (placeInfoString) => {
  const openingParenIdx = placeInfoString.indexOf('(');
  const closingParenIdx = placeInfoString.indexOf(')');
  const linesString = placeInfoString.substring(openingParenIdx + 1, closingParenIdx);
  const linesArr = linesString.split(',');
  return linesArr;
};

/**
 * @param {string} placeInfoString - String as returned by place-infos endpoint (eg: '42nd Street-Grand Central (S,4,5,6,7)')
 */
export const getSubwayStationNameFromPlaceInfoString = (placeInfoString) => {
  const openingParenIdx = placeInfoString.indexOf('(');
  return placeInfoString.substring(0, openingParenIdx);
};

// https://en.wikipedia.org/wiki/List_of_New_York_City_Subway_lines
export const SUBWAY_LINE_COLORS = {
  A: blue[900],
  C: blue[900],
  E: blue[900],
  B: orange[800],
  D: orange[800],
  F: orange[800],
  M: orange[800],
  G: lime['A700'],
  L: grey[700],
  J: brown[700],
  Z: brown[700],
  N: yellow[700],
  Q: yellow[700],
  R: yellow[700],
  W: yellow[700],
  1: red[700],
  2: red[700],
  3: red[700],
  4: green[900],
  5: green[900],
  6: green[900],
  7: purple[700],
  T: blue[200],
  S: grey[400],
  PATH: blue[900],
};
