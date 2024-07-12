import { retryFetch } from '../utils/retryFetch';

/**
 *
 * Queries the backend for pedestrian ramps
 * @return {Promise<PedestrianRamp[]>} list of pedestrian ramps
 */
export const getPedestrianRamps = async () => {
  try {
    const ramps = await retryFetch('/api/pedestrian-ramps');
    return ramps.map((ramp) => {
      return new PedestrianRamp(ramp);
    });
  } catch(error) {
    console.error('Failed to fetch pedestrian ramps:', error.message);
    return null;
  }
};

export class PedestrianRamp {
  constructor({ latitude, longitude, width }) {
    this.latitude = parseFloat(latitude);
    this.longitude = parseFloat(longitude);
    this.width = width;
  }
}
