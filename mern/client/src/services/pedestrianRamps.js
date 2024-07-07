/**
 *
 * Queries the backend for pedestrian ramps
 * @return {Promise<PedestrianRamp[]>} list of pedestrian ramps
 */
export const getPedestrianRamps = async () => {
  const response = await fetch('/api/pedestrian-ramps');
  if (!response.ok) {
    const message = `An error has occurred: ${response.statusText}`;
    console.error(message);
    return;
  }

  const ramps = await response.json();

  return ramps.map((ramp) => {
    return new PedestrianRamp(ramp);
  });
};

export class PedestrianRamp {
  constructor({ latitude, longitude, width }) {
    this.latitude = parseFloat(latitude);
    this.longitude = parseFloat(longitude);
    this.width = width;
  }
}
