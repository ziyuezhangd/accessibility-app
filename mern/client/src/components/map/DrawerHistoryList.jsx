import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { List, ListItem, TextField, Button, Box, Divider, ListItemButton, ListItemText, Typography, Modal, Backdrop, Fade, Snackbar, Slide } from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

export default function DrawerHistoryList({ onLocationSelected }) {
  const [history, setHistory] = useState([]);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [comment, setComment] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    getHistory();
  }, []);

  const getHistory = () => {
    const history = localStorage.getItem('searchHistory');
    if (history) {
      setHistory(JSON.parse(history));
    }
  };

  const handleFeedbackChange = (setter) => (event) => {
    setter(event.target.value);
  };

  const handleSubmitFeedback = () => {
    // Handle feedback submission (e.g., send to server)
    console.log('Feedback submitted:', { name, email, comment });
    setIsFeedbackOpen(false);
    setName('');
    setEmail('');
    setComment('');
    setSnackbarMessage('Feedback submitted successfully');
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  return (
    <>
      <DrawerHeader>
        <Typography variant='h5'>Last viewed</Typography>
      </DrawerHeader>
      <Box sx={{ overflow: 'auto' }}>
        <List>
          {history.map((text, index) => (
            <ListItem key={text}
              disablePadding>
              <ListItemButton onClick={() => onLocationSelected(text)}>
                <ListItemText primary={text} />
                <ChevronRightIcon />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        <Box sx={{ p: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setIsFeedbackOpen(true)}
          >
            Submit Feedback
          </Button>
        </Box>
      </Box>
      <Modal
        open={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={isFeedbackOpen}>
          <Box sx={style}>
            <Slide direction="up"
              in={isFeedbackOpen}
              mountOnEnter
              unmountOnExit>
              <Box>
                <Typography variant="h6"
                  component="h2">
                  Submit Feedback
                </Typography>
                <TextField
                  label="Name"
                  value={name}
                  onChange={handleFeedbackChange(setName)}
                  variant="outlined"
                  fullWidth
                  sx={{ mt: 2 }}
                />
                <TextField
                  label="Email"
                  value={email}
                  onChange={handleFeedbackChange(setEmail)}
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
                />
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleSubmitFeedback}
                  sx={{ mt: 2 }}
                >
                  Send
                </Button>
              </Box>
            </Slide>
          </Box>
        </Fade>
      </Modal>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />
    </>
  );
}
