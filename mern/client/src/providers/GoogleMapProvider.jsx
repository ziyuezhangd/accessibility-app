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
  const [categoryMarkers, setCategoryMarkers] = useState([]);
  const [stationMarkers, setStationMarkers] = useState([]);

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
 * color: string,
 * onClick: function}>} markerConfigs 
 * @param {boolean} shouldOverwriteExisting - set to true if you want these markers to overwrite all markers currently on the screen; if false, it will add to the existing markers
 */
  const createMarkers = (markerConfigs, shouldOverwriteExisting, isCategoryMarker = false, isStationMarker = false) => {
    // TODO: I think double markers are being added?
    if (shouldOverwriteExisting) {
      if (isCategoryMarker) {
        clearCategoryMarkers();
      } else if (isStationMarker) {
        clearStationMarkers();
      } else {
        clearMarkers();
      }
    }
    const markersToCreate = markerConfigs.map(config => {
      const { imgSrc, title, lat, lng, imgAlt, imgSize, scale, color, onClick } = config;
      const marker = imgSrc ? (
        <AdvancedMarker 
          lat={parseFloat(lat)}
          lng={parseFloat(lng)}
          title={title}
          gmpClickable={true}
          // key={key}
          onClick={onClick} // Add onClick event handler
        >
          <img 
            src={imgSrc}
            style={{height: imgSize}}
            alt={imgAlt} 
          />
        </AdvancedMarker>
      ) : (
        <AdvancedMarker 
          lat={parseFloat(lat)}
          lng={parseFloat(lng)}
          title={title}
          gmpClickable={true}
          onClick={onClick} // Add onClick event handler
        >
          <PinElement 
            scale={scale}
            color={color} /> 
        </AdvancedMarker>
      );
      return marker;
    });

    if (isCategoryMarker) {
      setCategoryMarkers(prevMarkers => shouldOverwriteExisting ? markersToCreate : [...prevMarkers, ...markersToCreate]);
    } else if (isStationMarker) {
      setStationMarkers(prevMarkers => shouldOverwriteExisting ? markersToCreate : [...prevMarkers, ...markersToCreate]);
    } else {
      setMarkers(prevMarkers => shouldOverwriteExisting ? markersToCreate : [...prevMarkers, ...markersToCreate]);
    }
    console.log(`Created ${markersToCreate.length} markers`);
  };

  /**
   * 
   * @param {Array<{lat: number, lng: number}>} latLngs 
   */
  const removeMarkers = (latLngs, isCategoryMarker = false, isStationMarker = false) => {
    if (isCategoryMarker) {
      setCategoryMarkers(prevMarkers => prevMarkers.filter(marker =>
        !latLngs.some(latLng =>
          parseFloat(marker.props.lat) === parseFloat(latLng.lat) && parseFloat(marker.props.lng) === parseFloat(latLng.lng)
        )
      ));
    } else if (isStationMarker) {
      setStationMarkers(prevMarkers => prevMarkers.filter(marker =>
        !latLngs.some(latLng =>
          parseFloat(marker.props.lat) === parseFloat(latLng.lat) && parseFloat(marker.props.lng) === parseFloat(latLng.lng)
        )
      ));
    } else {
      setMarkers(prevMarkers => prevMarkers.filter(marker =>
        !latLngs.some(latLng =>
          parseFloat(marker.props.lat) === parseFloat(latLng.lat) && parseFloat(marker.props.lng) === parseFloat(latLng.lng)
        )
      ));
    }
  };
  
  /**
   * 
   */
  const clearMarkers = () => {
    setMarkers([]);
  };

  const clearCategoryMarkers = () => {
    setCategoryMarkers([]);
  };

  const clearStationMarkers = () => {
    setStationMarkers([]);
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
      markers: [...markers, ...categoryMarkers, ...stationMarkers],
      onMapLoaded: handleMapLoaded,
      createMarkers,
      removeMarkers,
      clearMarkers,
      clearCategoryMarkers,
      clearStationMarkers,
      getDirections,
      clearDirections
    }}>
      {children}
    </GoogleMapContext.Provider>
  );
};

export { GoogleMapContext, GoogleMapProvider };