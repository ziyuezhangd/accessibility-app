/* eslint-disable import/no-unresolved, import/order, import/named */
import {PlaceOverview} from '@googlemaps/extended-component-library/react';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { Button, TextField, Modal, Slide, Snackbar, Box, IconButton, Typography, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { styled } from '@mui/material/styles';
import _ from 'lodash';
import{ useEffect, useState } from 'react';
import Grades from './Grades';
import NearestRestrooms from './NearestRestrooms';
import NearestStations from './NearestStations';
import { postFeedback, Feedback } from '../../services/feedback';

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
  const [isFeedbackComplete, setIsFeedbackComplete] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [comment, setComment] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [conditions, setConditions] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [errors, setErrors] = useState({});

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

  const handleFeedbackChange = (setter) => (event) => {
    setter(event.target.value);
  };

  const handleNameChange = (event) => {
    const value = event.target.value;
    if (/^[a-zA-Z\s]*$/.test(value)) {
      setName(value);
    }
  };

  const handleConditionsChange = (event) => {
    const value = event.target.value;
    if (/^[a-zA-Z\s]*$/.test(value)) {
      setConditions(value);
    }
  };

  const handleEmailChange = (event) => {
    const value = event.target.value;
    setEmail(value);
  };

  const handleAgeChange = (event) => {
    const value = event.target.value;
    setAge(value);
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmitFeedback = async () => {
    const newErrors = {};
    if (!validateEmail(email)) {
      newErrors.email = 'Invalid email address';
    }
    if (!name) {
      newErrors.name = 'Name is required';
    }
    if (!comment) {
      newErrors.comment = 'Comment is required';
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    try {
      const feedback = new Feedback(name, email, comment, Number(age), gender, conditions, [location.lng, location.lat]);
      await postFeedback(feedback);
      setSnackbarMessage('Feedback submitted successfully');
      setSnackbarOpen(true);
      setIsFeedbackOpen(false);
      setName('');
      setEmail('');
      setComment('');
      setAge('');
      setGender('');
      setConditions('');
      setIsFeedbackComplete(true);
      setErrors({});
    } catch (e) {
      setErrors({ form: e.toString() });
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleCancel = () => {
    setIsFeedbackOpen(false);
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
      <Modal
        open={isFeedbackOpen}
        onClose={handleCancel}
        closeAfterTransition
        sx={modalStyle}
      >
        <Slide direction="up"
          in={isFeedbackOpen}
          mountOnEnter
          unmountOnExit>
          <Box sx={formStyle}>
            <Typography variant="h6"
              component="h2"
              align="center">Submit Feedback</Typography>
            <TextField 
              label="Name" 
              value={name} 
              onChange={handleNameChange} 
              variant="outlined" 
              fullWidth 
              sx={{ mt: 2 }} 
              error={!!errors.name}
              helperText={errors.name}
            />
            <TextField 
              label="Email" 
              value={email} 
              onChange={handleEmailChange} 
              variant="outlined" 
              fullWidth 
              sx={{ mt: 2 }} 
              error={!!errors.email} 
              helperText={errors.email}
            />
            <TextField 
              label="Age" 
              value={age} 
              onChange={handleAgeChange} 
              variant="outlined" 
              fullWidth 
              sx={{ mt: 2 }} 
              type="number"
            />
            <FormControl fullWidth
              sx={{ mt: 2 }}
              error={!!errors.gender}>
              <InputLabel>Gender</InputLabel>
              <Select
                value={gender}
                onChange={handleFeedbackChange(setGender)}
                variant="outlined"
                label="Gender"
              >
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
                <MenuItem value="Prefer not to say">Prefer not to say</MenuItem>
              </Select>
            </FormControl>
            <TextField 
              label="Conditions" 
              value={conditions} 
              onChange={handleConditionsChange} 
              variant="outlined" 
              fullWidth 
              sx={{ mt: 2 }}
            />
            <TextField 
              label="Comment" 
              value={comment} 
              onChange={handleFeedbackChange(setComment)} 
              variant="outlined" 
              multiline
              rows={4} 
              fullWidth 
              sx={{ mt: 2 }} 
              error={!!errors.comment} 
              helperText={errors.comment}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <Button variant="contained"
                color="secondary"
                onClick={handleCancel}>Cancel</Button>
              <Button variant="contained"
                color="primary"
                onClick={handleSubmitFeedback}>Send</Button>
            </Box>
          </Box>
        </Slide>
      </Modal>
      {isFeedbackComplete && <Snackbar open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        message={snackbarMessage} />}
    </>
  );
}
