import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { Button, Alert } from '@mui/material';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { postFeedback } from '../../services/feedback';

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'start',
}));

export default function DrawerLocationDetails({ location, onBackClicked }) {
  const [error, setError] = React.useState('');
  const [isFeedbackComplete, setIsFeedbackComplete] = React.useState(false);
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
      <Box sx={{ overflow: 'auto' }}>
        <Typography variant='h5'>{location}</Typography>
        Hello
        <Button onClick={handleButtonClicked}>Submit Feedback</Button>
      </Box>
      {error && <Alert severity='error'>{error}</Alert>}
      {isFeedbackComplete && <Alert severity='success'>Feedback submitted!</Alert>}
    </>
  );
}