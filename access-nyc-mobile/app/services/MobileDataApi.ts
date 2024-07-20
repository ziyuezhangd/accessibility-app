import axios, { AxiosResponse } from 'axios';
import { PlaceInfo } from '../interfaces/PlaceInfo';
import { BloodPressureSampleValue, HealthClinicalRecord, HealthValue } from 'react-native-health';

// TODO: should use prod
const apiUrl = process.env.EXPO_PUBLIC_LOCAL_API_URL;

export const postHealthData = async (data: HealthDataPostRequest): Promise<Response> => {
  try {
    const response = await fetch(`${apiUrl}/health-data`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    const resData = await response.json();
    return resData;
  } catch (e) {
    console.log('Ahhh!', e);
    throw e;
  }
};

export const postLocationData = async (data: LocationDataPostRequest): Promise<AxiosResponse> => {
  try {
    console.log('Posting location data');
    const response = await fetch(`${apiUrl}/location-data`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    const resData = await response.json();
    if (resData.error) {
      console.error(resData.error)
    }
    return resData;
  } catch (e) {
    console.log('Ahhh!', e);
    throw e;
  }
};

export interface HealthDataPostRequest {
  userId: string;
  clinicalRecords?: HealthClinicalRecord[];
  bloodPressure?: BloodPressureSampleValue[];
  heartRate?: HealthValue[];
  audioLevel?: HealthValue[];
}

export interface LocationDataPostRequest {
  latitude: number;
  longitude: number;
  altitude: number;
  accuracy: number;
  userId: string;
}
