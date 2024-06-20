import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { Button, Alert } from '@mui/material';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
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

export default function DrawerLocationDetails({ location, onBackClicked }) {
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
      <DrawerHeader>
        <IconButton onClick={onBackClicked}>
          <ChevronLeftIcon />
        </IconButton>
      </DrawerHeader>
      <Box sx={{ overflow: 'auto', px: 5 }}>
        <Typography variant='h5'>{location}</Typography>
        Hello
        {!isLoading && (
          <>
            <NearestRestrooms placeInfos={placeInfos} />
            <NearestStations placeInfos={placeInfos} />
          </>
        )}
        <Button onClick={handleButtonClicked}>Submit Feedback</Button>
      </Box>
      {error && <Alert severity='error'>{error}</Alert>}
      {isFeedbackComplete && <Alert severity='success'>Feedback submitted!</Alert>}
    </>
  );
}
