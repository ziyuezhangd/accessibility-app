import CloseIcon from '@mui/icons-material/Close';
import { Box, useTheme, Snackbar, IconButton, Button, TextField, Autocomplete, useMediaQuery } from '@mui/material';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { GoogleMap, HeatmapLayer, Marker } from 'react-google-map-wrapper';
import Dropdown from './Dropdown';
import HelpIcon from './HelpIcon';
import { getPlaceInfos } from '../../services/placeInfo';
import { getBusynessRatings, getNoiseRatings, getOdourRatings } from '../../services/ratings';
import { DEFAULT_ZOOM, MANHATTAN_LAT, MANHATTAN_LNG, busynessGradient, noiseGradient, odorGradient } from '../../utils/MapUtils';
import SearchBar from './SearchBar';
import DateTimePicker from './DateTimePicker';
import dayjs from 'dayjs';
import { Control } from 'react-google-map-wrapper';

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
  const [placeInfos, setPlaceInfos] = useState([]);
  const [heatMapData, setHeatMapData] = useState([]);
  const [heatMapGradient, setHeatMapGradient] = useState([]);
  const [mapInstance, setMapInstance] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [searchResults, setSearchResults] = useState([]);
  const [searchInput, setSearchInput] = useState('');

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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

  const handleMapClicked = (map, e) => {
    const isPlaceIconClicked = e.placeId !== undefined;
    const isLocationClicked = e.placeId === undefined;
    const latLng = e.latLng;
    const lat = latLng.lat();
    const lng = latLng.lng();
    if (isPlaceIconClicked) {
      console.log('Place clicked: ', e, lat, lng);
      setSelectedPlace({ id: e.placeId, lat, lng });
      setSnackbarOpen(true);
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
    const busynessRatings = await getBusynessRatings(selectedDate);
    console.log('busynessRatings: ', busynessRatings);
    const noiseRatings = await getNoiseRatings(selectedDate);
    console.log('noiseRatings: ', noiseRatings);
    const odourRatings = await getOdourRatings(selectedDate);
    console.log('odourRatings: ', odourRatings);
    getPlaceInfos().then(setPlaceInfos);
  };

  const searchPlaces = async (query) => {
    try {
      const response = await axios.get(`https://accessibility.cloud/api/v2/places-infos?q=${query}&limit=10`, {
        headers: {
          'Authorization': `Bearer YOUR_API_KEY` // Replace with your actual API key
        }
      });
      setSearchResults(response.data);
    } catch (error) {
      console.error('Error fetching place infos:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedDate]);

  useEffect(() => {
    if (searchInput.length > 2) {
      searchPlaces(searchInput);
    } else {
      setSearchResults([]);
    }
  }, [searchInput]);

  const containerStyle = {
    display: 'flex',
    flexDirection: isMobile ? 'column' : 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '10px',
    width: '100%',
    padding: '10px',
  };

  const dateTimeHelpContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  };

  return (
    <Box sx={{ ...theme.mixins.toolbar, flexGrow: 1 }}>
      <GoogleMap
        style={{ height: isMobile ? '50vh' : '95vh', top: isMobile ? '10vh' : '7vh' }}
        zoom={DEFAULT_ZOOM}
        center={{ lat: MANHATTAN_LAT, lng: MANHATTAN_LNG }}
        onClick={handleMapClicked}
        onLoad={(map) => setMapInstance(map)}
        options={{
          libraries: ['places', 'visualization'],
        }}
      >
        <Box sx={containerStyle}>
          <Dropdown onSelect={handleSelect} />
          <Control position={google.maps.ControlPosition.TOP_CENTER}>
            <SearchBar mapInstance={mapInstance} setSelectedPlace={setSelectedPlace} />
          </Control>
          <Control position={google.maps.ControlPosition.TOP_RIGHT}>
            <Box sx={dateTimeHelpContainerStyle}>
              <DateTimePicker selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
              <HelpIcon />
            </Box>
          </Control>
        </Box>
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
        {selectedPlace && (
          <Marker lat={selectedPlace.lat} lng={selectedPlace.lng} />
        )}
      </GoogleMap>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message="Add this place to favorites?"
        action={
          <>
            <Button color="secondary" size="small" onClick={handleAddToFavorites}>
              Add to Favorites
            </Button>
            <IconButton size="small" aria-label="close" color="inherit" onClick={handleSnackbarClose}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </>
        }
      />
    </Box>
  );
};

export default Map;
