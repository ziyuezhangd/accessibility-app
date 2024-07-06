import { blue, brown, green, grey, lime, orange, purple, red, yellow } from '@mui/material/colors';
import _ from 'lodash';

export const MANHATTAN_LAT = 40.7831;

export const MANHATTAN_LNG = -73.9712;

export const DEFAULT_ZOOM = 14;

// Code from https://henry-rossiter.medium.com/calculating-distance-between-geographic-coordinates-with-javascript-5f3097b61898
export const calculateDistanceBetweenTwoCoordinates = (lat1, lon1, lat2, lon2) => {
  var R = 6371.071; // Radius of the Earth in km
  var rlat1 = parseFloat(lat1) * (Math.PI / 180); // Convert degrees to radians
  var rlat2 = parseFloat(lat2) * (Math.PI / 180); // Convert degrees to radians
  var difflat = rlat2 - rlat1; // Radian difference (latitudes)
  var difflon = (parseFloat(lon2) - parseFloat(lon1)) * (Math.PI / 180); // Radian difference (longitudes)

  var d = 2 * R * Math.asin(Math.sqrt(Math.sin(difflat / 2) * Math.sin(difflat / 2) + Math.cos(rlat1) * Math.cos(rlat2) * Math.sin(difflon / 2) * Math.sin(difflon / 2)));
  return d * 1000; // Meters
};

// Checks if a lat/long is between two lat longs
export const isBetween = (targetCoordinates, coordinates1, coordinates2, precision = 9) => {
  const target = new google.maps.LatLng(targetCoordinates.lat, targetCoordinates.lng);
  const lineToCheck = new google.maps.Polyline({
    path: [new google.maps.LatLng(coordinates1.lat, coordinates1.lng), new google.maps.LatLng(coordinates2.lat, coordinates2.lng)],
  });
  if (google.maps.geometry.poly.isLocationOnEdge(target, lineToCheck, Math.pow(10, precision * -1))) {
    return true;
  }
  return false;
};

export const findClosestSegment = ({ lat, lng }, segmentCoordsList) => {
  let validSegments = [];
  let precision = 9;
  while (validSegments.length === 0 && precision > 0) {
    validSegments = _.filter(segmentCoordsList, (bd) => isBetween({ lat, lng }, { lat: bd.location.start.lat, lng: bd.location.start.lng }, { lat: bd.location.end.lat, lng: bd.location.end.lng }, precision));
    // console.log(validSegments);
    precision -= 1;
  }
  if (validSegments.length === 0) {
    console.error('Could not find nearest segment');
  }
  const closestSegment = _.minBy(validSegments, segment => calculateDistanceBetweenTwoCoordinates(segment.location.start.lat, segment.location.start.lng, lat, lng) + calculateDistanceBetweenTwoCoordinates(segment.location.end.lat, segment.location.end.lng, lat, lng));
  return closestSegment;
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

export class MapLocation {
  constructor(lat, lng, placeId, name, isPlace) {
    this.lat = lat;
    this.lng = lng;
    this.placeId = placeId;
    this.name = name;
    this.isPlace = isPlace;
  }
}
