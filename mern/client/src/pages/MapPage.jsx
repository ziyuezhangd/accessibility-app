import { Suspense, useState } from 'react';
import { GoogleMapApiLoader } from 'react-google-map-wrapper';
import { Map as MapComponent } from '../components/map/Map';
import { GoogleMapProvider } from '../providers/GoogleMapProvider';

export default function MapPage() {
  const googleMapConfig = import.meta.env.VITE_GOOGLEMAP_KEY;

  return (
    <Suspense>
      {/* TODO: add fallback */}
      {/* Load the google map api */}
      <GoogleMapApiLoader apiKey={googleMapConfig} 
        suspense>
        {/* TODO: put back our drawer! */}
        <GoogleMapProvider>
          <MapComponent/>
        </GoogleMapProvider>
      </GoogleMapApiLoader>
    </Suspense>
  );
}
