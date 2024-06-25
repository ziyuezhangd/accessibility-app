import {PlaceOverview} from '@googlemaps/extended-component-library/react';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { Button, Alert } from '@mui/material';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import Grades from './Grades';
import NearestRestrooms from './NearestRestrooms';
import NearestStations from './NearestStations';
import { postFeedback } from '../../services/feedback';
import { getPlaceInfos } from '../../services/placeInfo';

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'start',
}));

export default function DrawerLocationDetails({ location, onBackClicked, addMarkers }) {
  const [error, setError] = useState('');
  const [isFeedbackComplete, setIsFeedbackComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [placeInfos, setPlaceInfos] = useState([]);

  useEffect(() => {
    getPlaceInfos().then((infos) => {
      setPlaceInfos(infos);
      setIsLoading(false);
    });
  }, []);

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

  const handleButtonClicked = async () => {
    // TODO: these alerts need to disappear, like toasts
    setError('');
    try {
      await postFeedback({
        name: 'April',
        email: 'april.polubiec@ucdconnect.ie',
        comment: 'This place is no longer open.',
        coordinates: [-73.9712, 40.7831],
      });
    } catch (e) {
      setError(e.toString());
    }
    console.log('Complete!');
    setIsFeedbackComplete(true);
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
        {!isLoading && (
          <>
            <Grades />
            <NearestRestrooms lat={location.lat}
              lng={location.lng}
              onLoaded={handleRestroomsLoaded} />
            <NearestStations placeInfos={placeInfos}
              lat={location.lat}
              lng={location.lng} />
          </>
        )}
        <Button onClick={handleButtonClicked}>Submit Feedback</Button>
      </Box>
      {error && <Alert severity='error'>{error}</Alert>}
      {isFeedbackComplete && <Alert severity='success'>Feedback submitted!</Alert>}
    </>
  );
}
