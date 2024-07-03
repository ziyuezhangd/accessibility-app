// DrawerLocationDetails.jsx
import { PlaceOverview } from '@googlemaps/extended-component-library/react';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import Favorite from '@mui/icons-material/Favorite';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import { Button, Box, IconButton, styled } from '@mui/material';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import FeedbackForm from './FeedbackForm';
import Grades from './Grades';
import NearestRestrooms from './NearestRestrooms';
import NearestStations from './NearestStations';

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'space-between',
}));

/**
 * DrawerLocationDetails component.
 * 
 * This component renders the details of a specific location within a drawer.
 * 
 * @param {Object} props - The properties passed to the component.
 * @param {MapLocation} props.location - The location object to show details about.
 * @param {function} props.onBackClicked - The function to call when the back button is clicked.
 * 
 * @returns {JSX.Element} The rendered DrawerLocationDetails component.
 */
const modalStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const formStyle = {
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

export default function DrawerLocationDetails({ location, onBackClicked }) {
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    addLocationToHistory();
    checkIfFavorite();
    
    const handleFavoriteAdded = (event) => {
      if (event.detail.placeId === location.placeId) {
        setIsFavorite(true);
      }
    };

    const handleFavoriteRemoved = (event) => {
      if (event.detail.placeId === location.placeId) {
        setIsFavorite(false);
      }
    };

    window.addEventListener('favoriteAdded', handleFavoriteAdded);
    window.addEventListener('favoriteRemoved', handleFavoriteRemoved);

    return () => {
      window.removeEventListener('favoriteAdded', handleFavoriteAdded);
      window.removeEventListener('favoriteRemoved', handleFavoriteRemoved);
    };
  }, [location]);

  const addLocationToHistory = () => {
    let history = localStorage.getItem('searchHistory');
    if (!history) {
      localStorage.setItem('searchHistory', JSON.stringify([]));
    }
    history = JSON.parse(localStorage.getItem('searchHistory'));

    if (_.isEqual(history[0], location)) {
      return;
    }

    if (_.find(history, (h) => h.name === location.name)) {
      _.remove(history, (h) => h.name === location.name);
    }
    history = [location, ...history];

    localStorage.setItem('searchHistory', JSON.stringify(history));
  };

  const checkIfFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    if (_.find(favorites, (f) => f.placeId === location.placeId)) {
      setIsFavorite(true);
    }
  };

  const handleButtonClicked = () => {
    setIsFeedbackOpen(true);
  };

  const handleFeedbackClose = () => {
    setIsFeedbackOpen(false);
  };

  const handleToggleFavorite = () => {
    if (isFavorite) {
      const event = new CustomEvent('favoriteRemoved', { detail: location });
      window.dispatchEvent(event);
      setIsFavorite(false);
    } else {
      const event = new CustomEvent('favoriteAdded', { detail: location });
      window.dispatchEvent(event);
      setIsFavorite(true);
    }
  };

  return (
    <>
      <DrawerHeader>
        <IconButton onClick={onBackClicked}>
          <ChevronLeftIcon />
        </IconButton>
        <IconButton onClick={handleToggleFavorite}>
          {isFavorite ? <Favorite sx={{ color: 'red' }} /> : <FavoriteBorder />}
        </IconButton>
      </DrawerHeader>
      <Box sx={{ overflow: 'auto', px: 5 }}>
        <PlaceOverview place={location.placeId}
          size='medium'></PlaceOverview>
        <Grades />
        <NearestRestrooms 
          lat={location.lat}
          lng={location.lng} />
        <NearestStations 
          lat={location.lat}
          lng={location.lng} />

        <Button onClick={handleButtonClicked}>Submit Feedback</Button>
      </Box>
      <FeedbackForm location={location}
        isOpen={isFeedbackOpen}
        onClose={handleFeedbackClose} />
    </>
  );
}
