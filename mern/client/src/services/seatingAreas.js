/**
 *
 * Queries the backend for seating areas
 * @return {Promise<SeatingArea[]>} list of seating areas
 */
export const getSeatingAreas = async (maxRetries = 3, retryDelay = 1000) => {
  let attempts = 0;
  while (attempts < maxRetries) {
    try {
      const response = await fetch('/api/seating-areas');
      if (!response.ok) {
        const message = `An error has occurred: ${response.statusText}`;
        throw new Error(message);
      }

      const seatingAreas = await response.json();

      return seatingAreas.map((seating) => {
        return new SeatingArea(seating);
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

export class SeatingArea {
  constructor({ latitude, longitude, seatType, category }) {
    this.latitude = parseFloat(latitude);
    this.longitude = parseFloat(longitude);
    this.seatType = seatType;
    this.category = category;
  }
}
