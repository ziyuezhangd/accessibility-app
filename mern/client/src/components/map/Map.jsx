import { Box, useTheme } from '@mui/material';
import { useState, useEffect } from 'react';
import React from 'react';
import { GoogleMap, HeatmapLayer, Marker } from 'react-google-map-wrapper';
import Dropdown from './Dropdown';
import HelpIcon from './HelpIcon';
import { DEFAULT_ZOOM, MANHATTAN_LAT, MANHATTAN_LNG, busynessGradient, noiseGradient, odorGradient } from '../../utils/MapUtils';


const busynessData = [
  { lat: 40.7831, lng: -73.9712, weight: 2 },
  { lat: 40.748817, lng: -73.985428, weight: 1 },
  { lat: 40.73061, lng: -73.935242, weight: 3 },
  { lat: 40.712776, lng: -74.005974, weight: 4 },
  { lat: 40.758896, lng: -73.98513, weight: 2 },
  { lat: 40.748817, lng: -73.968285, weight: 3 },
  { lat: 40.729975, lng: -73.980003, weight: 1 },
  { lat: 40.7624, lng: -73.975661, weight: 4 },
  { lat: 40.771302, lng: -73.964422, weight: 2 },
  { lat: 40.748441, lng: -73.985664, weight: 5 },
];

const noiseData = [
  { lat: 40.73061, lng: -73.935242, weight: 3 },
  { lat: 40.789623, lng: -73.959893, weight: 1 },
  { lat: 40.776676, lng: -73.971321, weight: 4 },
  { lat: 40.754932, lng: -73.984016, weight: 2 },
  { lat: 40.748817, lng: -73.992428, weight: 5 },
  { lat: 40.7366, lng: -73.998321, weight: 2 },
  { lat: 40.712776, lng: -73.995974, weight: 3 },
  { lat: 40.780751, lng: -73.977182, weight: 1 },
  { lat: 40.764356, lng: -73.973028, weight: 4 },
  { lat: 40.743305, lng: -73.98821, weight: 5 },
];

const odorData = [
  { lat: 40.712776, lng: -74.005974, weight: 5 },
  { lat: 40.706446, lng: -74.00937, weight: 3 },
  { lat: 40.759011, lng: -73.984472, weight: 1 },
  { lat: 40.7433, lng: -74.003597, weight: 4 },
  { lat: 40.742054, lng: -74.003047, weight: 2 },
  { lat: 40.729517, lng: -73.998512, weight: 3 },
  { lat: 40.753182, lng: -73.982253, weight: 5 },
  { lat: 40.758896, lng: -73.96813, weight: 1 },
  { lat: 40.731233, lng: -73.994242, weight: 4 },
  { lat: 40.7243, lng: -73.99771, weight: 2 },
];

export const Map = () => {
  const theme = useTheme();
  const [heatMapData, setHeatMapData] = useState([]);
  const [heatMapGradient, setHeatMapGradient] = useState([]);
  const [mapInstance, setMapInstance] = useState(null);
  const [heatmapLayer, setHeatmapLayer] = useState(null);

  useEffect(() => {
    if (!mapInstance) return;

    if (heatmapLayer) {
      heatmapLayer.setMap(null); // Remove existing heatmap layer
    }

    if (heatMapData.length > 0) {
      const newHeatmapLayer = new window.google.maps.visualization.HeatmapLayer({
        data: heatMapData.map(data => ({
          location: new window.google.maps.LatLng(data.lat, data.lng),
          weight: data.weight
        })),
        map: mapInstance,
        gradient: heatMapGradient,
        radius: 50,
        opacity: 0.6,
      });

      setHeatmapLayer(newHeatmapLayer); // Store the new heatmap layer instance
    }
  }, [mapInstance, heatMapData, heatMapGradient]);

  const handleSelect = (item) => {
    switch (item.id) {
      case 'busyness':
        setHeatMapData(busynessData);
        setHeatMapGradient(busynessGradient);
        break;
      case 'noise':
        setHeatMapData(noiseData);
        setHeatMapGradient(noiseGradient);
        break;
      case 'odor':
        setHeatMapData(odorData);
        setHeatMapGradient(odorGradient);
        break;
      default:
        setHeatMapData([]);
        setHeatMapGradient([]);
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
        onLoad={map => setMapInstance(map)}
        options={{
          libraries: ['visualization'],
          
        }}
      >
        <Dropdown onSelect={handleSelect} />
        <HelpIcon />
        {heatMapData.length >= 0 && (
          <HeatmapLayer
            data={heatMapData.map(data => ({
              location: new window.google.maps.LatLng(data.lat, data.lng),
              weight: data.weight
            }))}
            options={{
              radius: 50,
              opacity: 0.6,
              gradient: heatMapGradient,
            }}
          />
        )}
        <Marker lat={MANHATTAN_LAT} lng={MANHATTAN_LNG} />
      </GoogleMap>
    </Box>
  );
};

export default Map;
