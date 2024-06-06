import { GoogleMap, Marker } from 'react-google-map-wrapper';
// Docs: https://pyjun01.github.io/react-google-map-wrapper/docs/introdution/
export const Map = () => {
  return (
    // you can pass props to map container element.
    // use Tailwind CSS or styled-components or anything to style your container.
    <GoogleMap className='h-[400px]' zoom={17} center={{ lat: 37.5709413, lng: 126.977787 }}>
      <Marker lat={37.5709413} lng={126.977787} />
    </GoogleMap>
  );
};
