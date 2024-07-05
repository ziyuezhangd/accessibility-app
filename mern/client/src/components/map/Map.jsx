import CloseIcon from '@mui/icons-material/Close';
import { Box, Snackbar, IconButton, Button,useTheme, useMediaQuery } from '@mui/material';
import dayjs from 'dayjs';
import { useState, useEffect, useContext } from 'react';
import { GoogleMap, HeatmapLayer, Marker, MarkerClusterer } from 'react-google-map-wrapper';
import { Control } from 'react-google-map-wrapper';
import Dropdown from './Dropdown';
import SearchBar from './SearchBar';
import { DataContext, DataProvider } from '../../providers/DataProvider';
import { GoogleMapContext } from '../../providers/GoogleMapProvider';
import { PlaceInfoUtilities } from '../../services/placeInfo';
import { getPlaceInfos } from '../../services/placeInfo';
import { getBusynessRatings, getNoiseRatings, getOdourRatings } from '../../services/ratings';
import { DEFAULT_ZOOM, MANHATTAN_LAT, MANHATTAN_LNG, MapLocation, busynessGradient, noiseGradient, odorGradient } from '../../utils/MapUtils';import PersistentDrawerLeft from '../detailsView/Drawer';
import HelpIcon from '../helpModal/HelpIcon';

const VITE_MAP_ID = import.meta.env.VITE_MAP_ID;

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
  // const [placeInfos, setPlaceInfos] = useState([]);
  const theme = useTheme();
  const {placesService, mapInstance, geocoder, onMapLoaded, markers, clearMarkers, createMarkers} = useContext(GoogleMapContext);
  const {placeInfos} = useContext(DataContext);

  const [heatMapData, setHeatMapData] = useState([]);
  const [heatMapGradient, setHeatMapGradient] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  /** @type {[MapLocation, React.Dispatch<React.SetStateAction<MapLocation>>]} */
  const [selectedPlace, setSelectedPlace] = useState(null);
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

  const handleMapClicked = async (map, e) => {
    // Clear any existing markers
    clearMarkers();
    const isPlaceIconClicked = e.placeId !== undefined;
    const latLng = e.latLng;
    const lat = latLng.lat();
    const lng = latLng.lng();

    if (isPlaceIconClicked) {
      var request = {
        placeId: e.placeId,
        fields: ['name']
      };
      placesService.getDetails(request, (place, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          setSnackbarOpen(true);
          setLocationData(lat, lng, e.placeId, place.name, true);
        } else {
          console.error('Oh no!');
        }
      });
    } else {
      geocoder.geocode({location: {lat, lng}}).then((response) => {
        if (response.results[0]) {
          setLocationData(lat, lng, response.results[0].place_id, response.results[0].formatted_address, false);
        } else {
          window.alert('No results found');
        }
      });
    }
  };

  useEffect(() => {
    const showAccessibilityMarkers = (placeInfos) => {
      const markers = placeInfos.map(placeInfo => {
        const imgSrc = PlaceInfoUtilities.getMarkerPNG(placeInfo);
        if (imgSrc === null){
          return null;
        }
        else{
          return {
            lat: placeInfo.latitude,
            lng: placeInfo.longitude,
            imgSrc: PlaceInfoUtilities.getMarkerPNG(placeInfo),
            imgSize: '30px', 
            imgAlt: PlaceInfoUtilities.name,
          }; 
        }

      });
      const filteredMarkers =markers.filter( (marker) => marker !== null); 

      createMarkers(filteredMarkers);
      console.log(filteredMarkers);
    };

    if (placeInfos) {
      showAccessibilityMarkers(placeInfos);
    }
  }, [placeInfos]);

  const setLocationData = (lat, lng, placeId, name, isPlace) => {
    const selectedLocation = new MapLocation(lat, lng, placeId, name, isPlace);
    setSelectedPlace(selectedLocation);
    createMarkers([{lat: selectedLocation.lat, lng: selectedLocation.lng}]);
    mapInstance.setZoom(DEFAULT_ZOOM + 5);
  };

  const handleAddToFavorites = () => {
    if (selectedPlace) {
      console.log('Added to favorites:', selectedPlace);
      const event = new CustomEvent('favoriteAdded', { detail: selectedPlace });
      window.dispatchEvent(event);
      setSnackbarOpen(false);
    }
  };

  const handleSearchEntered = (selected) => {
    var request = {
      placeId: selected.id,
      fields: ['name']
    };
    placesService.getDetails(request, (place, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        setSnackbarOpen(true);
        setLocationData(selected.lat, selected.lng, selected.id, place.name, true);
      } else {
        console.error('Oh no!');
      }
    });
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const fetchData = async () => {
    // const busynessRatings = await getBusynessRatings(selectedDate);
    // console.log('busynessRatings: ', busynessRatings);
    // const noiseRatings = await getNoiseRatings(selectedDate);
    // console.log('noiseRatings: ', noiseRatings);
    // const odourRatings = await getOdourRatings(selectedDate);
    // console.log('odourRatings: ', odourRatings);
    // getPlaceInfos().then(setPlaceInfos);
  };

  useEffect(() => {
    fetchData();
  }, [selectedDate]);

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
    <Box sx={{ display: 'flex' }}
      role='main'>
      <PersistentDrawerLeft selectedLocation={selectedPlace}/>
      <Box sx={{ ...theme.mixins.toolbar, flexGrow: 1 }}>
        <GoogleMap
          style={{ height: '95vh', top: '7vh' }}
          zoom={DEFAULT_ZOOM}
          center={selectedPlace === null ? { lat: MANHATTAN_LAT, lng: MANHATTAN_LNG } : { lat: selectedPlace.lat, lng: selectedPlace.lng }}
          onClick={handleMapClicked}
          onLoad={onMapLoaded}
          options={{
            libraries: ['visualization', 'places'],
          }}
          mapOptions={{
            mapId: VITE_MAP_ID,
          }}
        >
          <Box sx={containerStyle}>
            <Dropdown onSelect={handleSelect} />
            <Control position={google.maps.ControlPosition.TOP_CENTER}>
              <SearchBar 
                onSearchEntered={handleSearchEntered}/>
            </Control>
            <Control position={google.maps.ControlPosition.TOP_RIGHT}>
              <HelpIcon />
            </Control>
          </Box>
          {heatMapData.length > 0 && (
            <HeatmapLayer
              data={heatMapData.map((data) => ({
                location: new window.google.maps.LatLng(data.lat, data.lng),
                weight: data.weight,
              }))}
              gradient={heatMapGradient}
              radius={20}
              opacity={0.6}
            />
          )}
          {markers.map(marker => marker)}
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
    </Box>
  );
};

export default Map;
//https://stackoverflow.com/questions/25496625/add-local-image-as-custom-marker-in-google-maps
//https://developers.google.com/maps/documentation/javascript/custom-markers