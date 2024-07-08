import { PublicRestroom } from '../interfaces/PublicRestroom';

export const getPublicRestrooms = async (accessibility: 'all' | 'incl-partial' | 'full' = 'all'): Promise<PublicRestroom[]> => {
  console.log('Fetching restrooms');
  const response = await fetch('/restrooms?' + new URLSearchParams({ accessibility }));
  if (!response.ok) {
    const message = `An error has occurred: ${response.statusText}`;
    console.error(message);
    throw message;
  }

  const restrooms = await response.json();

  return restrooms;
};
