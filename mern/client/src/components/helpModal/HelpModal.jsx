import { ArrowBack, ArrowForward } from '@mui/icons-material';
import { Modal, Typography, Box, Paper, Grid, Button, IconButton } from '@mui/material';
import { useState } from 'react';
import clickRoadImage from '../../assets/click-road.png';
import directions from '../../assets/directions.png';
import heartImage from '../../assets/heart.png';
import placeinfo from '../../assets/placeinfo.png';
import ramps from '../../assets/ramps.png';
import restaurantMarkerImage from '../../assets/restaurant-marker.png';
import selectDateImage from '../../assets/select-date.png';
import toggleInfoIcon from '../../assets/toggleinfo.png';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '75vw',
  height: '50vh', // height
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
};

const instructions = [
  {
    image: selectDateImage,
    title: 'Pick a Date and Time',
    description: 'See predicted busyness, noise, and odor levels across Manhattan for any day and time.',
  },
  {
    image: clickRoadImage,
    title: 'Click for Details',
    description: 'Learn about the selected street’s busyness, noise, and odor scores, and nearby accessible points of interest.',
  },
  {
    image: restaurantMarkerImage,
    title: 'Search for Businesses',
    description: 'Find restaurants and attractions, and gauge busyness levels. Click on a business for accessibility details.',
  },
  {
    image: heartImage,
    title: 'Save Your Favorites',
    description: 'Click "Add to Favorites" on a place to save it. Remove it with the "Delete" icon in the favorites list or by clicking the favorites icon in the drawer when a place is selected.',
  },
  {
    image: directions,
    title: 'Direction Feature',
    description: 'Right-click to select "Get Directions" and set directions between two points. Drag the route to avoid busy areas using the busyness heatmap.',
  },
  {
    image: toggleInfoIcon,
    title: 'Toggle Features',
    description: 'Filter place info markers by category using the dropdown. Toggle the display of wheelchair ramps, pedestrian signals, and seating areas using the switches.',
  },
  {
    image: ramps,
    title: 'Wheelchair Ramps and Seating Areas',
    description: 'Hover over wheelchair ramps for width details. Hover over seating areas for location and seat type information.',
  },
  {
    image: placeinfo,
    title: 'Place Info Markers',
    description: 'Markers indicate wheelchair accessible locations. Click to see details like category, restroom availability, nearest accessible restrooms, and operational status of subway stations.',
  },
];

export default function HelpModal({ isOpen, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const instructionsPerPage = 3;
  const [flippedIndex, setFlippedIndex] = useState(null);

  const handleButtonClicked = () => {
    onClose();
  };

  const handleDontShowAgain = () => {
    localStorage.setItem('dontShowAgain', true);
    onClose();
  };

  const handleNext = () => {
    if (currentIndex < Math.ceil(instructions.length / instructionsPerPage) - 1) {
      setCurrentIndex(currentIndex + 1);
      setFlippedIndex(null); // Reset flipped state when navigating
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setFlippedIndex(null); // Reset flipped state when navigating
    }
  };

  const startIndex = currentIndex * instructionsPerPage;
  const endIndex = startIndex + instructionsPerPage;
  const currentInstructions = instructions.slice(startIndex, endIndex);

  const handleCardClick = (index) => {
    setFlippedIndex(index === flippedIndex ? null : index);
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'
    >
      <Box data-test='help-modal'
        sx={style}>
        <Typography id='modal-modal-title'
          variant='h4'
          component='h2'
          sx={{ fontWeight: 'bold', mb: 3 }}>
          How It Works
        </Typography>
        <Grid
          container
          spacing={2}
          sx={{ flexGrow: 1, alignItems: 'center' }}>
          <Grid item
            xs={1}>
            <IconButton onClick={handlePrevious}
              disabled={currentIndex === 0}
              sx={{
                bgcolor: 'primary.main',
                color: 'white',
                '&:hover': {
                  bgcolor: 'primary.dark',
                  transform: 'scale(1.1)',
                },
                transition: 'transform 0.2s',
              }}>
              <ArrowBack />
            </IconButton>
          </Grid>
          <Grid item
            xs={10}
            container
            spacing={2}
            justifyContent='center'>
            {currentInstructions.map((instruction, index) => (
              <Grid item
                xs={4}
                key={index}>
                <Box
                  onClick={() => handleCardClick(startIndex + index)}
                  sx={{
                    perspective: 1000,
                    height: '300px', //  height for the flip box
                    cursor: 'pointer',
                  }}
                >
                  <Paper
                    elevation={3}
                    sx={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      padding: 2,
                      transition: 'transform 0.6s',
                      transformStyle: 'preserve-3d',
                      transform: flippedIndex === (startIndex + index) ? 'rotateY(180deg)' : 'none',
                      position: 'relative',
                    }}
                  >
                    <Box
                      sx={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        backfaceVisibility: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <img src={instruction.image}
                        alt='Description of the image'
                        style={{ width: 120, height: 120 }} />
                      <Typography variant='h6'
                        component='h1'
                        sx={{ mt: 2, mb: 1, textAlign: 'center' }}>
                        {instruction.title}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        backfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: 2,
                        bgcolor: 'background.paper',
                      }}
                    >
                      <Typography variant='body1'
                        component='p'
                        sx={{ textAlign: 'center' }}>
                        {instruction.description}
                      </Typography>
                    </Box>
                  </Paper>
                </Box>
              </Grid>
            ))}
          </Grid>
          <Grid item
            xs={1}>
            <IconButton onClick={handleNext}
              disabled={currentIndex === Math.ceil(instructions.length / instructionsPerPage) - 1}
              sx={{
                bgcolor: 'primary.main',
                color: 'white',
                '&:hover': {
                  bgcolor: 'primary.dark',
                  transform: 'scale(1.1)',
                },
                transition: 'transform 0.2s',
              }}>
              <ArrowForward />
            </IconButton>
          </Grid>
        </Grid>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 2 }}>
          {[...Array(Math.ceil(instructions.length / instructionsPerPage))].map((_, idx) => (
            <Box key={idx}
              sx={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: currentIndex === idx ? 'black' : 'grey', margin: '0 5px' }} />
          ))}
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
          <Button variant='contained'
            onClick={handleButtonClicked}>
            Get Started
          </Button>
          <Button variant='contained'
            onClick={handleDontShowAgain}>
            Dont Show This Again
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
