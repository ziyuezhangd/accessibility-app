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
    return new PedestrianRamp({
      ...ramp,
      latitude: parseFloat(ramp.latitude),
      longitude: parseFloat(ramp.longitude),
    });
  });
};

export class PedestrianRamp {
  constructor({ latitude, longitude, width }) {
    this.latitude = latitude;
    this.longitude = longitude;
    this.width = width;
  }
}
