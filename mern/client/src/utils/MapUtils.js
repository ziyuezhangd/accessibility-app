
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
