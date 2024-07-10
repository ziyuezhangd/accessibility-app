/**
 *
 * Queries the backend for pedestrian ramps
 * @return {Promise<PedestrianRamp[]>} list of pedestrian ramps
 */
export const getPedestrianRamps = async (maxRetries = 3, retryDelay = 1000) => {
  let attempts = 0;
  while (attempts < maxRetries) {
    try {
      const response = await fetch('/api/pedestrian-ramps');
      if (!response.ok) {
        const message = `An error has occurred: ${response.statusText}`;
        throw new Error(message);
      }

      const ramps = await response.json();

      return ramps.map((ramp) => {
        return new PedestrianRamp(ramp);
      });
    } catch(error) {
      attempts += 1;
      console.error(error.message);
      if (attempts < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, retryDelay));
      } else {
        console.error('Max retries reached. Failed to fetch busyness ratings.');
        return;
      }
    }
  }
};

export class PedestrianRamp {
  constructor({ latitude, longitude, width }) {
    this.latitude = parseFloat(latitude);
    this.longitude = parseFloat(longitude);
    this.width = width;
  }
}
