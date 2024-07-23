import _ from 'lodash';
import { createContext, useState, useEffect } from 'react';
import { AdvancedMarker, PinElement } from 'react-google-map-wrapper';
import { PlaceInfoUtilities } from '../services/placeInfo';

const GoogleMapContext = createContext();

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
  const [placeInfoMarkers, setPlaceInfoMarkers] = useState([]);
  const [restroomMarkers, setRestroomMarkers] = useState([]);
  const [stationMarkers, setStationMarkers] = useState([]);
  const [otherMarkers, setOtherMarkers] = useState([]);

  useEffect(() => {
    if (mapInstance) {
      loadPlaces();
      loadGeocoder();
      loadGeometry();
      loadDirectionsService();
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
      // Hacky way of just removing all markers because the latLngs will not be exact matches
      // If we have a selected location, clear everything except the selected location
      if (otherMarkers.length > 2) {
        setOtherMarkers([]);
      } else {
        setOtherMarkers([otherMarkers[0]]);
      }
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
 * color: string,
 * onClick: function}>} markerConfigs 
 * @param {boolean} shouldOverwriteExisting - set to true if you want these markers to overwrite all markers currently on the screen; if false, it will add to the existing markers
 * @param {string} markerType
 */
  const createMarkers = (markerConfigs, markerType, shouldOverwriteExisting) => {
    const markersToCreate = shouldOverwriteExisting ? [] : getMarkers(markerType);

    for (const config of markerConfigs) {
      const {imgSrc, key, title, category} = config;
      
      let {lat, lng} = config;
      lat = parseFloat(lat);
      lng = parseFloat(lng);
      
      if (imgSrc) {
        const {imgAlt, imgSize, onClick} = config;
        const { invert, sepia, saturate, hueRotate } = PlaceInfoUtilities.getMarkerStyle(category);
        const marker = (
          <AdvancedMarker 
            lat={lat}
            lng={lng}
            title={title}
            gmpClickable={true}
            onClick={onClick}
            key={key}
          >
            <img 
              src={imgSrc}
              alt={imgAlt}
              style={{height: imgSize, filter:`invert(${invert}%) sepia(${sepia}%) saturate(${saturate}%) hue-rotate(${hueRotate}deg) brightness(95%) contrast(95%)`}}
            />
          </AdvancedMarker>
        );
        
        markersToCreate.push(marker);
      } else {
        let { scale, color, onClick } = config;
        scale = scale || 1;
        color = color || '#FF0000';
        const marker = (
          <AdvancedMarker 
            lat={lat}
            lng={lng}
            title={title}
            gmpClickable={true}
            onClick={onClick}
            key={key}
          >
            <PinElement 
              scale={scale}
              color={color} />
          </AdvancedMarker>
        );
        markersToCreate.push(marker);
      }
    }

    if (markerType === 'placeInfo') {
      removeDuplicatePlaceInfoMarkers(markersToCreate);
    }
    setMarkers(markersToCreate, markerType);
  };

  const removeDuplicatePlaceInfoMarkers = (markers) => {
    _.remove(markers, marker => restroomMarkers.some(rm => rm.props.lat === marker.props.lat && rm.props.lng === marker.props.lng));
    _.remove(markers, marker => otherMarkers.some(rm => rm.props.lat === marker.props.lat && rm.props.lng === marker.props.lng));
    _.remove(markers, marker => stationMarkers.some(rm => rm.props.lat === marker.props.lat && rm.props.lng === marker.props.lng));
  };

  const getMarkers = (markerType) => {
    switch (markerType) {
    case 'restroom':
      return restroomMarkers;
    case 'station':
      return stationMarkers;
    case 'placeInfo':
      return placeInfoMarkers;
    default:
      return otherMarkers;
    }
  };

  const setMarkers = (markers, markerType) => {
    switch (markerType) {
    case 'restroom':
      setRestroomMarkers(markers);
      break;
    case 'station':
      setStationMarkers(markers);
      break;
    case 'placeInfo':
      setPlaceInfoMarkers(markers);
      break;
    default:
      setOtherMarkers(markers);
      break;
    }
  };

  /**
   * 
   * @param {Array<{lat: number, lng: number}>} latLngs 
   */
  const removeMarkers = (latLngs, markerType) => {
    const filteredMarkers = getMarkers(markerType);
    _.remove(filteredMarkers, marker => latLngs.some(latLng =>
      parseFloat(marker.props.lat) === parseFloat(latLng.lat) && parseFloat(marker.props.lng) === parseFloat(latLng.lng)
    ));
    setMarkers(filteredMarkers, markerType);
  };

  /**
   * 
   */
  const clearMarkers = (markerType) => {
    setMarkers([], markerType);
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
    <GoogleMapContext.Provider value={{
      mapInstance,
      placesService,
      geocoder,
      markers: {'station': stationMarkers, 'restroom': restroomMarkers, 'placeInfo': placeInfoMarkers, 'other': otherMarkers},
      onMapLoaded: handleMapLoaded,
      createMarkers,
      removeMarkers,
      clearMarkers,
      getDirections,
      clearDirections
    }}>
      {children}
    </GoogleMapContext.Provider>
  );
};

export { GoogleMapContext, GoogleMapProvider };