import { getCurrentTimeInNewYork } from '../utils/dateTime';
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
  return data; // Ensure to return the data
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
   * @param {int} age - The age of the user providing feedback.
   * @param {string} gender - The gender of the user providing feedback.
   * @param {string} conditions - The conditions mentioned in the feedback.
   * @param {Array<number>|null} coordinates [latitude, longitude] - The latitude and longitude of the feedback location.
   * @param {Date} date - The date and time when user provides the feedback.
   */
  constructor(name, email, comment, age, gender, conditions, coordinates = null) {
    this.name = name;
    this.email = email;
    this.comment = comment;
    this.age = age;
    this.gender = gender;
    this.conditions = conditions;
    if (coordinates) {
      if (coordinates.length !== 2) {
        throw new Error('Coordinates must be an array with two value: latitude, longitude');
      }
      if (coordinates[0] > MANHATTAN_LAT + 1 || coordinates[0] < MANHATTAN_LAT - 1 || coordinates[1] > MANHATTAN_LNG + 1 || coordinates[1] < MANHATTAN_LNG - 1) {
        console.warn(`Are you sure that you've inputted the correct coordinates? Manhattan's center is [${MANHATTAN_LAT}, ${MANHATTAN_LNG}]. You entered [${coordinates[0]}, ${coordinates[1]}]`);
      }
    }
    this.coordinates = coordinates;
    this.date = getCurrentTimeInNewYork();
  }
}
