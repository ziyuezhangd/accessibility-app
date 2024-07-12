import Autocomplete from '@mui/material/Autocomplete';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/system';
import _ from 'lodash';
import { useState, useEffect, useContext } from 'react';
import { DataContext } from '../../providers/DataProvider';
import { GoogleMapContext } from '../../providers/GoogleMapProvider';
import { PlaceInfoUtilities, categoryToParentCategory } from '../../services/placeInfo';

// Custom styled components similar to Dropdown
const CustomAutocomplete = styled(Autocomplete)({
  width: '200px',
  backgroundColor: '#4a90e2',
  borderRadius: '8px',
  marginTop: '10px',
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: 'white',
    },
    '&:hover fieldset': {
      borderColor: 'white',
    },
    '&.Mui-focused fieldset': {
      borderColor: 'white',
    },
    color: 'white',
  },
  '& .MuiAutocomplete-popupIndicator': {
    color: 'white',
  },
  '& .MuiAutocomplete-clearIndicator': {
    color: 'white',
  },
  '& .MuiAutocomplete-listbox': {
    backgroundColor: '#4a90e2',
    color: 'white',
  },
});

const CustomTextField = styled(TextField)(({ hasFocus, hasValue }) => ({
  '& .MuiInputBase-input': {
    color: 'white', // Display the placeholder text in white
  },
  '& .MuiInputLabel-root': {
    color: 'white', // Label color
    backgroundColor: hasFocus || hasValue ? '#4a90e2' : 'transparent', // Blue background when focused or has value
    transition: 'opacity 0.3s, color 0.3s, background-color 0.3s',
    opacity: hasFocus || hasValue ? 1 : 1, // Keep the label visible
    padding: '0 4px', // Padding to avoid label text overlap with background
  },
  '& .MuiInputBase-input.Mui-focused': {
    color: 'black', // Input text color when focused
  },
}));

const CustomChip = styled(Chip)({
  backgroundColor: '#4a90e2', // Background color for selected options
  color: 'white', // Text color for selected options
  border: '1px solid white', // Border color for selected options
  '& .MuiChip-deleteIcon': {
    color: 'white', // Color of the clear marker
  },
});

const CategoryFilter = ({ selectedCategories, setSelectedCategories }) => {
  const { mapInstance, createMarkers, clearMarkers, removeMarkers } = useContext(GoogleMapContext);
  const { placeInfos } = useContext(DataContext);
  const [categories, setCategories] = useState([]);
  const [hasFocus, setHasFocus] = useState(false);

  useEffect(() => {
    const uniqueCategories = _.uniqBy(placeInfos.map(place => categoryToParentCategory(place.category)).filter(category => category && category.trim() !== ''));
    setCategories(['All', ...uniqueCategories]); // Add 'All' option
  }, [placeInfos]);

  useEffect(() => {
    if (!mapInstance) return;

    const handleMarkers = () => {
      if (selectedCategories.length === 0 || selectedCategories.includes('All')) {
        // Remove only category markers, not restroom markers
        const categoryMarkers = placeInfos.map(placeInfo => ({
          lat: placeInfo.latitude,
          lng: placeInfo.longitude,
        }));
        removeMarkers(categoryMarkers);

        if (selectedCategories.includes('All')) {
          const allMarkers = placeInfos.map(placeInfo => ({
            lat: placeInfo.latitude,
            lng: placeInfo.longitude,
            imgSrc: PlaceInfoUtilities.getMarkerPNG(placeInfo),
            imgSize: '30px',
            imgAlt: placeInfo.name,
          })).filter(marker => marker.imgSrc !== null);

          createMarkers(allMarkers, false); // Create all markers if "All" is selected without clearing existing markers
        }
        return; // No categories selected or "All" selected
      }

      const filteredMarkers = placeInfos
        .filter(placeInfo => selectedCategories.includes(categoryToParentCategory(placeInfo.category)))
        .map(placeInfo => ({
          lat: placeInfo.latitude,
          lng: placeInfo.longitude,
          imgSrc: PlaceInfoUtilities.getMarkerPNG(placeInfo),
          imgSize: '30px',
          imgAlt: placeInfo.name,
        }))
        .filter(marker => marker.imgSrc !== null);

      // Remove existing category markers before adding new ones
      const categoryMarkersToRemove = placeInfos.map(placeInfo => ({
        lat: placeInfo.latitude,
        lng: placeInfo.longitude,
      }));
      removeMarkers(categoryMarkersToRemove);

      createMarkers(filteredMarkers, false); // Create markers based on filtered categories without clearing existing markers
    };

    handleMarkers();
  }, [selectedCategories, placeInfos, mapInstance]);

  const handleCategorySelected = (categories) => {
    if (categories.includes('All') && !selectedCategories.includes('All')) {
      setSelectedCategories(['All']);
    } else if (categories.length === 0 || categories.includes('All')) {
      setSelectedCategories([]);
    } else {
      setSelectedCategories(categories.filter(category => category !== 'All'));
    }
  };

  const handleFocus = () => {
    setHasFocus(true);
  };

  const handleBlur = () => {
    setHasFocus(false);
  };

  const hasValue = selectedCategories.length > 0;

  return (
    <CustomAutocomplete
      multiple
      id="filter-selected-options"
      options={categories}
      getOptionLabel={(option) => option}
      filterSelectedOptions
      onChange={(event, value) => handleCategorySelected(value)} // Call handleCategorySelected on change
      value={selectedCategories} // Bind selected categories to Autocomplete value
      renderTags={(value, getTagProps) =>
        value.map((option, index) => (
          <CustomChip
            key={option} // Add key prop here
            variant="outlined"
            label={option}
            {...getTagProps({ index })} 
          />
        ))
      }
      renderInput={(params) => (
        <CustomTextField
          {...params}
          variant="outlined"
          label="Filter by Category"
          placeholder="Categories"
          hasFocus={hasFocus}
          hasValue={hasValue}
          onFocus={handleFocus}
          onBlur={handleBlur} 
        />
      )} 
    />
  );
};

export default CategoryFilter;
