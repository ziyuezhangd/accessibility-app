import _ from 'lodash';
import { createContext, useState, useEffect } from 'react';

import * as Location from 'expo-location';
import { Modal, Text } from 'react-native-paper';

export interface UserLocationContextType {
  location: Location.LocationObject | undefined;
}

const UserLocationContext = createContext<UserLocationContextType | null>(null);

const UserLocationProvider = ({ children }: { children: React.ReactNode }) => {
  const [location, setLocation] = useState<Location.LocationObject>();
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      console.log(JSON.stringify(location));
      setLocation(location);
    })();
  }, []);

  let text = 'Waiting..';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }

  return <UserLocationContext.Provider value={{ location }}>{children}</UserLocationContext.Provider>;
};

export { UserLocationContext, UserLocationProvider };
