import { Box } from '@mui/material';
import { Suspense } from 'react';
import { GoogleMapApiLoader } from 'react-google-map-wrapper';
import PersistentDrawerLeft from '../components/map/Drawer';
import { Map as MapComponent } from '../components/map/Map';

export default function MapPage() {
  const googleMapConfig = import.meta.env.VITE_GOOGLEMAP_KEY;

  return (
    <Box sx={{ display: 'flex' }}>
      <PersistentDrawerLeft />
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
