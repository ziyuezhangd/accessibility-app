import { Box } from '@mui/material';
import React, { Suspense, createContext, useEffect, useState } from 'react';
import { GoogleMapApiLoader } from 'react-google-map-wrapper';
import PersistentDrawerLeft from '../components/detailsView/Drawer';
import { Map as MapComponent } from '../components/map/Map';
import { GoogleApiProvider } from '../providers/GoogleApiProvider';

export default function MapPage() {
  const [selectedLocation, setSelectedLocation] = useState({});
  const googleMapConfig = import.meta.env.VITE_GOOGLEMAP_KEY;

  return (
    <Suspense>
      {/* TODO: add fallback */}
      {/* Load the google map api */}
      <GoogleMapApiLoader apiKey={googleMapConfig} 
        suspense>
        {/* TODO: put back our drawer! */}
        <GoogleApiProvider>
          <MapComponent onMapClicked={(e) => setSelectedLocation(e)}
          />
        </GoogleApiProvider>
      </GoogleMapApiLoader>
    </Suspense>
  );
}
