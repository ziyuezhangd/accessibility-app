import _ from 'lodash';
import { createContext, useState, useEffect } from 'react';
import * as Location from 'expo-location';
import AppleHealthKit, { HealthValue, HealthKitPermissions, HealthInputOptions, HealthStatusResult, HealthUnit, ClinicalRecordType, HealthClinicalRecord, HealthClinicalRecordOptions, BloodPressureSampleValue } from 'react-native-health';
import * as TaskManager from 'expo-task-manager';
import { EnvironmentalAudioExposureResponse } from '../interfaces/AppleHealthKit';
import { postHealthData } from '../services/MobileDataApi';

export interface UserDataContextType {
  location: Location.LocationObject | undefined;
}

const UserDataContext = createContext<UserDataContextType | null>(null);

const LOCATION_TASK_NAME = 'background-location-task';
TaskManager.defineTask(LOCATION_TASK_NAME, ({ data, error }) => {
  if (error) {
    // Error occurred - check `error.message` for more details.
    console.error('Failed to define task: ', error.message);
    return;
  }
  if (data) {
    const { locations } = data;
    const { coords, timestamp } = locations[0];
    const { latitude, longitude, accuracy, altitude, speed } = coords;

    AppleHealthKit.isAvailable((err: Object, available: boolean) => {
      if (err) {
        console.log('error initializing Healthkit: ', err);
        return;
      }
      if (!available) {
        console.log('Healthkit data not available for user');
        return;
      }
    });
    console.log('User data updated: ');
  }
});

