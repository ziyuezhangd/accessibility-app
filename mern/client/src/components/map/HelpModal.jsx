import { Modal, Typography, Box, Paper, Grid, Button } from '@mui/material';
import React from 'react';
import clickRoadImage from '../../assets/click-road.png';
import heartImage from '../../assets/heart.png';
import restaurantMarkerImage from '../../assets/restaurant-marker.png';
import selectDateImage from '../../assets/select-date.png';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '75vw',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function HelpModal({ isOpen, onClose }) {
  const handleButtonClicked = () => {
    onClose();
  }

  return (
    <Modal open={isOpen} onClose={onClose} aria-labelledby='modal-modal-title' aria-describedby='modal-modal-description'>
      <Box sx={style}>
        <Typography id='modal-modal-title' variant='h4' component='h2'>
          How it works
        </Typography>
        <Grid container spacing={2} marginTop={5} sx={{ display: 'flex', justifyContent: 'center'}}>
          <Grid item xs={12} sm={3} md={3} sx={{ display: 'flex' }}>
            <Paper
              elevation={0}
              square='false'
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'start',
                flexGrow: 1,
                p: 1,
                height: '400px',
              }}
            >
              <img src={selectDateImage} alt='Description of the image' style={{ width: 150, height: 150 }} />
              <Typography variant='h6' component='h1'>
                Pick a date and time
              </Typography>
              <Typography variant='subtitle1' component='h1'>
                See the predicted busyness, noise and odour levels across Manhattan on any day or time.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={3} md={3} sx={{ display: 'flex' }}>
            <Paper
              elevation={0}
              square='false'
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'start',
                flexGrow: 1,
                p: 1,
                height: '400px',
              }}
            >
              <img src={clickRoadImage} alt='Description of the image' style={{ width: 150, height: 150 }} />
              <Typography variant='h6' component='h1'>
                Click for details
              </Typography>
              <Typography variant='subtitle1' component='h1'>
                Learn more about the selected street to see it's busyness, noise and odour scores as well as nearby accessible points of interest.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={3} md={3} sx={{ display: 'flex' }}>
            <Paper
              elevation={0}
              square='false'
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'start',
                flexGrow: 1,
                p: 1,
                height: '400px',
              }}
            >
              <img src={restaurantMarkerImage} alt='Description of the image' style={{ width: 150, height: 150 }} />
              <Typography variant='h6' component='h1'>
                Search for businesses
              </Typography>
              <Typography variant='subtitle1' component='h1'>
                Find restaurants and attractions to gauge the busyness levels in that area. Click on a business to see accessibility details.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={3} md={3} sx={{ display: 'flex' }}>
            <Paper
              elevation={0}
              square='false'
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'start',
                flexGrow: 1,
                p: 1,
                height: '400px',
              }}
            >
              <img src={heartImage} alt='Description of the image' style={{ width: 150, height: 150 }} />

              <Typography variant='h6' component='h1'>
                Save your favorites.
              </Typography>
              <Typography variant='subtitle1' component='h1'>
                Keep track of your favorite places so you can quickly check in on predictions.
              </Typography>
            </Paper>
          </Grid>
          <Button variant='contained' onClick={handleButtonClicked}>Get started</Button>
        </Grid>
      </Box>
    </Modal>
  );
}
