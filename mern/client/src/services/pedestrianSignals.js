import { retryFetch } from '../utils/retryFetch';

/**
 *
 * Queries the backend for pedestrian signals
 * @return {Promise<PedestrianSignal[]>} list of pedestrian signals
 */
export const getPedestrianSignals = async () => {
  try {
    const signals = await retryFetch('/api/pedestrian-signals');
    return signals.map((signal) => {
      return new PedestrianSignal(signal);
    });
  } catch(error) {
    console.error('Failed to fetch pedestrian signals:', error.message);
    return null;
  }
};

export class PedestrianSignal {
  constructor({ latitude, longitude, width }) {
    this.latitude = parseFloat(latitude);
    this.longitude = parseFloat(longitude);
  }
}