const UserDataProvider = ({ children }: { children: React.ReactNode }) => {
  const [location, setLocation] = useState<Location.LocationObject>();
  const [permissionsLoaded, setPermissionsLoaded] = useState(false);
  const [clinicalRecords, setClinicalRecords] = useState<HealthClinicalRecord[]>([]);

  // On mount, request permissions for location tracking and health data
  useEffect(() => {
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
    if (foregroundStatus === 'granted') {
      // Need to check foreground first
      const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
      if (backgroundStatus === 'granted') {
        const isBackgroundTaskRunning = await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);
        if (!isBackgroundTaskRunning) {
          Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
            accuracy: Location.Accuracy.Balanced,
            distanceInterval: 50,
          });
        }

        // Now get healthkit authorization
        const permissions: HealthKitPermissions = {
          permissions: {
            read: [
              AppleHealthKit.Constants.Permissions.BloodPressureDiastolic,
              AppleHealthKit.Constants.Permissions.BloodPressureSystolic,
              AppleHealthKit.Constants.Permissions.HeartRate,
              AppleHealthKit.Constants.Permissions.HeartRateVariability,
              AppleHealthKit.Constants.Permissions.EnvironmentalAudioExposure,
              AppleHealthKit.Constants.Permissions.ConditionRecord,
            ],
            write: [],
          },
        };
        await getAuthStatus(permissions);
      }
    }
    setPermissionsLoaded(true);
  };

  // When permissions load, initialize the health kit and send a post
  useEffect(() => {
    if (!permissionsLoaded) return;
    /* Permission options */
    const permissions = {
      permissions: {
        read: [
          AppleHealthKit.Constants.Permissions.HeartRate,
          AppleHealthKit.Constants.Permissions.HeartRateVariability,
          AppleHealthKit.Constants.Permissions.MedicationRecord,
          AppleHealthKit.Constants.Permissions.EnvironmentalAudioExposure,
          AppleHealthKit.Constants.Permissions.BloodPressureDiastolic,
          AppleHealthKit.Constants.Permissions.BloodPressureSystolic,
        ],
      },
    } as HealthKitPermissions;

    AppleHealthKit.initHealthKit(permissions, async (error: string) => {
      if (error) {
        console.log('[ERROR] Cannot grant permissions!');
      }

      sendHealthDataToDB();
    });
  }, [permissionsLoaded]);

  const sendHealthDataToDB = async () => {
    let records = [];
    if (!clinicalRecords) {
      // Get the last 10 years of clinical records
      let clinicalRecordsStartDate = new Date();
      clinicalRecordsStartDate.setFullYear(clinicalRecordsStartDate.getFullYear() - 10);

      const clinicalRecordsOptions = {
        startDate: clinicalRecordsStartDate.toDateString(),
        type: ClinicalRecordType.ConditionRecord,
      };
      const queriedClinicalRecords = await getClinicalRecords(clinicalRecordsOptions);
      setClinicalRecords(queriedClinicalRecords);
      records = queriedClinicalRecords;
    } else {
      records = clinicalRecords;
    }

    let healthDataStartDate = new Date();
    healthDataStartDate.setMonth(healthDataStartDate.getMonth() - 1);
    // Get the last 1 month of environmental audio data
    const healthDataOptions: HealthInputOptions = {
      startDate: healthDataStartDate.toISOString(), // required
      ascending: false, // optional; default false
      limit: 100, // optional; default no limit
    };
    const getAudioPromise = getEnvironmentalAudioExposure(healthDataOptions);
    const getHeartRatePromise = getHeartRateVariability(healthDataOptions);
    const getBloodPressurePromise = getBloodPressure(healthDataOptions);

    Promise.all([getAudioPromise, getHeartRatePromise, getBloodPressurePromise]).then(([audioLevel, heartRate, bloodPressure]) => {
      postHealthData({
        userId: 'aprilpolubiec',
        clinicalRecords: records,
        audioLevel,
        heartRate,
        bloodPressure,
      });
    });
  };

  // When permissions load, get the user's current location
  useEffect(() => {
    if (permissionsLoaded) {
      getUserLocation();
    }
  }, [permissionsLoaded]);

  const getUserLocation = async () => {
    let location = await Location.getCurrentPositionAsync({});
    setLocation(location);
  };

  //#region Apple Health Kit functions
  const getAuthStatus = (permissions: HealthKitPermissions): Promise<HealthStatusResult> => {
    return new Promise((resolve, reject) => {
      AppleHealthKit.getAuthStatus(permissions, (err: string, results: HealthStatusResult) => {
        if (err) {
          reject(err);
        }
        resolve(results);
      });
    });
  };

  const getEnvironmentalAudioExposure = (options: HealthInputOptions): Promise<HealthValue[]> => {
    return new Promise((resolve, reject) => {
      AppleHealthKit.getEnvironmentalAudioExposure(options, (err: string, results: HealthValue[]) => {
        if (err) {
          reject(err);
        }
        resolve(results);
      });
    });
  };

  const getClinicalRecords = (options: HealthClinicalRecordOptions): Promise<HealthClinicalRecord[]> => {
    return new Promise((resolve, reject) => {
      AppleHealthKit.getClinicalRecords(options, (err: string, results: HealthClinicalRecord[]) => {
        if (err) {
          reject(err);
        }
        resolve(results);
      });
    });
  };

  const getHeartRateVariability = (options: HealthInputOptions): Promise<HealthValue[]> => {
    return new Promise((resolve, reject) => {
      AppleHealthKit.getHeartRateVariabilitySamples(options, (err: Object, results: Array<HealthValue>) => {
        if (err) {
          reject(err);
        }
        resolve(results);
      });
    });
  };

  const getBloodPressure = (options: HealthInputOptions): Promise<BloodPressureSampleValue[]> => {
    return new Promise((resolve, reject) => {
      AppleHealthKit.getBloodPressureSamples(options, (err: Object, results: Array<BloodPressureSampleValue>) => {
        if (err) {
          reject(err);
        }
        resolve(results);
      });
    });
  };
  //#endregion

  return <UserDataContext.Provider value={{ location }}>{children}</UserDataContext.Provider>;
};

export { UserDataContext, UserDataProvider };
