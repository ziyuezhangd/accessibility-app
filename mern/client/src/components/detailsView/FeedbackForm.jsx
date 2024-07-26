import { Box, Button, FormControl, InputLabel, MenuItem, Modal, Select, Slide, Snackbar, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { postFeedback, Feedback } from '../../services/feedback';

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

export default function FeedbackForm({ location, isOpen, onClose }) {
  const [isFeedbackComplete, setIsFeedbackComplete] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [comment, setComment] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [conditions, setConditions] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [errors, setErrors] = useState({});

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
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
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
      onClose();
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
    onClose();
  };

  return (
    <>
      <Modal
        open={isOpen}
        onClose={handleCancel}
        closeAfterTransition
        sx={modalStyle}
      >
        <Slide direction="up"
          in={isOpen}
          mountOnEnter
          unmountOnExit>
          <Box data-test='feedback-form'
            sx={formStyle}>
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
              aria-label='Email'
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
      {isFeedbackComplete && (
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={handleSnackbarClose}
          message={snackbarMessage}
        />
      )}
    </>
  );
}
