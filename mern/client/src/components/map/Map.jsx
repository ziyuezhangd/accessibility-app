import { GoogleMap, Marker } from 'react-google-map-wrapper';
import { DEFAULT_ZOOM, MANHATTAN_LAT, MANHATTAN_LNG } from '../../utils/MapUtils';
import HelpIcon from './HelpIcon';
import { Box, useTheme } from '@mui/material';
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
