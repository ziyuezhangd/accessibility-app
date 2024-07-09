/**
 *
 * Queries the backend for seating areas
 * @return {Promise<SeatingArea[]>} list of seating areas
 */
export const getSeatingAreas = async () => {
  const response = await fetch('/api/seating-areas');
  if (!response.ok) {
    const message = `An error has occurred: ${response.statusText}`;
    console.error(message);
    return;
  }

  const seatingAreas = await response.json();

  return seatingAreas.map((seating) => {
    return new SeatingArea(seating);
  });
};

export class SeatingArea {
  constructor({ latitude, longitude, seatType, category }) {
    this.latitude = parseFloat(latitude);
    this.longitude = parseFloat(longitude);
    this.seatType = seatType;
    this.category = category;
  }
}
