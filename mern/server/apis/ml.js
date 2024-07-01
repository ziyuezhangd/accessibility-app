const ml = {
  async getNoisePredictions(hour) {
    const response  = await fetch(`/flask-api/noise-ratings?hour=${hour}`);
    if (!response.ok) {
      throw new Error(`Failed to retrieve noise ratings: ${response.statusText}`);
    }
    const predictions = await response.json();
    // Convert segment ID to lat/lng here

    return predictions;
  },

  async getBusynessPredictions(month, day, hour, dayOfWeek) {
    const response = await fetch(`/flask-api/busyness-ratings?month=${month}&day=${day}&hour=${hour}&dayOfWeek=${dayOfWeek}`);
    if (!response.ok) {
      throw new Error(`Failed to retrieve busyness ratings: ${response.statusText}`);
    }
    const predictions = await response.json();
    // Convert segment ID to lat/lng here
    
    return predictions;
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