import _ from 'lodash';
import { createContext, useState, useEffect } from 'react';
import { AdvancedMarker, PinElement } from 'react-google-map-wrapper';
import { ReactSVG } from 'react-svg';

const GoogleMapContext = createContext();

const GoogleMapProvider = ({children}) => {
  /** @type {[google.maps.Map, React.Dispatch<React.SetStateAction<google.maps.Map>>]} */
  const [mapInstance, setMapInstance] = useState();

  /** @type {[google.maps.PlacesLibrary, React.Dispatch<React.SetStateAction<google.maps.PlacesLibrary>>]} */
  const [placesService, setPlacesService] = useState();
  
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
  const loadGeometry = async () => {
    const geometry = await google.maps.importLibrary('geometry');
    setGeometry(geometry);
    console.log('Geometry loaded successfully: ', geometry);
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
      const {imgSrc, key, title, parentCategory} = config;
      
      let {lat, lng} = config;
      lat = parseFloat(lat);
      lng = parseFloat(lng);
      if (imgSrc) {
        let a = 0;
        let b= 0;
        let c= 0;
        let d=0;
        const {imgAlt, imgSize} = config;
        
        if (parentCategory === 'books' || parentCategory === 'education' ){
          a= 0;
          b=0;
          c=4247;
          d=170;
        }
        else if (parentCategory === 'retail' || parentCategory ==='market' || parentCategory ==='phone' || parentCategory ==='supermarket' || parentCategory ==='beauty' ){
          a= 0;
          b=0;
          c=4247;
          d=136;
        }
        if (parentCategory === 'theatre'|| parentCategory === 'cinema' ){
          a= 0;
          b=0;
          c=4247;
          d=200;
        }
        
        if (parentCategory === 'car' || parentCategory === 'train' || parentCategory === 'airport' || parentCategory === 'bus'|| parentCategory === 'parking'|| parentCategory === 'ferry'||  parentCategory === 'bike'){
          a= 0;
          b=0;
          //green
          c=3000;
          d=100;
        }
        if ( parentCategory === 'accomodation' || parentCategory === 'policeStation' || parentCategory === 'office' || parentCategory === 'cemetery' || parentCategory === 'atm' || parentCategory === 'post' || parentCategory === 'service' || parentCategory === 'bank' || parentCategory === 'health' || parentCategory === 'veterinary' ){
          a= 0;
          b=0;
          //green
          c=4247;
          d=300;
        }

        if (parentCategory === 'restaurant'|| parentCategory === 'coffee'|| parentCategory === 'pub' ){
          a= 0;
          b=0;
          //purple
          c=4247;
          d=45;
        }
        if (parentCategory === 'placeOfWorship' ){
          a= 0;
          b=0;
          //blue
          c=4247;
          d=10;
        }
        if (parentCategory === 'art' || parentCategory === 'museum' || parentCategory === 'attraction' || parentCategory === 'sports'|| parentCategory === 'historical'){
          a= 0;
          b=0;
          //blue
          c=4247;
          d=10;
        }
        if (parentCategory === 'toilet' ){
          a= 0;
          b=0;
          //green
          c=4247;
          d=300;
        }
        if (parentCategory === 'drinkingWater' ){
          a= 0;
          b=0;
          c=4247;
          d=300;
        }
        if (parentCategory === 'camping' || parentCategory === 'picnicTable' || parentCategory === 'flowers'|| parentCategory === 'water' || parentCategory === 'playground'){
          a= 0;
          b=0;
          c=4247;
          d=170;
        }
               
        const marker = (
          <AdvancedMarker 
            lat={lat}
            lng={lng}
            title={title}
            gmpClickable={true}
            // key={key}
          >
            <img 
              src = {imgSrc}
              style={{height: imgSize, filter:`invert(${a}%) sepia(${b}%) saturate(${c}%) hue-rotate(${d}deg) brightness(95%) contrast(95%)`}}
              //90 deg green
              //0 deg orange
              //
              alt = 'marker'
            >
            
            </img>
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
    setMarkers([...markers, ...markersToCreate]);
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

  return (
    <GoogleMapContext.Provider value={{mapInstance, placesService, geocoder, markers, onMapLoaded: handleMapLoaded, createMarkers, removeMarkers, clearMarkers}}>
      {children}
    </GoogleMapContext.Provider>
  );
};
  
export { GoogleMapContext, GoogleMapProvider };