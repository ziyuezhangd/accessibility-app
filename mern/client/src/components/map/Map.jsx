import CloseIcon from '@mui/icons-material/Close';
import { Box, useTheme, Snackbar, IconButton, Button } from '@mui/material';
import * as _ from 'lodash';
import { useState, useEffect } from 'react';
import { GoogleMap, HeatmapLayer, Marker } from 'react-google-map-wrapper';
import Dropdown from './Dropdown';
import HelpIcon from './HelpIcon';
import { getBusynessRatings, getNoiseRatings, getOdourRatings } from '../../services/ratings';
import { DEFAULT_ZOOM, MANHATTAN_LAT, MANHATTAN_LNG, busynessGradient, noiseGradient, odorGradient, calculateDistanceBetweenTwoCoordinates } from '../../utils/MapUtils';

const busynessData = [
  // Your busyness data here...
];

const noiseData = [
  // Your noise data here...
];

const odorData = [
  // Your odor data here...
];

export const Map = () => {
  const [placeInfos, setPlaceInfos] = useState([]);
  const [heatMapData, setHeatMapData] = useState([]);
  const [heatMapGradient, setHeatMapGradient] = useState([]);
  const [mapInstance, setMapInstance] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const theme = useTheme();

  useEffect(() => {
    console.log('Map instance loaded:', mapInstance);
  }, [mapInstance]);

  const handleSelect = (item) => {
    switch (item.id) {
    case 'busyness':
      console.log('Setting busyness data and gradient');
      setHeatMapData(busynessData);
      setHeatMapGradient(busynessGradient);
      break;
    case 'noise':
      console.log('Setting noise data and gradient');
      setHeatMapData(noiseData);
      setHeatMapGradient(noiseGradient);
      break;
    case 'odor':
      console.log('Setting odor data and gradient');
      setHeatMapData(odorData);
      setHeatMapGradient(odorGradient);
      break;
    default:
      setHeatMapData([]);
      setHeatMapGradient([]);
    }
  };

  const handleMapClicked = async (map, e) => {
    const isPlaceIconClicked = e.placeId !== undefined;
    const isLocationClicked = e.placeId === undefined;
    const latLng = e.latLng;
    const lat = latLng.lat();
    const lng = latLng.lng();
    if (isPlaceIconClicked) {
      console.log('Place clicked: ', e.placeId, lat, lng);
      try {
        const map = new window.google.maps.Map(document.createElement('div'));
        
        const PlacesService = await google.maps.importLibrary('places');
        const Places = PlacesService.PlacesService;
        // const service = new window.google.maps.places.PlacesService(map);

        const request = {
          placeId: e.placeId,
          fields: ['name', 'formatted_address', 'place_id', 'geometry', 'opening_hours']
        };

        Places.getDetails(request, (place, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK && place) {
            console.log('place', place);
          } else {
            console.error('PlacesService failed: ', status);
          }
        });

        const placeDetails = await getPlaceDetails(e.placeId);
        setSelectedPlace({ id: e.placeId, lat, lng, name: placeDetails.name });
        setSnackbarOpen(true);
      } catch (error) {
        console.error(error);
      }
    }
    if (isLocationClicked) {
      console.log('Location clicked: ', lat, lng);
    }
  };

  const handleAddToFavorites = () => {
    if (selectedPlace) {
      console.log('Added to favorites:', selectedPlace);
      const event = new CustomEvent('favoriteAdded', { detail: selectedPlace });
      window.dispatchEvent(event);
      setSnackbarOpen(false);
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const fetchData = async () => {
    const busynessRatings = await getBusynessRatings(new Date());
    console.log('busynessRatings: ', busynessRatings);
    const noiseRatings = await getNoiseRatings(new Date());
    console.log('noiseRatings: ', noiseRatings);
    const odourRatings = await getOdourRatings(new Date());
    console.log('odourRatings: ', odourRatings);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Box sx={{ ...theme.mixins.toolbar, flexGrow: 1 }}>
      <GoogleMap
        style={{ height: '95vh', top: '7vh' }}
        zoom={DEFAULT_ZOOM}
        center={{ lat: MANHATTAN_LAT, lng: MANHATTAN_LNG }}
        onClick={handleMapClicked}
        onLoad={(map) => setMapInstance(map)}
        options={{
          libraries: ['visualization', 'places'], // Added 'places' library
        }}
      >
        <Dropdown onSelect={handleSelect} />
        <HelpIcon />
        {heatMapData.length > 0 && (
          <HeatmapLayer
            data={heatMapData.map(data => ({
              location: new window.google.maps.LatLng(data.lat, data.lng),
              weight: data.weight
            }))}
            gradient={heatMapGradient}
            radius={20}
            opacity={0.6}
          />
        )}
        <Marker lat={MANHATTAN_LAT}
          lng={MANHATTAN_LNG} />
      </GoogleMap>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message="Add this place to favorites?"
        action={(
          <>
            <Button color="secondary"
              size="small"
              onClick={handleAddToFavorites}>
              Add to Favorites
            </Button>
            <IconButton size="small"
              aria-label="close"
              color="inherit"
              onClick={handleSnackbarClose}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </>
        )}
      />
    </Box>
  );
};

export default Map;
