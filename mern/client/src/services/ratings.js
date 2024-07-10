/**
 * 
 * @param {string} datetime - The date-time string in ISO 8601 format without timezone (e.g., '2024-07-01T14:30:00') 
 * @returns {Promise<Array<{location: {lat: number, lng: number}, prediction: string}>>} busynessRatings
 */
export const getBusynessRatings = async (datetime, maxRetries = 3, retryDelay = 1000) => {
  const formatRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/;
  if(!formatRegex.test(datetime)) {
    const msg = 'datetime parameter should be in ISO 8601 format (e.g., \'2024-07-01T14:30:00\')';
    console.error(msg);
    return;
  }

  let attempts = 0;
  while (attempts < maxRetries) {
    try {
      const response = await fetch('/api/busyness-ratings?' + new URLSearchParams({ datetime }));
      if (!response.ok) {
        const message = `An error has occurred: ${response.statusText}`;
        throw new Error(message);
      }
      const busynessRatings = await response.json();
      return busynessRatings;
    } catch (error) {
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

/**
 * 
 * @param {string} datetime - The date-time string in ISO 8601 format without timezone (e.g., '2024-07-01T14:30:00') 
 * @returns {Promise<Array<{location: {lat: number, lng: number}, prediction: number}>>} noiseRatings
 */
export const getNoiseRatingsHourly = async (datetime, maxRetries = 3, retryDelay = 1000) => {
  const formatRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/;
  if(!formatRegex.test(datetime)) {
    const msg = 'datetime parameter should be in ISO 8601 format (e.g., \'2024-07-01T14:30:00\')';
    console.error(msg);
    return;
  }

  let attempts = 0;
  while (attempts < maxRetries) {
    try {
      const response = await fetch('/api/noise-ratings/hourly?' + new URLSearchParams({ datetime }));
      if (!response.ok) {
        const message = `An error has occurred: ${response.statusText}`;
        throw new Error(message);
      }
      const noiseRatings = await response.json();
      return noiseRatings;
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

/**
 * 
 * @param {string} datetime - The date-time string in ISO 8601 format without timezone (e.g., '2024-07-01T14:30:00') 
 * @returns {Promise<Array<{location: {lat: number, lng: number}, prediction: number}>>} noiseRatings
 */
export const getNoiseRatingsDaily = async (datetime, maxRetries = 3, retryDelay = 1000) => {
  const formatRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/;
  if(!formatRegex.test(datetime)) {
    const msg = 'datetime parameter should be in ISO 8601 format (e.g., \'2024-07-01T14:30:00\')';
    console.error(msg);
    return;
  }
  
  let attempts = 0;
  while (attempts < maxRetries) {
    try {
      const response = await fetch('/api/noise-ratings/daily?' + new URLSearchParams({ datetime }));
      if (!response.ok) {
        const message = `An error has occurred: ${response.statusText}`;
        throw new Error(message);
      }
      const noiseRatings = await response.json();
      return noiseRatings;
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

/**
 * 
 * @param {string} datetime - The date-time string in ISO 8601 format without timezone (e.g., '2024-07-01T14:30:00') 
 * @returns {Promise<Array<{location: {lat: number, lng: number}, prediction: string}>>} odourRatings
 */
export const getOdourRatings = async (datetime, maxRetries = 3, retryDelay = 1000) => {
  const formatRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/;
  if(!formatRegex.test(datetime)) {
    const msg = 'datetime parameter should be in ISO 8601 format (e.g., \'2024-07-01T14:30:00\')';
    console.error(msg);
    return;
  }
  
  let attempts = 0;
  while (attempts < maxRetries) {
    try{
      const response = await fetch('/api/odour-ratings?' + new URLSearchParams({ datetime }));
      if (!response.ok) {
        const message = `An error has occurred: ${response.statusText}`;
        throw new Error(message);
      }
      const odourRatings = await response.json();
      return odourRatings;
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
