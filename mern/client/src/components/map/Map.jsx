import { Box, useTheme } from '@mui/material';
import { GoogleMap, Marker } from 'react-google-map-wrapper';
import HelpIcon from './HelpIcon';
import { DEFAULT_ZOOM, MANHATTAN_LAT, MANHATTAN_LNG } from '../../utils/MapUtils';

// Docs: https://pyjun01.github.io/react-google-map-wrapper/docs/introdution/
export const Map = () => {

  const theme = useTheme();
  const handleMapClicked = (map, e) => {
    const isPlaceIconClicked = e.placeId !== undefined;
    const isLocationClicked = e.placeId === undefined;
    const latLng = e.latLng;
    const lat = latLng.lat();
    const lng = latLng.lng();
    if (isPlaceIconClicked) {
      // Do things
      console.log('Place clicked: ', e.placeId, lat, lng);
    }
    if (isLocationClicked) {
      // Do things
      console.log('Location clicked: ', lat, lng);
      //function to retrieve accessibility cloud point info
      fetchAccessibilityCloudInfo(lat, lng);
    }
  };
  //To make backend calls we can use fetch or a library like axios https://mayankt.hashnode.dev/connecting-frontend-with-backend-mern
  const fetchAccessibilityCloudInfo = async (lat, lng) => {
    const googleMapConfig = import.meta.env.VITE_GOOGLEMAP_KEY
    try {
      const response = await fetch(`http://localhost:5050/place-infos/googleMapsLocation?lat=${lat}&lng=${lng}`);
      if (!response) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      console.log('Accessibility cloud locations:', data);
  
      //now getting the place names based on the accessibility cloud names 
      const { AutocompleteSessionToken, AutocompleteSuggestion } = await google.maps.importLibrary('places');
      const googlePlacesAddresses = [];
      for (let i = 0; i < data.length; i++) {
        const placeName = data[i];
        const request = {
          input: placeName,
          location: { lat, lng },
          radius: 20, 
          key: googleMapConfig,
          sessionToken: new AutocompleteSessionToken(),
        };
        //get the autocomplete results
        try {
          const { suggestions } = await AutocompleteSuggestion.fetchAutocompleteSuggestions(request);
          if (suggestions.length > 0) {
            const firstPrediction = suggestions[0].placePrediction;
            googlePlacesAddresses.push({
              name: placeName,
              address: firstPrediction.text.toString()
            });
          } else {
            googlePlacesAddresses.push({
              name: placeName,
              address: null
            });
          }
        } catch (error) {
          console.error('Error fetching suggested results', error);
          googlePlacesAddresses.push({
            name: placeName,
            address: null
          });
        }
      }
  
      console.log('Google Places results:', googlePlacesAddresses);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
 
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

export default Map;