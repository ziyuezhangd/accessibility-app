import { createContext, useState, useEffect } from 'react';

const GoogleApiContext = createContext();

const GoogleApiProvider = ({children}) => {
  /** @type {[google.maps.Map, React.Dispatch<React.SetStateAction<google.maps.Map>>]} */
  const [mapInstance, setMapInstance] = useState();

  /** @type {[google.maps.PlacesLibrary, React.Dispatch<React.SetStateAction<google.maps.PlacesLibrary>>]} */
  const [placesService, setPlacesService] = useState();
  
  /** @type {[google.maps.Geocoder, React.Dispatch<React.SetStateAction<google.maps.Geocoder>>]} */
  const [geocoder, setGeocoder] = useState();

  useEffect(() => {
    if (mapInstance) {
      loadPlaces();
      loadGeocoder();
    }
  }, [mapInstance]);

  const loadPlaces = async () => {
    const { PlacesService } = await google.maps.importLibrary('places');
    const service = new PlacesService(mapInstance);
    setPlacesService(service);
    console.log('Places service loaded successfully: ', service);
  };

  const loadGeocoder = async () => {
    const geocoder = new google.maps.Geocoder();
    setGeocoder(geocoder);
    console.log('Geocoder loaded successfully: ', geocoder);
  };

  const handleMapLoaded = (map) => {
    setMapInstance(map);
  };

  return (
    <GoogleApiContext.Provider value={{mapInstance, placesService, geocoder, onMapLoaded: handleMapLoaded}}>
      {children}
    </GoogleApiContext.Provider>
  );
};
  
export { GoogleApiContext, GoogleApiProvider };