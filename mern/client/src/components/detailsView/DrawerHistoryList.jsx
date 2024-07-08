import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { List, ListItem } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import TextField from '@mui/material/TextField';
import _ from 'lodash';
import { useEffect, useState, useContext } from 'react';
import { DataContext } from '../../providers/DataProvider';
import { GoogleMapContext } from '../../providers/GoogleMapProvider';
import { PlaceInfoUtilities, categoryToParentCategory } from '../../services/placeInfo';

/**
 * DrawerHistoryList function component.
 * 
 * This component renders a list of location history items in a drawer.
 * 
 * @param {Object} props - The properties passed to the component.
 * @param {function} props.onLocationSelected - Function to call when a location item is selected. Takes a MapLocation as a parameter
 * 
 * @returns {JSX.Element} The rendered DrawerHistoryList component.
 */
export default function DrawerHistoryList({ onLocationSelected }) {
  const [history, setHistory] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const { mapInstance, createMarkers, clearMarkers } = useContext(GoogleMapContext);
  const { placeInfos } = useContext(DataContext);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getHistory();
  }, []);

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

  const getHistory = () => {
    const history = localStorage.getItem('searchHistory');
    if (history) {
      const parsedHistory = JSON.parse(history);
      const recentHistory = parsedHistory.slice(0, 10); // Get the 10 most recent items
      setHistory(recentHistory);
    }
  };

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
    <>
      <Box sx={{ overflow: 'auto' }}
        aria-labelledby='Side bar with information'>
        <List aria-labelledby='Recently viewed locations'
          aria-label='Recently viewed locations'>
          {history.map((location, index) => (
            <ListItem key={location.name} 
              disablePadding>
              <ListItemButton onClick={() => onLocationSelected(location)}>
                <ListItemText primary={location.name} />
                <ChevronRightIcon />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        <Autocomplete
          multiple
          id="filter-selected-options"
          options={categories}
          getOptionLabel={(option) => option}
          filterSelectedOptions
          onChange={(event, value) => handleCategorySelected(value)} // Call handleCategorySelected on change
          value={selectedCategories} // Bind selected categories to Autocomplete value
          renderInput={(params) => (
            <TextField
              {...params}
              variant="standard"
              label="Filter by Category"
              placeholder="Categories"
            />
          )}
          sx={{ margin: 2 }} // Add some margin for better spacing
        />
      </Box>
    </>
  );
}
