import { View, StyleSheet } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';

import MapView, { Heatmap, MapMarker, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { MANHATTAN_LAT, MANHATTAN_LNG } from './utils/mapUtils';
import { GoogleMapContext, GoogleMapContextType } from './providers/MapProvider';

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
  const { onMapReady, markers } = useContext(GoogleMapContext) as GoogleMapContextType;

  const handlePoiClicked = (e) => {
    console.log('Google only')

    console.log(e.nativeEvent)
  }
  const handleMarkerClicked = (e) => {
    console.log('Marker clicked')
    console.log(e.nativeEvent)
  }
  const handlePress = (e) => {
    console.log('Press')

    console.log(e.nativeEvent)
  }
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
        onMapReady={onMapReady}
        onPoiClick={handlePoiClicked}
        onMarkerSelect={handleMarkerClicked}
        onPress={handlePress}
        mapType='mutedStandard'
        // provider={PROVIDER_GOOGLE}
      >
        {markers.map((m) => m)}
        {/* TODO: getting heatmap to work is a very confusing process - it has taken me days and I got it work in a separate directory but i have no idea why or how. Going to save the heat map for last minute - maybe wont do it at all */}
        {/* <Heatmap /> */}
      </MapView>
    </View>
  );
}
