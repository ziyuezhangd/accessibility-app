import { useState } from 'react';
import React from 'react';
import { GoogleMap, HeatmapLayer, Marker } from 'react-google-map-wrapper';
import { DEFAULT_ZOOM, MANHATTAN_LAT, MANHATTAN_LNG } from '../../utils/MapUtils';
import HelpIcon from './HelpIcon';
import { Box, useTheme } from '@mui/material';
import Dropdown from './Dropdown';

const busynessData = [
  { lat: 40.7831, lng: -73.9712 },
  { lat: 40.748817, lng: -73.985428 },
  // ... other data points
];

const noiseData = [
  { lat: 40.730610, lng: -73.935242 },
  { lat: 40.789623, lng: -73.959893 },
  // ... other data points
];

const odorData = [
  { lat: 40.712776, lng: -74.005974 },
  { lat: 40.706446, lng: -74.009370 },
  // ... other data points
];

const busynessGradient = [
  'rgba(0, 0, 255, 0)',
  'rgba(0, 0, 255, 1)'
];

const noiseGradient = [
  'rgba(255, 255, 0, 0)',
  'rgba(255, 0, 0, 1)'
];

const odorGradient = [
  'rgba(0, 255, 0, 0)',
  'rgba(0, 255, 0, 1)'
];

export const Map = () => {
  const theme = useTheme();
  const [heatMapData, setHeatMapData] = useState(busynessData);
  const [heatMapGradient, setHeatMapGradient] = useState(busynessGradient);

  const handleSelect = (item) => {
    switch (item.id) {
      case 1:
        setHeatMapData(busynessData);
        setHeatMapGradient(busynessGradient);
        break;
      case 2:
        setHeatMapData(noiseData);
        setHeatMapGradient(noiseGradient);
        break;
      case 3:
        setHeatMapData(odorData);
        setHeatMapGradient(odorGradient);
        break;
      default:
        setHeatMapData(busynessData);
        setHeatMapGradient(busynessGradient);
    }
  };

  const handleMapClicked = (map, e) => {
    const isPlaceIconClicked = e.placeId !== undefined;
    const isLocationClicked = e.placeId === undefined;
    const latLng = e.latLng;
    const lat = latLng.lat();
    const lng = latLng.lng();
    if (isPlaceIconClicked) {
      console.log('Place clicked: ', e.placeId, lat, lng);
    }
    if (isLocationClicked) {
      console.log('Location clicked: ', lat, lng);
    }
  };

  return (
    <Box sx={{ ...theme.mixins.toolbar, flexGrow: 1 }}>
      <GoogleMap
        style={{ height: '95vh', top: '7vh' }}
        zoom={DEFAULT_ZOOM}
        center={{ lat: MANHATTAN_LAT, lng: MANHATTAN_LNG }}
        onClick={handleMapClicked}
        options={{
          // Including the visualization library to use HeatmapLayer
          libraries: ['visualization']
        }}
      >
        <Dropdown onSelect={handleSelect} />
        <HelpIcon />
        <HeatmapLayer
          data={heatMapData.map(data => new window.google.maps.LatLng(data.lat, data.lng))}
          options={{
            radius: 50, // a more typical radius for visualization
            opacity: 0.6,
            gradient: heatMapGradient,
          }}
        />
        <Marker lat={MANHATTAN_LAT} lng={MANHATTAN_LNG} />
      </GoogleMap>
    </Box>
  );
};

export default Map;