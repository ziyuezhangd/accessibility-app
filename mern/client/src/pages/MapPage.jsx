import React from 'react';
import { Map as MapComponent } from '../components/map/Map';
import { GoogleMapApiLoader } from 'react-google-map-wrapper';
import { Suspense } from 'react';
import PersistentDrawerLeft from '../components/map/Drawer';
import { Box, Grid } from '@mui/material';

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
