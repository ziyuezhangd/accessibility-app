import { Box } from '@mui/material';
import { Suspense } from 'react';
import { GoogleMapApiLoader } from 'react-google-map-wrapper';
import { Map as MapComponent } from '../components/map/Map';
import HelpIcon from '../components/map/HelpIcon';
import SearchBar from '../components/SearchBar'; // Ensure the correct path

export default function MapPage() {
  const googleMapConfig = import.meta.env.VITE_GOOGLEMAP_KEY;

  return (
    <Box sx={{ display: 'flex' }}>
      <SearchBar /> {/* Include the SearchBar component */}
      <Suspense>
        {/* TODO: add fallback */}
        {/* Load the google map api */}
        <GoogleMapApiLoader apiKey={googleMapConfig} suspense>
          <MapComponent />
        </GoogleMapApiLoader>
      </Suspense>
    </Box>
  );
}
