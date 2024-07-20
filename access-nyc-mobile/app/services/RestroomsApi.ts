import { PublicRestroom } from '../interfaces/PublicRestroom';
const apiUrl = process.env.EXPO_PUBLIC_API_URL;

export const getPublicRestrooms = async (accessibility: 'all' | 'incl-partial' | 'full' = 'all'): Promise<PublicRestroom[]> => {
  try {
    console.log('Fetching restrooms');
    const response = await fetch(`${apiUrl}/restrooms?` + new URLSearchParams({ accessibility }));
    if ('error' in response) {
      console.error('Error fetching restrooms: ', response.error);
      throw response.error;
    }
    const restrooms = await response.json();
    return restrooms;
  } catch (e) {
    console.error('Error getting restrooms: ', e);
    throw e;
  }
};
