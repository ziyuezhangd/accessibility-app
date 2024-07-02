import _ from 'lodash';
import React, { createContext, useState, useEffect } from 'react';
import { Callout, LatLng, MapMarker, Marker } from 'react-native-maps';
import { MarkerConfig } from '../interfaces/Map';
import { Icon, Text, useTheme } from 'react-native-paper';
import { View, StyleSheet } from 'react-native';

interface GoogleMapContextType {
  isMapReady: boolean;
  onMapReady: () => void;
  markers: React.JSX.Element[];
  createMarkers: (markerConfigs: MarkerConfig[], shouldOverwriteExisting?: boolean) => void;
  removeMarkers: (latLngs: LatLng[]) => void;
}

const GoogleMapContext = createContext<GoogleMapContextType | null>(null);
// https://github.com/react-native-maps/react-native-maps?tab=readme-ov-file#take-snapshot-of-map
// TODO: https://github.com/react-native-maps/react-native-maps?tab=readme-ov-file#take-snapshot-of-map
const GoogleMapProvider = ({ children }: { children: React.ReactNode }) => {
  const theme = useTheme();
  const [isMapReady, setIsMapReady] = useState<boolean>(false);
  const [markers, setMarkers] = useState<React.JSX.Element[]>([]);

  const handleMapReady = () => {
    setIsMapReady(true);
  };

  const createMarkers = (markerConfigs: MarkerConfig[], shouldOverwriteExisting: boolean = false): void => {
    const markersToCreate: React.JSX.Element[] = shouldOverwriteExisting ? [] : markers;
    for (const config of markerConfigs) {
      const { imgSrc } = config;
      let { lat, lng } = config;
      const latLng: LatLng = { latitude: lat, longitude: lng };
      if (imgSrc) {
        const { key, icon } = config;
        const marker = (
          <Marker key={key} coordinate={latLng} image={{ uri: imgSrc }}>
            <Callout>{icon && <Icon source={icon} size={20} />}</Callout>
          </Marker>
        );
        markersToCreate.push(marker);
      } else {
        let { color, title, description, key, icon } = config;
        color = color || '#FF0000';
        const marker = (
          <Marker key={key} pinColor={color} coordinate={latLng} title={title} description={description}>
            <Callout>
              <View style={styles.titleContainer}>
                <Text variant='titleSmall'>{title}</Text>
                {icon && <Icon source={icon} size={20} color={theme.colors.primary} />}
              </View>
              <Text>{description}</Text>
            </Callout>
          </Marker>
        );
        markersToCreate.push(marker);
      }
    }
    setMarkers([...markersToCreate]);
    console.log(`Created ${markersToCreate.length} markers`);
  };

  const removeMarkers = (latLngs: LatLng[]): void => {
    for (const latLng of latLngs) {
      const markersToFilter = [...markers];
      _.remove(markersToFilter, (m: any) => m.lat === latLng.latitude && m.lng === latLng.longitude);
      setMarkers(markersToFilter);
    }
  };

  /**
   * Remove all markers from the map.
   */
  const clearMarkers = () => {
    console.log('Clearing markers');
    setMarkers([]);
  };

  return <GoogleMapContext.Provider value={{ isMapReady, onMapReady: handleMapReady, createMarkers, removeMarkers, markers }}>{children}</GoogleMapContext.Provider>;
};

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
  },
});

export { GoogleMapContext, GoogleMapProvider, GoogleMapContextType };
