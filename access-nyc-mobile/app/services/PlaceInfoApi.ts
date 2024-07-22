import axios from 'axios';
import { PlaceInfo } from '../interfaces/PlaceInfo';

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

export const getPlaceInfos = async (): Promise<PlaceInfo[]> => {
  try {
    console.log('Fetching place info');
    const response = await fetch(`${apiUrl}/place-infos`);
    if ('error' in response) {
      console.error('Error getting place infos: ', response.error);
      throw response.error;
    }
    const placeInfos: PlaceInfo[] = await response.json();
    return placeInfos;
  } catch (e) {
    console.log('Ahhh!', e);
    throw e;
  }
};
