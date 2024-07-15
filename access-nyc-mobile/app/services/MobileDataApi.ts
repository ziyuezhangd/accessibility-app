import axios, { AxiosResponse } from 'axios';
import { PlaceInfo } from '../interfaces/PlaceInfo';
import { BloodPressureSampleValue, HealthClinicalRecord, HealthValue } from 'react-native-health';

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

export const postHealthData = async (data: HealthDataPostRequest): Promise<Response> => {
  try {
    console.log('Posting place info t0', `${apiUrl}/health-data`);
    const response = await fetch(`${apiUrl}/health-data/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    console.log(response)
    const resData = await response.json();
    return resData;
  } catch (e) {
    console.log('Ahhh!', e);
    throw e;
  }
};

export const postLocationData = async (data: HealthDataPostRequest): Promise<AxiosResponse> => {
  try {
    console.log('Posting place info');
    const res = await axios.post(`${apiUrl}/health-data`, data);
    return res;
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
  audioLevel: number;
  userId: string;
  clinicalRecords: HealthClinicalRecord[];
  heartRate: HealthValue[];
  bloodPressure: BloodPressureSampleValue[];
}
