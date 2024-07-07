/**
 *
 * Queries the backend for pedestrian signals
 * @return {Promise<PedestrianSignal[]>} list of pedestrian signals
 */
export const getPedestrianSignals = async () => {
  const response = await fetch('/api/pedestrian-signals');
  if (!response.ok) {
    const message = `An error has occurred: ${response.statusText}`;
    console.error(message);
    return;
  }

  const signals = await response.json();

  return signals.map((signal) => {
    return new PedestrianSignal(signal);
  });
};

export class PedestrianSignal {
  constructor({ latitude, longitude, width }) {
    this.latitude = latitude;
    this.longitude = longitude;
  }
}
