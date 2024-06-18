import { API_HOST } from './utils';

export const getBusynessRatings = async (datetime) => {
  const response = await fetch(`${API_HOST}/busyness-ratings?` + new URLSearchParams({ datetime }));
  if (!response.ok) {
    const message = `An error has occurred: ${response.statusText}`;
    console.error(message);
    return;
  }
  const busynessRatings = await response.json();
  return busynessRatings;
};

export const getNoiseRatings = async (datetime) => {
  const response = await fetch(`${API_HOST}/noise-ratings?` + new URLSearchParams({ datetime }));
  if (!response.ok) {
    const message = `An error has occurred: ${response.statusText}`;
    console.error(message);
    return;
  }
  const noiseRatings = await response.json();
  return noiseRatings;
};

export const getOdourRatings = async (datetime) => {
  const response = await fetch(`${API_HOST}/odour-ratings?` + new URLSearchParams({ datetime }));
  if (!response.ok) {
    const message = `An error has occurred: ${response.statusText}`;
    console.error(message);
    return;
  }
  const odourRatings = await response.json();
  return odourRatings;
};
