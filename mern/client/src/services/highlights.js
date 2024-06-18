import { API_HOST } from './utils';

export const getAccessibilityHighlightPlaces = async () => {
  const response = await fetch(`${API_HOST}/accessibility-highlight-place`);
  if (!response.ok) {
    const message = `An error has occurred: ${response.statusText}`;
    console.error(message);
    return;
  }
  const busynessRatings = await response.json();
  return busynessRatings;
};
