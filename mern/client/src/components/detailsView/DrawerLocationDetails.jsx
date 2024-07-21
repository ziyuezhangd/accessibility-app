import {PlaceOverview} from '@googlemaps/extended-component-library/react';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import Favorite from '@mui/icons-material/Favorite';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import { Button, IconButton, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import _ from 'lodash';
import { useEffect, useState,useContext } from 'react';
import FeedbackForm from './FeedbackForm';
import Grades from './Grades';
import NearestRestrooms from './NearestRestrooms';
import NearestStations from './NearestStations';
import { GoogleMapContext } from '../../providers/GoogleMapProvider';
import { MapLocation } from '../../utils/MapUtils';

const DrawerLocationHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(1),
  backgroundColor: '#1976d2',
  color: 'white',
  boxShadow: '0px 2px 4px rgba(0,0,0,0.1)',
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
const CustomButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  width: '100%',
  backgroundColor: '#1976d2',
  color: theme.palette.common.white,
  '&:hover': {
    backgroundColor: '#115293',
  },
}));

const Content = styled(Box)(({ theme }) => ({
  overflowY: 'auto',
  padding: theme.spacing(5),
  maxHeight: 'calc(100vh - 250px)',
  '&::-webkit-scrollbar': {
    width: '8px',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: '#1976d2',
    borderRadius: '8px',
  },
  '&::-webkit-scrollbar-track': {
    backgroundColor: 'transparent',
  },
  '&::-webkit-scrollbar-button': {
    display: 'none',
  },
}));

export default function DrawerLocationDetails({ location, predictions, onBackClicked }) {
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    addLocationToHistory();
    checkIfFavorite();
  }, [location]);

  useEffect(() => {
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
    } else {
      setIsFavorite(false); // Ensure the favorite status is reset correctly
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
      <DrawerLocationHeader>
        <IconButton aria-label='Back to recently viewed'
          onClick={() => {
            onBackClicked(location);
          }}>
          <ChevronLeftIcon sx={{ color: 'white' }} />
        </IconButton>
        <Typography variant='h6'>
          Location Details
        </Typography>
        <IconButton aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          onClick={handleToggleFavorite}>
          {isFavorite ? <Favorite sx={{ color: 'white' }} /> : <FavoriteBorder sx={{ color: 'white' }} />}
        </IconButton>
      </DrawerLocationHeader>
      <Content sx={{pb: {xs: 50} }}>
        <PlaceOverview place={location.placeId}
          size='medium'></PlaceOverview>
        <Grades lat={location.lat}
          lng={location.lng}
          predictions={predictions}/>
        <NearestRestrooms 
          lat={location.lat}
          lng={location.lng} />
        <NearestStations 
          lat={location.lat}
          lng={location.lng} />

        <CustomButton onClick={handleButtonClicked}>Submit Feedback</CustomButton>
      </Content>
      <FeedbackForm location={location}
        isOpen={isFeedbackOpen}
        onClose={handleFeedbackClose} />
    </>
  );
}
