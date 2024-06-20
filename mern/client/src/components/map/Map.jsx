import { Box, useTheme } from '@mui/material';
import { GoogleMap, InfoWindow, Marker } from 'react-google-map-wrapper';
import HelpIcon from './HelpIcon';
import { DEFAULT_ZOOM, MANHATTAN_LAT, MANHATTAN_LNG } from '../../utils/MapUtils';
import MapContent from './MapContent';
import { MapContainer, TileLayer, Marker as LeafletMarker, Popup, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

import { useState } from 'react';

// Docs: https://pyjun01.github.io/react-google-map-wrapper/docs/introdution/
const Maps = ({ selectedPOI }) => {

  const [markers, setMarkers] = useState([]);



  const MapEvents = () => {

    useMapEvents({

      click(e) {

        const newMarker = {

          lat: e.latlng.lat,

          lng: e.latlng.lng,

        };

        setMarkers((prevMarkers) => [...prevMarkers, newMarker]);

      },

    });

    return null;

  };



  const MapUpdater = ({ selectedPOI }) => {

    const map = useMap();



    useEffect(() => {

      if (selectedPOI) {

        map.setView([selectedPOI.lat, selectedPOI.lng], 13); // Adjust the zoom level as needed

      }

    }, [selectedPOI, map]);



    return null;

  };



 

};
export const Map = () => {
  const theme = useTheme();
  const [isOpen, setOpen] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);

  const handleMapClicked = (map, e) => {
    const isPlaceIconClicked = e.placeId !== undefined;
    const isLocationClicked = e.placeId === undefined;

    const latLng = e.latLng;
    const lat = latLng.lat();
    const lng = latLng.lng();
    if (isPlaceIconClicked) {
      // Do things
      console.log('Place clicked: ', e, lat, lng);
      setSelectedPlace(e);
      setOpen(true);  // Open the InfoWindow when a place is clicked
    }
    if (isLocationClicked) {
      // Do things
      console.log('Location clicked: ', lat, lng);
      setOpen(false);  // Close the InfoWindow when a location is clicked
    }
  };

  const handleMarkerClick = () => {
    setOpen(!isOpen);  // Toggle the InfoWindow visibility
  };

  return (

    
    // you can pass props to map container element.
    // use Tailwind CSS or styled-components or anything to style your container.
    <Box sx={{ ...theme.mixins.toolbar, flexGrow: 1 }}>
      
    <MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: '500px', width: '100%' }}>

<TileLayer

  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"

  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'

/>

{markers.map((marker, index) => (

  <Marker key={index} position={[marker.lat, marker.lng]}>

    <Popup>

      A pretty CSS3 popup. <br /> Easily customizable.

    </Popup>

  </Marker>

))}

<MapEvents />

{selectedPOI && <MapUpdater selectedPOI={selectedPOI} />}

</MapContainer>
      <GoogleMap style={{ height: '95vh', top: '7vh' }} zoom={DEFAULT_ZOOM} center={{ lat: MANHATTAN_LAT, lng: MANHATTAN_LNG }} onClick={handleMapClicked}>
        {
          selectedPlace && isOpen && (
            <InfoWindow 
              position={{ lat: selectedPlace.latLng.lat(), lng: selectedPlace.latLng.lng() }} 
              ariaLabel='Uluru' 
              content={<MapContent />} 
              onCloseClick={() => setOpen(false)} 
              open={isOpen}
            >
              <Marker 
                lat={selectedPlace.latLng.lat()} 
                lng={selectedPlace.latLng.lng()} 
                title='Uluru (Ayers Rock)' 
                onClick={handleMarkerClick} 
              />
            </InfoWindow>
          )
        }
      </GoogleMap>
    </Box>
  );
};

export default Maps;