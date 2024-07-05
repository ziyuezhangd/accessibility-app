import CloseIcon from '@mui/icons-material/Close';
import { Box, useTheme, Snackbar, IconButton, Button, useMediaQuery } from '@mui/material';
import dayjs from 'dayjs';
import { useState, useEffect, useContext } from 'react';
import { GoogleMap, HeatmapLayer, Polyline } from 'react-google-map-wrapper';
import { Control } from 'react-google-map-wrapper';
import Dropdown from './Dropdown';
import SearchBar from './SearchBar';
import { DataContext, DataProvider } from '../../providers/DataProvider';
import { GoogleMapContext } from '../../providers/GoogleMapProvider';
import { PlaceInfoUtilities } from '../../services/placeInfo';
import { getBusynessRatings, getNoiseRatings, getOdourRatings } from '../../services/ratings';
import { DEFAULT_ZOOM, MANHATTAN_LAT, MANHATTAN_LNG, MapLocation } from '../../utils/MapUtils';import PersistentDrawerLeft from '../detailsView/Drawer';
import HelpIcon from '../helpModal/HelpIcon';

const VITE_MAP_ID = import.meta.env.VITE_MAP_ID;

const PREDICTION_COLORS = {
  'A': '#44ce1b',
  0: '#44ce1b',
  'B': '#44ce1b',
  1: '#44ce1b',
  'C':'#bbdb44',
  2: '#bbdb44',
  'D':'#f7e379',
  3:'#f7e379',
  'E': '#f2a134',
  4:'#f2a134',
  'F':'#e51f1f',
  5:'#e51f1f',

};

export const Map = () => {
  // const [placeInfos, setPlaceInfos] = useState([]);
  const theme = useTheme();
  const {placesService, mapInstance, geocoder, onMapLoaded, markers, clearMarkers, createMarkers} = useContext(GoogleMapContext);
  const {placeInfos} = useContext(DataContext);
  const [busynessData, setBusynessData] = useState([]);
  const [noiseData, setNoiseData] = useState([]);
  const [odorData, setOdorData] = useState([]);
  const [polylineData, setPolylineData] = useState([]);
  const [heatmapData, setHeatmapData] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  /** @type {[MapLocation, React.Dispatch<React.SetStateAction<MapLocation>>]} */
  const [selectedPlace, setSelectedPlace] = useState(null);
  const handleSelect = (item) => {
    switch (item.id) {
    case 'busyness':
      setPolylineData(busynessData);
      setHeatmapData([]);
      break;
    case 'noise':
      setPolylineData(noiseData);
      setHeatmapData([]);
      break;
    case 'odor':
      setHeatmapData(odorData);
      setPolylineData([]);
      break;
    default:
      setHeatmapData([]);
      setPolylineData([]);
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
      'B': 5,
      'C': 10,
      'D': 15,
      'F': 20,
    };
    const busynessRatings = await getBusynessRatings(selectedDate);
    console.log('busynessRatings: ', busynessRatings);
    setBusynessData(busynessRatings);
    const noiseRatings = await getNoiseRatings(selectedDate);
    setNoiseData(noiseRatings);

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
          {heatmapData.length > 0 && (
            <HeatmapLayer
              data={heatmapData.filter(d => d.weight > 0).map((data) => ({
                location: new window.google.maps.LatLng(data.lat, data.lng),
                weight: data.weight,
              }))}
              gradient={[
                'rgba(0, 255, 0, 0)',// green
                'rgba(0, 255, 0, 1)',
                'rgba(255, 255, 0, 1)',// yellow
                'rgba(128, 0, 128, 1)'// purple
              ]}
              radius={90}
              opacity={0.6}
            />
          )}
          {polylineData.length > 0 && polylineData.map(({location, prediction}, i) => 
          // TODO: Need to have a different gradient for red-green color blindness
            (<Polyline
              key={i}
              path={[{lat: location.start.lat, lng: location.start.lng}, {lat: location.end.lat, lng: location.end.lng}, ]}
              strokeColor={PREDICTION_COLORS[prediction]}
              strokeOpacity={prediction === 0 || prediction === 'A' ? 0.5 : 1.0}
              strokeWeight={prediction === 0 || prediction === 'A' ? 2 : 5.0}
              geodesic
            />)
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