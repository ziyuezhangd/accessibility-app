import { GoogleMap, Marker } from 'react-google-map-wrapper';
import { DEFAULT_ZOOM, MANHATTAN_LAT, MANHATTAN_LNG } from '../utils/MapUtils';
// Docs: https://pyjun01.github.io/react-google-map-wrapper/docs/introdution/
export const Map = () => {
  const handleMapClicked = (map, e) => {
    const isPlaceIconClicked = e.placeId !== undefined;
    const isLocationClicked = e.placeId === undefined;
    const latLng = e.latLng;
    const lat = latLng.lat();
    const lng = latLng.lng();
    if (isPlaceIconClicked) {
      // Do things
      console.log('Place clicked: ', e.placeId, lat, lng)
    }
    if (isLocationClicked) {
      // Do things
      console.log('Location clicked: ', lat, lng)
    }
  }
  return (
    <GoogleMap className='h-screen' zoom={DEFAULT_ZOOM} center={{ lat: MANHATTAN_LAT, lng: MANHATTAN_LNG }} onClick={handleMapClicked}>
      <Marker lat={MANHATTAN_LAT} lng={MANHATTAN_LNG} />
    </GoogleMap>
  );
};
