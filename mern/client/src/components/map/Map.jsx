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
import { getBusynessRatings, getNoiseRatingsHourly, getNoiseRatingsDaily, getOdourRatings } from '../../services/ratings';
import { DEFAULT_ZOOM, MANHATTAN_LAT, MANHATTAN_LNG, MapLocation, busynessGradient, noiseGradient, odorGradient } from '../../utils/MapUtils';import PersistentDrawerLeft from '../detailsView/Drawer';
import HelpIcon from '../helpModal/HelpIcon';

const VITE_MAP_ID = import.meta.env.VITE_MAP_ID;

export const Map = () => {
  // const [placeInfos, setPlaceInfos] = useState([]);
  const theme = useTheme();
  const {placesService, mapInstance, geocoder, onMapLoaded, markers, clearMarkers, createMarkers} = useContext(GoogleMapContext);
  const {placeInfos} = useContext(DataContext);
  const [busynessData, setBusynessData] = useState([]);
  const [noiseData, setNoiseData] = useState([]);
  const [odorData, setOdorData] = useState([]);
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
    const gradeToInt = {
      'A': 0,
      'B': 1,
      'C': 3,
      'D': 6,
      'F': 10,
    };
    const busynessRatings = await getBusynessRatings(selectedDate);
    console.log('busynessRatings: ', busynessRatings);
    setBusynessData(busynessRatings.map(br => ({
      lat: parseFloat(br.location.lat), lng:parseFloat(br.location.lng), weight: gradeToInt[br.prediction] ,
    })));
    const noiseRatings = await getNoiseRatingsDaily(selectedDate);
    setNoiseData(noiseRatings.map(br => ({
      lat: parseFloat(br.location.lat), lng:parseFloat(br.location.lng), weight: parseFloat(br.prediction) ,
    })));
    console.log('noiseRatings: ', noiseRatings);
    const odourRatings = await getOdourRatings(selectedDate);
    setOdorData(odourRatings.map(br => ({
      lat: parseFloat(br.location.lat), lng:parseFloat(br.location.lng), weight: gradeToInt[br.prediction] ,
    })));
    console.log('odourRatings: ', odourRatings);
  };

  useEffect(() => {
    fetchData();
  }, []);

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
    <Box sx={{ display: 'flex' }}>
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
              opacity={1}
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