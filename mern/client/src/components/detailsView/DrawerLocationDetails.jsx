import { PlaceOverview } from '@googlemaps/extended-component-library/react';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
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
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'start',
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

  useEffect(() => {
    addLocationToHistory();
  }, []);

  const addLocationToHistory = () => {
    let history = localStorage.getItem('searchHistory');
    if (!history) {
      localStorage.setItem('searchHistory', JSON.stringify([]));
    }
    history = JSON.parse(localStorage.getItem('searchHistory'));

    if (_.isEqual(history[0], location)) {
      // Do nothing
      return;
    }

    if (_.find(history, (h) => h.name === location.name)) {
      // Remove and we will put it back to the start
      _.remove(history, (h) => h.name === location.name);
    }
    history = [location, ...history];

    localStorage.setItem('searchHistory', JSON.stringify(history));
  };

  const handleButtonClicked = () => {
    setIsFeedbackOpen(true);
  };

  const handleFeedbackClose = () => {
    setIsFeedbackOpen(false);
  };

  const handleRestroomsLoaded = (restrooms) => {
    addMarkers(restrooms.map(restroom => ({lat: parseFloat(restroom.latitude),lng: parseFloat(restroom.longitude)})));
  };

  return (
    <>
      <DrawerHeader>
        <IconButton onClick={onBackClicked}>
          <ChevronLeftIcon />
        </IconButton>
      </DrawerHeader>
      <Box sx={{ overflow: 'auto', px: 5 }}>
        {/* TODO: move the google logo elsewhere */}
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
