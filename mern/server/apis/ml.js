import fs from 'fs';
import path from 'path';

// Get dictionary of segment ID to lat/lng
const __dirname = path.resolve();
const filePath = path.join(__dirname, '../../ml/output/segment_to_lat_long.json');
const data = await fs.promises.readFile(filePath, 'utf-8');
const dictionary = JSON.parse(data);
// Get dictionary of MODZCTA to lat/lng

const ml = {
  async getNoisePredictions(hour) {
    const response  = await fetch(`/flask-api/noise-ratings?hour=${hour}`);
    if (!response.ok) {
      throw new Error(`Failed to retrieve noise ratings: ${response.statusText}`);
    }
    const predictions = await response.json();

    // Convert segment ID to lat/lng
    const predictionsWithLatLng = predictions.map(prediction => ({
      location: {
        lat: dictionary[prediction.segment_id].lat,
        lng: dictionary[prediction.segment_id].lng,
      },
      prediction: prediction.prediction
    }));

    return predictionsWithLatLng;
  },

  async getBusynessPredictions(month, day, hour, dayOfWeek) {
    const response = await fetch(`/flask-api/busyness-ratings?month=${month}&day=${day}&hour=${hour}&dayOfWeek=${dayOfWeek}`);
    if (!response.ok) {
      throw new Error(`Failed to retrieve busyness ratings: ${response.statusText}`);
    }
    const predictions = await response.json();

    // Convert segment ID to lat/lng
    const predictionsWithLatLng = predictions.map(prediction => ({
      location: {
        lat: dictionary[prediction.segment_id].lat,
        lng: dictionary[prediction.segment_id].lng,
      },
      prediction: prediction.prediction
    }));
    
    return predictionsWithLatLng;
  },

  async getOdourPredictions(month, day, hour, dayOfWeek) {
    const response = await fetch(`/flask-api/odour-ratings?month=${month}&day=${day}&hour=${hour}&dayOfWeek=${dayOfWeek}`);
    if (!response.ok) {
      throw new Error(`Failed to retrieve odour ratings: ${response.statusText}`);
    }
    const predictions = await response.json();
    // Convert MODZCTA to lat/lng here

    return predictions;
  }
}

export default ml;