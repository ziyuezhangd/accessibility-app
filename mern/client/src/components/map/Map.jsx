import CloseIcon from '@mui/icons-material/Close';
import { Box, useTheme, Snackbar, IconButton, Button } from '@mui/material';
import { useState, useEffect } from 'react';
import { GoogleMap, HeatmapLayer, Marker, AdvancedMarker, MarkerClusterer } from 'react-google-map-wrapper';
import Dropdown from './Dropdown';
import { PlaceInfoUtilities, getPlaceInfos } from '../../services/placeInfo';
import { DEFAULT_ZOOM, MANHATTAN_LAT, MANHATTAN_LNG, busynessGradient, noiseGradient, odorGradient } from '../../utils/MapUtils';
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
  const [heatMapData, setHeatMapData] = useState([]);
  const [heatMapGradient, setHeatMapGradient] = useState([]);
  const [mapInstance, setMapInstance] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [placeInfos, setPlaceInfos] = useState([]);
  const theme = useTheme();

  useEffect(() => {
    console.log('Map instance loaded:', mapInstance);
  }, [mapInstance]);
  getPlaceInfos().then(setPlaceInfos);
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
    const isPlaceIconClicked = e.placeId !== undefined;
    const latLng = e.latLng;
    const lat = latLng.lat();
    const lng = latLng.lng();
    if (isPlaceIconClicked) {
      console.log('Place clicked: ', e.placeId, lat, lng);
      try {
        const PlacesService = await google.maps.importLibrary('places');
        const service = new PlacesService.PlacesService(map);

        const request = {
          placeId: e.placeId,
          fields: ['name', 'formatted_address', 'place_id', 'geometry', 'opening_hours']
        };

        service.getDetails(request, (place, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK && place) {
            console.log('place', place);
            setSelectedPlace({
              id: e.placeId,
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng(),
              name: place.name
            });
            setSnackbarOpen(true);
          } else {
            console.error('PlacesService failed: ', status);
          }
        });
      } catch (error) {
        console.error(error);
      }
    } else {
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

  useEffect(() => {
    const fetchData = async () => {
      const busynessRatings = await getBusynessRatings(new Date());
      console.log('busynessRatings: ', busynessRatings);
      const noiseRatings = await getNoiseRatings(new Date());
      console.log('noiseRatings: ', noiseRatings);
      const odourRatings = await getOdourRatings(new Date());
      console.log('odourRatings: ', odourRatings);
    };

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
        mapOptions={{
          mapId: VITE_MAP_ID,
        }}
        options={{
          libraries: ['visualization', 'places'],
        }}
      >
        <Dropdown onSelect={handleSelect} />
        <HelpIcon />
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
        <Marker lat={MANHATTAN_LAT}
          lng={MANHATTAN_LNG} />
        <MarkerClusterer> 
          {placeInfos.map((placeInfo, i) => {
            const {latitude, longitude} = placeInfo;
            const icon = PlaceInfoUtilities.getMarkerPNG(placeInfo);
            if (!icon) return null;
            return (
              <AdvancedMarker key = {i}
                lat={latitude}
                lng={longitude} >
                <img src={icon}
                  style={{ height: '45px'}} 
                  alt='Marker PNG' />
              </AdvancedMarker> 
            );
          })}
        </MarkerClusterer>
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
//https://stackoverflow.com/questions/25496625/add-local-image-as-custom-marker-in-google-maps
//https://developers.google.com/maps/documentation/javascript/custom-markers