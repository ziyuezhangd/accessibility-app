import { retryFetch } from '../utils/retryFetch';

/**
 * 
 * @param {string} datetime - The date-time string in ISO 8601 format without timezone (e.g., '2024-07-01T14:30:00') 
 * @returns {Promise<Array<{location: {lat: number, lng: number}, prediction: string}>>} busynessRatings
 */
export const getBusynessRatings = async (datetime) => {
  const formatRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/;
  if(!formatRegex.test(datetime)) {
    const msg = 'datetime parameter should be in ISO 8601 format (e.g., \'2024-07-01T14:30:00\')';
    console.error(msg);
    return;
  }

  try {
    const busynessRatings = await retryFetch('/api/busyness-ratings?' + new URLSearchParams({ datetime }));
    return busynessRatings;
  } catch(error) {
    console.error('Failed to fetch busyness ratings:', error.message);
    return null;
  }
};

/**
 * 
 * @param {string} datetime - The date-time string in ISO 8601 format without timezone (e.g., '2024-07-01T14:30:00') 
 * @returns {Promise<Array<{location: {lat: number, lng: number}, prediction: number}>>} noiseRatings
 */
export const getNoiseRatingsHourly = async (datetime) => {
  const formatRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/;
  if(!formatRegex.test(datetime)) {
    const msg = 'datetime parameter should be in ISO 8601 format (e.g., \'2024-07-01T14:30:00\')';
    console.error(msg);
    return;
  }

  try {
    const noiseRatings = await retryFetch('/api/noise-ratings/hourly?' + new URLSearchParams({ datetime }));
    return noiseRatings;
  } catch(error) {
    console.error('Failed to fetch noise ratings:', error.message);
    return null;
  }
};

/**
 * 
 * @param {string} datetime - The date-time string in ISO 8601 format without timezone (e.g., '2024-07-01T14:30:00') 
 * @returns {Promise<Array<{location: {lat: number, lng: number}, prediction: number}>>} noiseRatings
 */
export const getNoiseRatingsDaily = async (datetime) => {
  const formatRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/;
  if(!formatRegex.test(datetime)) {
    const msg = 'datetime parameter should be in ISO 8601 format (e.g., \'2024-07-01T14:30:00\')';
    console.error(msg);
    return;
  }

  try {
    const noiseRatings = await retryFetch('/api/noise-ratings/daily?' + new URLSearchParams({ datetime }));
    return noiseRatings;
  } catch(error) {
    console.error('Failed to fetch noise ratings:', error.message);
    return null;
  }
};

/**
 * 
 * @param {string} datetime - The date-time string in ISO 8601 format without timezone (e.g., '2024-07-01T14:30:00') 
 * @returns {Promise<Array<{location: {lat: number, lng: number}, prediction: string}>>} odourRatings
 */
export const getOdourRatings = async (datetime) => {
  const formatRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/;
  if(!formatRegex.test(datetime)) {
    const msg = 'datetime parameter should be in ISO 8601 format (e.g., \'2024-07-01T14:30:00\')';
    console.error(msg);
    return;
  }

  try {
    const odourRatings = await retryFetch('/api/odour-ratings?' + new URLSearchParams({ datetime }));
    return odourRatings;
  } catch(error) {
    console.error('Failed to fetch odour ratings:', error.message);
    return null;
  }
};
