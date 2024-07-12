import { retryFetch } from '../utils/retryFetch';

export const getAccessibilityHighlightPlaces = async () => {
  try {
    const highlights = await retryFetch('/api/accessibility-highlight-place');
    return highlights;
  } catch(error) {
    console.error('Failed to fetch accessibility highlight places:', error.message);
    return null;
  }
};
