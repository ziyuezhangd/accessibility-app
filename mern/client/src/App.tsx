import './App.css';
import { Map } from './components/Map';
import { GoogleMapApiLoader } from 'react-google-map-wrapper';
import { Suspense } from 'react';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';


const App = () => {
  const googleMapConfig: string = import.meta.env.VITE_GOOGLEMAP_KEY;

  return (
    <div className='w-full p-6'>
      {/* TODO: add fallback={<Fallback />} */}
      <Suspense>
        {/* Load the google map api */}
        <GoogleMapApiLoader apiKey={googleMapConfig} suspense>
          <Map />
        </GoogleMapApiLoader>
      </Suspense>
    </div>
  );
};
export default App;
