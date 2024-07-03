import _ from 'lodash';
import { createContext, useState, useEffect } from 'react';
import * as Location from 'expo-location';
import AppleHealthKit, { HealthValue, HealthKitPermissions } from 'react-native-health';

export interface UserDataContextType {
  location: Location.LocationObject | undefined;
}

const UserDataContext = createContext<UserDataContextType | null>(null);

const UserDataProvider = ({ children }: { children: React.ReactNode }) => {
  const [location, setLocation] = useState<Location.LocationObject>();
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }
      getUserLocation();
    })();
  }, []);

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
  }, []);

  return <UserDataContext.Provider value={{ location }}>{children}</UserDataContext.Provider>;
};

export { UserDataContext, UserDataProvider };
