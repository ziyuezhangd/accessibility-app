// SearchBar.jsx

import SearchIcon from '@mui/icons-material/Search';
import { TextField, InputAdornment } from '@mui/material';
import React, { useRef, useEffect } from 'react';
import { Control } from 'react-google-map-wrapper';

const SearchBar = ({ mapInstance, setSelectedPlace }) => {
  const searchInputRef = useRef(null);

  useEffect(() => {
    if (mapInstance && window.google.maps.places) {
      const input = searchInputRef.current;
      const searchBox = new window.google.maps.places.SearchBox(input);

      mapInstance.addListener('bounds_changed', () => {
        searchBox.setBounds(mapInstance.getBounds());
      });

      searchBox.addListener('places_changed', () => {
        const places = searchBox.getPlaces();
        if (places.length === 0) {
          return;
        }

        const bounds = new window.google.maps.LatLngBounds();
        places.forEach((place) => {
          if (!place.geometry || !place.geometry.location) {
            return;
          }

          if (place.geometry.viewport) {
            bounds.union(place.geometry.viewport);
          } else {
            bounds.extend(place.geometry.location);
          }

          setSelectedPlace({
            id: place.place_id,
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          });
        });
        mapInstance.fitBounds(bounds);
      });
    }
  }, [mapInstance]);

  return (
    <><Control position={google.maps.ControlPosition.TOP_LEFT}></Control><TextField
      inputRef={searchInputRef}
      placeholder="Search for places"
      variant="outlined"
      size="small"
      sx={{
        position: 'absolute',
        zIndex: 1000,
        top: '10px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '300px',
        backgroundColor: 'white',
        boxShadow: 3,
        '& .MuiOutlinedInput-root': {
          borderRadius: '50px',
        },
        '& .MuiOutlinedInput-input': {
          padding: '10px 20px',
        },
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
      }} /></>
  );
};

export default SearchBar;
