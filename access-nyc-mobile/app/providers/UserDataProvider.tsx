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
  const [errorMsg, setErrorMsg] = useState(null);
  const [permissionsLoaded, setPermissionsLoaded] = useState(false);

  const requestPermissions = async () => {
    const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
    if (foregroundStatus === 'granted') {
      const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
      if (backgroundStatus === 'granted') {
        if (await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME)) {
          await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
        }

        Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
          accuracy: Location.Accuracy.Balanced,
          distanceInterval: 50,
        });
      }
    }
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

  const getAuthStatus = () => {
    const permissions: HealthKitPermissions = {
      permissions: {
        read: [AppleHealthKit.Constants.Permissions.StepCount],
        write: [AppleHealthKit.Constants.Permissions.StepCount],
      },
    };

    AppleHealthKit.getAuthStatus(permissions, (err: string, results: HealthStatusResult) => {
      console.log(err, results);
    });
  };

  useEffect(() => {
    requestPermissions();
  }, []);

  useEffect(() => {
    AppleHealthKit.getAuthStatus;
  }, [permissionsLoaded]);

  useEffect(() => {
    getUserLocation();
  }, [permissionsLoaded]);

  const getUserLocation = async () => {
    let location = await Location.getCurrentPositionAsync({});
    setLocation(location);
  };

  useEffect(() => {
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

    AppleHealthKit.initHealthKit(permissions, (error: string) => {
      /* Called after we receive a response from the system */

      if (error) {
        console.log('[ERROR] Cannot grant permissions!');
      }

      /* Can now read or write to HealthKit */
      let startDate = new Date();
      startDate.setFullYear(startDate.getFullYear() - 1);

      const clinicalRecordsOptions = {
        startDate: startDate.toDateString(),
        type: ClinicalRecordType.ConditionRecord,
      };
      const clinicalRecordsPromise = getClinicalRecords(clinicalRecordsOptions);

      const environmentalAudioOptions: HealthInputOptions = {
        startDate: startDate.toISOString(), // required
        ascending: false, // optional; default false
        limit: 100, // optional; default no limit
      };
      const getAudioPromise = getEnvironmentalAudioExposure(environmentalAudioOptions);

      let options: HealthInputOptions = {
        unit: 'second' as HealthUnit, // optional; default 'second'
        startDate: startDate.toISOString(), // required
        ascending: false, // optional; default false
        limit: 100, // optional; default no limit
      };
      const getHeartRatePromise = getHeartRateVariability(options);
      const getBloodPressurePromise = getBloodPressure(options);
      Promise.all([clinicalRecordsPromise, getAudioPromise, getHeartRatePromise, getBloodPressurePromise]).then(([clinicalRecords, audioLevel, heartRate, bloodPressure]) => {
        postHealthData({
          userId: 'aprilpolubiec',
          clinicalRecords,
          audioLevel,
          heartRate,
          bloodPressure,
        });
      });
    });
  }, [permissionsLoaded]);

  return <UserDataContext.Provider value={{ location }}>{children}</UserDataContext.Provider>;
};

export { UserDataContext, UserDataProvider };
