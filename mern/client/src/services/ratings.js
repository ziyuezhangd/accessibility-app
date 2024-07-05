/**
 * 
 * @param {string} datetime - The date-time string in ISO 8601 format without timezone (e.g., '2024-07-01T14:30:00') 
 * @returns {Array<{location: {lat: number, lng: number}, prediction: string}>} busynessRatings
 */
export const getBusynessRatings = async (datetime) => {
  const formatRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/;
  if(!formatRegex.test(datetime)) {
    const msg = 'datetime parameter should be in ISO 8601 format (e.g., \'2024-07-01T14:30:00\')';
    console.error(msg);
    return;
  }

  const response = await fetch('/api/busyness-ratings?' + new URLSearchParams({ datetime }));
  if (!response.ok) {
    const message = `An error has occurred: ${response.statusText}`;
    console.error(message);
    return;
  }
  const busynessRatings = await response.json();
  return busynessRatings;
};

/**
 * 
 * @param {string} datetime - The date-time string in ISO 8601 format without timezone (e.g., '2024-07-01T14:30:00') 
 * @returns {Array<{location: {lat: number, lng: number}, prediction: number}>} noiseRatings
 */
export const getNoiseRatingsHourly = async (datetime) => {
  const formatRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/;
  if(!formatRegex.test(datetime)) {
    const msg = 'datetime parameter should be in ISO 8601 format (e.g., \'2024-07-01T14:30:00\')';
    console.error(msg);
    return;
  }
  
  const response = await fetch('/api/noise-ratings/hourly?' + new URLSearchParams({ datetime }));
  if (!response.ok) {
    const message = `An error has occurred: ${response.statusText}`;
    console.error(message);
    return;
  }
  const noiseRatings = await response.json();
  return noiseRatings;
};

/**
 * 
 * @param {string} datetime - The date-time string in ISO 8601 format without timezone (e.g., '2024-07-01T14:30:00') 
 * @returns {Array<{location: {lat: number, lng: number}, prediction: number}>} noiseRatings
 */
export const getNoiseRatingsDaily = async (datetime) => {
  const formatRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/;
  if(!formatRegex.test(datetime)) {
    const msg = 'datetime parameter should be in ISO 8601 format (e.g., \'2024-07-01T14:30:00\')';
    console.error(msg);
    return;
  }
  
  const response = await fetch('/api/noise-ratings/daily?' + new URLSearchParams({ datetime }));
  if (!response.ok) {
    const message = `An error has occurred: ${response.statusText}`;
    console.error(message);
    return;
  }
  const noiseRatings = await response.json();
  return noiseRatings;
};

/**
 * 
 * @param {string} datetime - The date-time string in ISO 8601 format without timezone (e.g., '2024-07-01T14:30:00') 
 * @returns {Array<{location: {lat: number, lng: number}, prediction: string}>} odourRatings
 */
export const getOdourRatings = async (datetime) => {
  const formatRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/;
  if(!formatRegex.test(datetime)) {
    const msg = 'datetime parameter should be in ISO 8601 format (e.g., \'2024-07-01T14:30:00\')';
    console.error(msg);
    return;
  }
  
  const response = await fetch('/api/odour-ratings?' + new URLSearchParams({ datetime }));
  if (!response.ok) {
    const message = `An error has occurred: ${response.statusText}`;
    console.error(message);
    return;
  }
  const odourRatings = await response.json();
  return odourRatings;
};
