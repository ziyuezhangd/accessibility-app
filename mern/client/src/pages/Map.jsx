import React from 'react';
import { Map as MapComponent } from '../components/map/Map';
import { GoogleMapApiLoader } from 'react-google-map-wrapper';
import { Suspense } from 'react';

export default function Map() {
  const googleMapConfig = import.meta.env.VITE_GOOGLEMAP_KEY;

  return (
    <Suspense>
      {/* TODO: add fallback */}
      {/* Load the google map api */}
      <GoogleMapApiLoader apiKey={googleMapConfig} suspense>
        <MapComponent />
      </GoogleMapApiLoader>
    </Suspense>
  );
}
