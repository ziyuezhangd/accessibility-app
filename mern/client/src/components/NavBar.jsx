import { Box, Button, Toolbar, Snackbar } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import {AccessBarNoRouter} from 'aditum';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import Favorites from './navBar/Favorites';
import Logo from './navBar/Logo';

const pages = ['Map', 'About us', 'Resources'];

export const NavBar = () => {
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState('');

  const navigate = useNavigate();

  const handlePageSelected = (e) => {
    switch (e.target.innerText.toLowerCase()) {
    case 'map':
      navigate('/map');
      break;
    case 'about us':
      navigate('/about');
      break;
    case 'resources':
      navigate('/resources');
      break;
    default:
      break;
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  return (
    <AppBar position='fixed'
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <AccessBarNoRouter/>
      <Toolbar disableGutters
        sx={{ justifyContent: 'space-between', px: 5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Logo isClickable={true} />
          <Box sx={{ display: 'flex', ml: 17 }}> {/* Adjust ml value to move the buttons */}
            {pages.map((page) => (
              <Button
                key={page}
                onClick={handlePageSelected}
                sx={{
                  my: 2,
                  color: 'white',
                  display: 'block',
                  position: 'relative',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    left: 0,
                    bottom: 0,
                    width: '100%',
                    height: '2px',
                    backgroundColor: 'white',
                    transform: 'scaleX(0)',
                    transformOrigin: 'bottom left',
                    transition: 'transform 0.3s ease-out',
                  },
                  '&:hover::after': {
                    transform: 'scaleX(1)',
                  },
                }}
              >
                {page}
              </Button>
            ))}
          </Box>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Favorites />
        </Box>
      </Toolbar>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />
    </AppBar>
  );
};

export default NavBar;
