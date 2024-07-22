import SearchIcon from '@mui/icons-material/Search';
import { TextField, InputAdornment } from '@mui/material';
import { useRef, useContext, useEffect } from 'react';
import { GoogleMapContext } from '../../providers/GoogleMapProvider';

const SearchBar = ({ onSearchEntered }) => {
  const searchInputRef = useRef(null);
  const { mapInstance,placesService } = useContext(GoogleMapContext);

  useEffect(() => {
    if (mapInstance && window.google && placesService) {
      loadPlacesSearchBox();
    }
  }, [mapInstance,placesService]);

  const loadPlacesSearchBox = async () => {
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

        onSearchEntered({
          id: place.place_id,
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng()
        });
      });
      mapInstance.fitBounds(bounds);
    });
  };

  return (
    <>
      <TextField data-test='search-bar'
        inputRef={searchInputRef}
        placeholder="Search for places"
        variant="outlined"
        size="small"
        aria-label='Search for places'
        sx={{
          zIndex: 1000,
          backgroundColor: 'white',
          boxShadow: 3,
          borderRadius: '50px',
          '& .MuiOutlinedInput-root': {
            borderRadius: '50px',
            '&:hover': {
              boxShadow: 6,
            },
            '&.Mui-focused': {
              boxShadow: 6,
              borderColor: '#3f51b5',
            },
          },
          '& .MuiOutlinedInput-input': {
            padding: '10px 20px',
          },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: '#3f51b5' }} />
            </InputAdornment>
          ),
        }}
      />
    </>
  );
};

export default SearchBar;
