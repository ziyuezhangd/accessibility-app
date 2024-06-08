import React from 'react';
import { Suspense } from 'react';
import { GoogleMapApiLoader } from 'react-google-map-wrapper';
import { Map as MapComponent } from '../components/Map';

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
