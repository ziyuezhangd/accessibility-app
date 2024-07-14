import axios, { AxiosResponse } from 'axios';
import { PlaceInfo } from '../interfaces/PlaceInfo';
import { BloodPressureSampleValue, HealthClinicalRecord, HealthValue } from 'react-native-health';

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

export const postHealthData = async (data: HealthDataPostRequest): Promise<AxiosResponse> => {
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
