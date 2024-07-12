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
  marginTop: '10px', // Adding gap at the top
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

const CustomTextField = styled(TextField)({
  '& .MuiInputBase-input': {
    color: 'white', // Display the placeholder text in white
  },
  '& .MuiInputLabel-root': {
    color: 'white', // Label color
    transition: 'opacity 0.3s, color 0.3s, background-color 0.3s',
    opacity: 1, // Ensure the label is visible initially
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: 'transparent', // Make label text color transparent when focused
    backgroundColor: 'transparent', // Make label background transparent when focused
    opacity: 0, // Make label completely invisible when focused
  },
  '& .MuiInputBase-input.Mui-focused': {
    color: 'black', // Input text color when focused
  },
});

const CustomChip = styled(Chip)({
  backgroundColor: '#4a90e2', // Background color for selected options
  color: 'white', // Text color for selected options
  border: '1px solid white', // Border color for selected options
  '& .MuiChip-deleteIcon': {
    color: 'white', // Color of the clear marker
  },
});

const CategoryFilter = ({ selectedCategories, setSelectedCategories }) => {
  const { mapInstance, createMarkers, clearMarkers } = useContext(GoogleMapContext);
  const { placeInfos } = useContext(DataContext);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const uniqueCategories = _.uniqBy(placeInfos.map(place => categoryToParentCategory(place.category)).filter(category => category && category.trim() !== ''));
    setCategories(['All', ...uniqueCategories]); // Add 'All' option
  }, [placeInfos]);

  useEffect(() => {
    if (!mapInstance) return;

    if (selectedCategories.length === 0 || selectedCategories.includes('All')) {
      clearMarkers();
      if (selectedCategories.includes('All')) {
        const allMarkers = placeInfos.map(placeInfo => ({
          lat: placeInfo.latitude,
          lng: placeInfo.longitude,
          imgSrc: PlaceInfoUtilities.getMarkerPNG(placeInfo),
          imgSize: '30px',
          imgAlt: placeInfo.name,
        })).filter(marker => marker.imgSrc !== null);

        createMarkers(allMarkers, true); // Create all markers if "All" is selected
      }
      return; // No categories selected or "All" selected, don't display any markers if none are selected
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

    createMarkers(filteredMarkers, true); // Create markers based on filtered categories and overwrite existing markers
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
        />
      )}
    />
  );
};

export default CategoryFilter;
