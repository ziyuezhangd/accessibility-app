import './App.css';
import { Map } from './components/Map';
import { GoogleMapApiLoader } from 'react-google-map-wrapper';
import { StrictMode, Suspense } from 'react';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

const App = () => {
  const googleMapConfig = import.meta.env.VITE_GOOGLEMAP_KEY;

  return (
    <StrictMode>
      <div className='w-full p-6'>
        {/* TODO: add fallback={<Fallback />} */}
        <Suspense>
          {/* Load the google map api */}
          <GoogleMapApiLoader apiKey={googleMapConfig} suspense>
            <Map />
          </GoogleMapApiLoader>
        </Suspense>
      </div>
    </StrictMode>
  );
};
export default App;
