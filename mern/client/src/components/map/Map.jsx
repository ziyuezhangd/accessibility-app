import CloseIcon from '@mui/icons-material/Close';
import { Box, Snackbar, IconButton, Button } from '@mui/material';
import _ from 'lodash';
import { useState, useContext } from 'react';
import { GoogleMap, Control } from 'react-google-map-wrapper';
import AccessibilityPointsLayer from './AccessibilityPointsLayer';
import DirectionsModal from './DirectionsModal';
import PlaceInfoLayer from './PlaceInfoLayer';
import PredictionDropdown from './PredictionDropdown';
import PredictionLayer from './PredictionLayer';
import RestroomLayers from './RestroomLayers';
import SearchBar from './SearchBar';
import StationsLayer from './StationsLayer';
import { DataContext } from '../../providers/DataProvider';
import { GoogleMapContext } from '../../providers/GoogleMapProvider';
import { DEFAULT_ZOOM, MANHATTAN_LAT, MANHATTAN_LNG, MapLocation } from '../../utils/MapUtils';
import CategoryFilter from '../detailsView/CategoryFilter';
import PersistentDrawerLeft from '../detailsView/Drawer';

const VITE_MAP_ID = import.meta.env.VITE_MAP_ID;

export const Map = () => {
  const {placesService, mapInstance, geocoder, onMapLoaded, createMarkers, markers, getDirections } = useContext(GoogleMapContext);
  const {placeInfos, polylineData} = useContext(DataContext);
  const [selectedPredictionType, setSelectedPredictionType] = useState('busyness');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [isDirectionsModalVisible, setIsDirectionsModalVisible] = useState(false);
  const [directionsModalPosition, setDirectionsModalPosition] = useState(null);
  const [directionsFrom, setDirectionsFrom] = useState(null);
  const [directionsTo, setDirectionsTo] = useState(null);

  /** @type {[MapLocation, React.Dispatch<React.SetStateAction<MapLocation>>]} */
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [selectedPlaceGrades, setSelectedPlaceGrades] = useState(null);
  const [filter, setFilter] = useState([]);

  const handleMapRightClicked = (map, e) => {
    // Show a dropdown menu
    setIsDirectionsModalVisible(true);
    setDirectionsModalPosition({lat: e.latLng.lat(), lng: e.latLng.lng()});
  };

  const handleDirectionsPositionSelected = async (type) => {
    if (type === 'from') {
      setDirectionsFrom(directionsModalPosition);
      if (directionsTo !== null) {
        getDirections(directionsModalPosition, directionsTo);
        resetDirectionsValues();
      }
    }
    if (type === 'to') {
      setDirectionsTo(directionsModalPosition);
      if (directionsFrom !== null) {
        getDirections(directionsFrom, directionsModalPosition);
        resetDirectionsValues();
      }
    }
  };

  const resetDirectionsValues = () => {
    setDirectionsFrom(null);
    setDirectionsTo(null);
  };

  // When a prediction type is selected, change the selected prediction type
  const handleVisualizationSelected = (item) => {
    if (item.name === 'none') {
      setSelectedPredictionType(null);
    } else {
      setSelectedPredictionType(item.id);
    }
  };
  
  // Update our polyine and heatmap data anytime:
  // 1. The selected prediction type changes
  // 2. New prediction data has been loaded
  const handlePolylineClicked = (polygon, event, predictionData) => {
    const latLng = event.latLng;
    const lat = latLng.lat();
    const lng = latLng.lng();
    geocoder.geocode({location: {lat, lng}}).then((response) => {
      if (response.results[0]) {
        setLocationData(lat, lng, response.results[0].place_id, response.results[0].formatted_address, false, predictionData);
      } else {
        window.alert('No results found');
      }
    });
  };

  const handleMapClicked = async (map, e) => {
    // If modal is visible but nothing is selected, just close it
    if (isDirectionsModalVisible) {
      //Just exit the modal
      setDirectionsModalPosition(null);
      setIsDirectionsModalVisible(false);
      return;
    }

    // Clear any existing markers
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
          setLocationData(lat, lng, e.placeId, place.name, true, null);
        } else {
          console.error('Oh no!');
        }
      });
    }
  };

  const setLocationData = (lat, lng, placeId, name, isPlace, predictionData) => {
    const selectedLocation = new MapLocation(lat, lng, placeId, name, isPlace);
    setSelectedPlace(selectedLocation);
    setSelectedPlaceGrades(predictionData);
    createMarkers([{lat: selectedLocation.lat, lng: selectedLocation.lng, title: name}], 'other', true);
    mapInstance.setZoom(DEFAULT_ZOOM + 5);
    mapInstance.setCenter({ lat: selectedLocation.lat, lng: selectedLocation.lng });
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

  return (
    <Box role='main'>
      <PersistentDrawerLeft 
        selectedLocation={selectedPlace}
        onLocationSelected={setLocationData}
        predictions={selectedPlaceGrades}
        placeInfos={placeInfos}
      />
      <Box data-test='google-map'
        sx={{ flexGrow: 1 }}>
        <GoogleMap
          style={{ height: '92vh', top: '7vh' }}
          zoom={DEFAULT_ZOOM}
          initialCenter={{ lat: MANHATTAN_LAT, lng: MANHATTAN_LNG }}
          onClick={handleMapClicked}
          onLoad={onMapLoaded}
          onContextmenu={handleMapRightClicked}
          options={{
            libraries: ['visualization', 'places'],
          }}
          mapOptions={{
            mapId: VITE_MAP_ID,
            fullscreenControl: false, // Disable fullscreen control
            streetViewControl: false, // Disable street view control
            zoomControl: false, // Disable zoom control
            mapTypeControl: false, // Disable map/satellite control
          }}
        >
          <Control position={google.maps.ControlPosition.RIGHT_TOP}>
            <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'end', pt: 2, pr: 2}}>
              <SearchBar onSearchEntered={handleSearchEntered} />
              <PredictionDropdown onSelect={handleVisualizationSelected} />
              <CategoryFilter onCategoriesSelected={(c) => setFilter(c)} />
            </Box>
          </Control>
          <AccessibilityPointsLayer/>
          <PlaceInfoLayer filter={filter}/>
          <StationsLayer/>
          <RestroomLayers/>
          <PredictionLayer 
            predictionType={selectedPredictionType}
            data={polylineData}
            onLineClicked={handlePolylineClicked}/>          
          {isDirectionsModalVisible && directionsModalPosition !== null && <DirectionsModal position={directionsModalPosition}
            onDirectionsPositionSelected={handleDirectionsPositionSelected}/>}
          {markers['other'].map(marker => marker)}
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

