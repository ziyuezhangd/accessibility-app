import _ from 'lodash';
import { createContext, useState, useEffect } from 'react';
import { AdvancedMarker, PinElement } from 'react-google-map-wrapper';

const GoogleMapContext = createContext();

// List of available libraries: https://developers.google.com/maps/documentation/javascript/libraries
const GoogleMapProvider = ({children}) => {
  /** @type {[google.maps.Map, React.Dispatch<React.SetStateAction<google.maps.Map>>]} */
  const [mapInstance, setMapInstance] = useState();

  /** @type {[google.maps.PlacesLibrary, React.Dispatch<React.SetStateAction<google.maps.PlacesLibrary>>]} */
  const [placesService, setPlacesService] = useState();

  /** @type {[google.maps.DirectionsService, React.Dispatch<React.SetStateAction<google.maps.DirectionsService>>]} */
  const [directionsService, setDirectionsService] = useState();

  /** @type {[google.maps.DirectionsRenderer, React.Dispatch<React.SetStateAction<google.maps.DirectionsRenderer>>]} */
  const [directionsRenderer, setDirectionsRenderer] = useState();
  
  /** @type {[google.maps.Geocoder, React.Dispatch<React.SetStateAction<google.maps.Geocoder>>]} */
  const [geocoder, setGeocoder] = useState();
  
  /** @type {[google.maps.GeometryLibrary, React.Dispatch<React.SetStateAction<google.maps.GeometryLibrary>>]} */
  const [geometry, setGeometry] = useState();

  /** @type {[google.maps.AdvancedMarker[], React.Dispatch<React.SetStateAction<google.maps.AdvancedMarker[]>>]} */
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    if (mapInstance) {
      loadPlaces();
      loadGeocoder();
      loadGeometry();
      loadDirectionsService();
    }
  }, [mapInstance]);

  useEffect(() => {
    if (directionsRenderer) {
      window.addEventListener('keydown', (keyEvent) => {
        if (keyEvent.code === 'KeyC') {
          clearDirections();
        }
      });
    }
  }, [directionsRenderer]);

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

  const loadGeometry = async () => {
    const geometry = await google.maps.importLibrary('geometry');
    setGeometry(geometry);
    console.log('Geometry loaded successfully: ', geometry);
  };

  const loadDirectionsService = async () => {
    const { DirectionsService, DirectionsRenderer } = await google.maps.importLibrary('routes');
    const service = new DirectionsService(mapInstance);
    const renderer = new DirectionsRenderer({map: mapInstance, draggable: true});
    // renderer.setMap(mapInstance);
    setDirectionsService(service);
    setDirectionsRenderer(renderer);
    console.log('Directions service loaded successfully: ', service);
  };

  const clearDirections = () => {
    if (directionsRenderer !== null && directionsRenderer !== undefined) {
      directionsRenderer.setMap(null);
      const start = directionsRenderer.getDirections().routes[0].legs[0].start_location;
      const end = directionsRenderer.getDirections().routes[0].legs[0].end_location;
      removeMarkers([{lat: start.lat(), lng: start.lng()}, {lat: end.lat(), lng: end.lng()}]);
    }
  };

  const handleMapLoaded = (map) => {
    setMapInstance(map);
  };

  /**
   * 
   * @param {Array<{
   * lat: string, 
   * lng: string, 
   * imgSrc: string, 
   * imgSize: number, 
   * imgAlt: string, 
   * scale: number, 
   * title: string,
   * key: num,
   * color: string}>} markerConfigs 
   * @param {boolean} shouldOverwriteExisting - set to true if you want these markers to overwrite all markers currently on the screen; if false, it will add to the existing markers
   */
  const createMarkers = (markerConfigs, shouldOverwriteExisting) => {
    // TODO: I think double markers are being added?
    if (shouldOverwriteExisting) {
      clearMarkers();
    }
    const markersToCreate = [];
    for (const config of markerConfigs) {
      const {imgSrc, key, title} = config;
      let {lat, lng} = config;
      lat = parseFloat(lat);
      lng = parseFloat(lng);
      if (imgSrc) {
        const {imgAlt, imgSize} = config;
        // console.log(imgSrc)
        const marker = (
          <AdvancedMarker 
            lat={lat}
            lng={lng}
            title={title}
            gmpClickable={true}
            // key={key}
          >
            <img 
              src={imgSrc}
              style={{height: imgSize}}
            />
          </AdvancedMarker>
        );
        markersToCreate.push(marker);
      } else {
        // console.log('Imgsrc is null')
        let { scale, color} = config;
        scale = scale || 1;
        color = color || '#FF0000';
        const marker = (
          <AdvancedMarker 
            lat={lat}
            lng={lng}
            title={title}
            gmpClickable={true}
            // key={key}
          >
            <PinElement 
              scale={scale}
              color={color} />
          </AdvancedMarker>
        );
        markersToCreate.push(marker);
      }
    }
    setMarkers([markersToCreate,true]);
    console.log(`Created ${markers.length} markers`);
  };

  /**
   * 
   * @param {Array<{lat: number, lng: number}>} latLngs 
   */
  const removeMarkers = (latLngs) => {
    for (const latLng of latLngs) {
      const markersToFilter = [...markers];
      _.remove(markersToFilter, m => m.lat === parseFloat(latLng.lat) && m.lng === parseFloat(latLng.lng));
      setMarkers(markersToFilter);
    }
  };

  /**
   * 
   */
  const clearMarkers = () => {
    setMarkers([]);
  };

  const getDirections = (start, end) => {
    var request = {
      origin: start,
      destination: end,
      travelMode: google.maps.TravelMode['WALKING']
    };
    directionsService.route(request, function(result, status) {
      if (status === 'OK') {
        console.log('Got directions');
        directionsRenderer.setDirections(result);
        if (directionsRenderer.getMap() === null) {
          directionsRenderer.setMap(mapInstance);
        }
      }
    });
  };

  return (
    <GoogleMapContext.Provider value={{mapInstance, placesService, geocoder, markers, onMapLoaded: handleMapLoaded, createMarkers, removeMarkers, clearMarkers, getDirections, clearDirections}}>
      {children}
    </GoogleMapContext.Provider>
  );
};
  
export { GoogleMapContext, GoogleMapProvider };