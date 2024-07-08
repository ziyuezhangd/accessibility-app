import { Suspense, useState } from 'react';
import { GoogleMapApiLoader } from 'react-google-map-wrapper';
import { Map as MapComponent } from '../components/map/Map';
import { DataProvider } from '../providers/DataProvider';
import { GoogleMapProvider } from '../providers/GoogleMapProvider';
import { UserProvider } from '../providers/UserProvider';

export default function MapPage() {
  const googleMapConfig = import.meta.env.VITE_GOOGLEMAP_KEY;

  return (
    <Suspense>
      {/* TODO: add fallback */}
      {/* Load the google map api */}
      <GoogleMapApiLoader apiKey={googleMapConfig} 
        suspense>
        {/* TODO: put back our drawer! */}
        <UserProvider>
          <DataProvider>
            <GoogleMapProvider>
              <MapComponent/>
            </GoogleMapProvider>
          </DataProvider>
        </UserProvider>
      </GoogleMapApiLoader>
    </Suspense>
  );
}