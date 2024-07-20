// TODO: consider using ts wrapper https://github.com/kingstinct/react-native-healthkit
export interface EnvironmentalAudioExposureResponse {
  value: number;
  sourceId: string;
  id: string;
  sourceName: string;
  startDate: string;
  endDate: string;
  metadata: {
    HKWasUserEntered: boolean;
  };
}
