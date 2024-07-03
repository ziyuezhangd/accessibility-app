import {PlaceOverview} from '@googlemaps/extended-component-library/react';
import { Button, Alert } from '@mui/material';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import Grades from './Grades';
import NearestRestrooms from './NearestRestrooms';
import NearestStations from './NearestStations';
import { postFeedback } from '../../services/feedback';
import { MapLocation } from '../../utils/MapUtils';

/**
 * DrawerLocationDetails component.
 * 
 * This component renders the details of a specific location within a drawer.
 * 
 * @param {Object} props - The properties passed to the component.
 * @param {MapLocation} props.location - The location object to show details about.
 * @returns {JSX.Element} The rendered DrawerLocationDetails component.
 */

export default function DrawerLocationDetails({ location }) {
  const [error, setError] = useState('');
  const [isFeedbackComplete, setIsFeedbackComplete] = useState(false);

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

  return (
    <>
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
      {error && <Alert severity='error'>{error}</Alert>}
      {isFeedbackComplete && <Alert severity='success'>Feedback submitted!</Alert>}
    </>
  );
}