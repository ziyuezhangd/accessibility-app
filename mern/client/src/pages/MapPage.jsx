import { Box } from '@mui/material';
import { Suspense, useState } from 'react';
import { GoogleMapApiLoader } from 'react-google-map-wrapper';
import PersistentDrawerLeft from '../components/detailsView/Drawer';
import { Map as MapComponent } from '../components/map/Map';

export default function MapPage() {
  const [selectedLocation, setSelectedLocation] = useState({});
  const googleMapConfig = import.meta.env.VITE_GOOGLEMAP_KEY;

  return (
    <Box sx={{ display: 'flex' }}>
      <PersistentDrawerLeft selectedLocation={selectedLocation} />
      <Suspense>
        {/* TODO: add fallback */}
        {/* Load the google map api */}
        <GoogleMapApiLoader apiKey={googleMapConfig}
          suspense>
          <MapComponent />
        </GoogleMapApiLoader>
      </Suspense>
    </Box>
  );
}
