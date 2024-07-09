import { Box, Button, Container, Menu, Toolbar, Snackbar } from '@mui/material';
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
    <AppBar data-test='app-bar'
      position='fixed'
      id='app-bar'
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <AccessBarNoRouter/>
      <Container maxWidth='xl'>
        <Toolbar disableGutters>
          <Logo isClickable={true}/>
          <Box sx={{ flexGrow: 1, display: 'flex'}}>
            {pages.map((page) => (
              <Button key={page}
                onClick={handlePageSelected}
                sx={{ my: 2, color: 'white', display: 'block' }}>
                {page}
              </Button>
            ))}
          </Box>
          <Box sx={{ flexGrow: 0 }}>
            <Favorites />
          </Box>
        </Toolbar>
      </Container>
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
