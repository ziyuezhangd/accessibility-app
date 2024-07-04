import _ from 'lodash';
import { createContext, useState, useEffect } from 'react';
import * as Location from 'expo-location';
import AppleHealthKit, { HealthValue, HealthKitPermissions } from 'react-native-health';
import * as TaskManager from 'expo-task-manager';

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
    console.log('Got some locations: ', locations);
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

  useEffect(() => {
    requestPermissions();
  }, []);

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
      const options = {
        startDate: new Date(2020, 1, 1).toISOString(),
      };

      AppleHealthKit.getHeartRateSamples(options, (callbackError: string, results: HealthValue[]) => {
        /* Samples are now collected from HealthKit */
      });
    });
  }, [permissionsLoaded]);


  return <UserDataContext.Provider value={{ location }}>{children}</UserDataContext.Provider>;
};

export { UserDataContext, UserDataProvider };
