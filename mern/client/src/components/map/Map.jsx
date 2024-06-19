import { Box, useTheme } from '@mui/material';
import * as _ from 'lodash';
import { useEffect, useState } from 'react';
import { GoogleMap, Marker } from 'react-google-map-wrapper';
import HelpIcon from './HelpIcon';
import { getPlaceInfos } from '../../services/placeInfo';
import { getBusynessRatings, getNoiseRatings, getOdourRatings } from '../../services/ratings';
import { DEFAULT_ZOOM, MANHATTAN_LAT, MANHATTAN_LNG, calculateDistanceBetweenTwoCoordinates } from '../../utils/MapUtils';

// Docs: https://pyjun01.github.io/react-google-map-wrapper/docs/introdution/
export const Map = () => {
  const [placeInfos, setPlaceInfos] = useState([]);

  const theme = useTheme();
  const handleMapClicked = (map, e) => {
    const isPlaceIconClicked = e.placeId !== undefined;
    const isLocationClicked = e.placeId === undefined;
    const latLng = e.latLng;
    const lat = latLng.lat();
    const lng = latLng.lng();
    getNearestSubwayStations(lat, lng);
    if (isPlaceIconClicked) {
      // Do things
      console.log('Place clicked: ', e.placeId, lat, lng);
    }
    if (isLocationClicked) {
      // Do things
      console.log('Location clicked: ', lat, lng);
    }
  };

  // TODO: this should be moved into DrawerLocationDetails
  const getNearestSubwayStations = async (selectedLat, selectedLng) => {
    // There are a lot of duplicates - grab only the stations which contain the subway lines
    const stations = placeInfos.filter((place) => (place.category === 'subway_station' || place.category === 'train_station') && place.name && place.name.indexOf('(') > -1);
    // Get all stations within 500 meters
    let nearestStations = stations.filter(s => calculateDistanceBetweenTwoCoordinates(selectedLat, selectedLng, s.latitude, s.longitude) <= 500);
    if (nearestStations.length === 0) {
      nearestStations = [_.minBy(stations, s => calculateDistanceBetweenTwoCoordinates(selectedLat, selectedLng, s.latitude, s.longitude))];
    }

    console.log(`${nearestStations.length} stations within 500m: `, nearestStations);
  };

  const fetchData = async () => {
    const busynessRatings = await getBusynessRatings(new Date());
    console.log('busynessRatings: ', busynessRatings);
    const noiseRatings = await getNoiseRatings(new Date());
    console.log('noiseRatings: ', noiseRatings);
    const odourRatings = await getOdourRatings(new Date());
    console.log('odourRatings: ', odourRatings);
    getPlaceInfos().then(setPlaceInfos);
  };

  useEffect(() => {
    // This is just testing the rating queries
    fetchData();
  }, []);

  return (
    // you can pass props to map container element.
    // use Tailwind CSS or styled-components or anything to style your container.
    <Box sx={{ ...theme.mixins.toolbar, flexGrow: 1 }}>
      <GoogleMap style={{ height: '95vh', top: '7vh' }} zoom={DEFAULT_ZOOM} center={{ lat: MANHATTAN_LAT, lng: MANHATTAN_LNG }} onClick={handleMapClicked}>
        <HelpIcon />
        <Marker lat={MANHATTAN_LAT} lng={MANHATTAN_LNG} />
      </GoogleMap>
    </Box>
  );
};
