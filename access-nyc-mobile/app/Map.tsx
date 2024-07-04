import { View, StyleSheet } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';

import MapView, { Heatmap, MapMarker, Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import { MANHATTAN_LAT, MANHATTAN_LNG } from './utils/mapUtils';
import { GoogleMapContext, GoogleMapContextType } from './providers/MapProvider';
import * as Location from 'expo-location';

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    height: 700,
    width: 500,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default function Map() {
  const { onMapReady, markers, region, setRegion } = useContext(GoogleMapContext) as GoogleMapContextType;

  const handleLocationChanged = (e) => {
    console.log('Location changed');

    console.log(e.nativeEvent);
  };
  const handlePoiClicked = (e) => {
    console.log('Google only');

    console.log(e.nativeEvent);
  };
  const handleMarkerClicked = (e) => {
    console.log('Marker clicked');
    console.log(e.nativeEvent);
  };
  const handlePress = (e) => {
    console.log('Press');
    // TODO: write distance from you
    // Location.getCurrentPositionAsync().then(e => console.log(e.coords));
    console.log(e.nativeEvent);
  };

  const handleMapReady = (e) => {
    // TODO: is this working?
    onMapReady(e);
    Location.getCurrentPositionAsync().then((p) => setRegion({ latitude: p.coords.latitude, longitude: p.coords.longitude, latitudeDelta: 0.01, longitudeDelta: 0.01 }));
  };

  return (
    <View style={styles.container}>
        <MapView
        style={styles.map}
        initialRegion={{
          latitude: MANHATTAN_LAT,
          longitude: MANHATTAN_LNG,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        onMapReady={handleMapReady}
        onPoiClick={handlePoiClicked}
        onMarkerSelect={handleMarkerClicked}
        onPress={handlePress}
        mapType='mutedStandard'
        // KEEP THIS FALSE - you will enter an infinite loop if you turn true!!!!
        showsUserLocation={false}
        onUserLocationChange={handleLocationChanged}
        region={region}
        provider={PROVIDER_GOOGLE}
      >
        {markers.map((m) => m)}
        {/* TODO: getting heatmap to work is a very confusing process - it has taken me days and I got it work in a separate directory but i have no idea why or how. Going to save the heat map for last minute - maybe wont do it at all */}
        {/* <Heatmap /> */}
      </MapView>
    </View>
  );
}
