/**
 *
 * Queries the backend for pedestrian signals
 * @return {Promise<PedestrianSignal[]>} list of pedestrian signals
 */
export const getPedestrianSignals = async (maxRetries = 3, retryDelay = 1000) => {
  let attempts = 0;
  while (attempts < maxRetries) {
    try {
      const response = await fetch('/api/pedestrian-signals');
      if (!response.ok) {
        const message = `An error has occurred: ${response.statusText}`;
        throw new Error(message);
      }

      const signals = await response.json();

      return signals.map((signal) => {
        return new PedestrianSignal(signal);
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

export class PedestrianSignal {
  constructor({ latitude, longitude, width }) {
    this.latitude = parseFloat(latitude);
    this.longitude = parseFloat(longitude);
  }
}
