import axios from 'axios';
import { PlaceInfo } from '../interfaces/PlaceInfo';

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

export const getPlaceInfos = async (): Promise<PlaceInfo[]> => {
  try {
    console.log('Fetching place info');
    const response = await fetch(`${apiUrl}/place-infos`);
    const placeInfos: PlaceInfo[] = await response.json();
    if ('error' in placeInfos) {
      console.error(placeInfos.error);
      throw placeInfos.error;
    }
    return placeInfos;
  } catch (e) {
    console.log('Ahhh!', e);
    throw e;
  }
};
