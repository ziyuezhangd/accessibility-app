import fs from 'fs';
import path from 'path';

// Get dictionary of segment ID to lat/lng
const __dirname = path.resolve();
const filePathSegment = path.join(__dirname, '../../ml/output/segment_to_lat_long.json');
const dataSegment = await fs.promises.readFile(filePathSegment, 'utf-8');
const dictionarySegment = JSON.parse(dataSegment);
// Get dictionary of MODZCTA to lat/lng
const filePathMODZCTA = path.join(__dirname, '../../ml/output/MODZCTA_Centerpoints.json');
const dataMODZCTA = await fs.promises.readFile(filePathMODZCTA, 'utf-8');
const dictionaryMODZCTA = JSON.parse(dataMODZCTA);

let url;
if (process.env.NODE_ENV === 'development') {
  url = 'http://localhost:8000/';
} else {
  url = '/flask-api/';
}

const ml = {
  /**
   * 
   * @param {string} datetime - The date-time string in ISO 8601 format (e.g., '2024-07-01T14:30:00') 
   * @returns {Array<{location: {lat: number, lng: number}, prediction: string}>} odourRatings
   */
  async getNoisePredictions(datetime) {
    const date = new Date(datetime);
    const hour = date.getHours();

    const response = await fetch(`${url}noise-ratings?hour=${hour}`);
    if (!response.ok) {
      throw new Error(`Failed to retrieve noise ratings: ${response.statusText}`);
    }
    const predictions = await response.json();

    // Convert segment ID to lat/lng
    const predictionsWithLatLng = predictions.map(prediction => ({
      location: {
        lat: dictionarySegment[prediction.segment_id].lat,
        lng: dictionarySegment[prediction.segment_id].lng,
      },
      prediction: prediction.prediction
    }));

    return predictionsWithLatLng;
  },
  
  /**
   * 
   * @param {string} datetime - The date-time string in ISO 8601 format (e.g., '2024-07-01T14:30:00') 
   * @returns {Array<{location: {lat: number, lng: number}, prediction: string}>} odourRatings
   */
  async getBusynessPredictions(datetime) {
    const date = new Date(datetime);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const dayOfWeek = (date.getDay() === 0) ? 6 : date.getDay() - 1;

    const response = await fetch(`${url}busyness-ratings?month=${month}&day=${day}&hour=${hour}&dayOfWeek=${dayOfWeek}`);
    if (!response.ok) {
      throw new Error(`Failed to retrieve busyness ratings: ${response.statusText}`);
    }
    const predictions = await response.json();

    // Convert segment ID to lat/lng
    const predictionsWithLatLng = predictions.map(prediction => ({
      location: {
        lat: dictionarySegment[prediction.segment_id].lat,
        lng: dictionarySegment[prediction.segment_id].lng,
      },
      prediction: prediction.prediction
    }));
    
    return predictionsWithLatLng;
  },

  /**
   * 
   * @param {string} datetime - The date-time string in ISO 8601 format (e.g., '2024-07-01T14:30:00') 
   * @returns {Array<{location: {lat: number, lng: number}, prediction: string}>} odourRatings
   */
  async getOdourPredictions(datetime) {
    const date = new Date(datetime);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();

    const response = await fetch(`${url}odour-ratings?month=${month}&day=${day}&hour=${hour}`);
    if (!response.ok) {
      throw new Error(`Failed to retrieve odour ratings: ${response.statusText}`);
    }
    const predictions = await response.json();
    // Convert MODZCTA to lat/lng here
    const predictionsWithLatLng = predictions.map(prediction => ({
      location: {
        lat: dictionaryMODZCTA[prediction.modzcta].lat,
        lng: dictionaryMODZCTA[prediction.modzcta].lng,
      },
      prediction: prediction.prediction
    }));

    return predictionsWithLatLng;
  }
};

export default ml;