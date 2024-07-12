import { retryFetch } from '../utils/retryFetch';

/**
 *
 * Queries the backend for seating areas
 * @return {Promise<SeatingArea[]>} list of seating areas
 */
export const getSeatingAreas = async () => {
  try {
    const seatingAreas = await retryFetch('/api/seating-areas');
    return seatingAreas.map((seating) => {
      return new SeatingArea(seating);
    });
  } catch(error) {
    console.error('Failed to fetch seating areas:', error.message);
    return null;
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
