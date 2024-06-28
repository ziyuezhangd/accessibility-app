import { MANHATTAN_LAT, MANHATTAN_LNG } from '../utils/MapUtils';

/**
 * Send feedback to be stored in our database
 * @param {Feedback} feedback
 */
export const postFeedback = async (feedback) => {
  // Call the API here
  const response = await fetch('/api/feedback', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(feedback),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error);
  }
};

/**
 * Class for representing a piece of feedback
 */
export class Feedback {
  /**
   * Create a feedback instance.
   * @param {string} name - The name of the user providing feedback.
   * @param {string} email - The email address of the user providing feedback.
   * @param {string} comment - The feedback comment provided by the user.
   * @param {Array<number>|null} coordinates [latitude, longitude] - The latitude of the feedback location.
   */
  constructor(name, email, comment, coordinates = null) {
    this.name = name;
    this.email = email;
    this.comment = comment;
    if (coordinates) {
      if (coordinates.length !== 2) {
        throw new Error('Coordinates must be an array with two value: latitude, longitude');
      }
      if (coordinates[0] > MANHATTAN_LAT + 1 || coordinates[0] < MANHATTAN_LAT - 1 || coordinates[1] > MANHATTAN_LNG + 1 || coordinates[1] < MANHATTAN_LNG - 1) {
        console.warn(`Are you sure that you've inputted the correct coordinates? Manhattan's center is [${MANHATTAN_LAT}, ${MANHATTAN_LNG}]. You entered [${coordinates[0]}, ${coordinates[1]}]`);
      }
    }
    this.coordinates = coordinates;
  }
}
