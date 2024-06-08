import { GoogleMap, Marker } from 'react-google-map-wrapper';
import { DEFAULT_ZOOM, MANHATTAN_LAT, MANHATTAN_LNG } from '../../utils/MapUtils';
import HelpIcon from './HelpIcon';
// Docs: https://pyjun01.github.io/react-google-map-wrapper/docs/introdution/
export const Map = () => {
  return (
    // you can pass props to map container element.
    // use Tailwind CSS or styled-components or anything to style your container.
    <GoogleMap className='h-screen' zoom={DEFAULT_ZOOM} center={{ lat: MANHATTAN_LAT, lng: MANHATTAN_LNG }}>
      <HelpIcon />
      <Marker lat={MANHATTAN_LAT} lng={MANHATTAN_LNG} />
    </GoogleMap>
  );
};
