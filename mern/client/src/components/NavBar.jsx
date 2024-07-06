import { Accessibility, FavoriteBorder, Delete, Margin } from '@mui/icons-material';
import MenuIcon from '@mui/icons-material/Menu';
import { List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Snackbar } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
// NavBar.jsx
import { Accessibility, Menu as MenuIcon } from '@mui/icons-material';
import { AppBar, Box, Button, Container, Menu, MenuItem, Toolbar, Typography, IconButton, Snackbar } from '@mui/material';
import * as React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserHistory, postUserHistory } from '../services/userHistory';
import Favorites from './detailsView/Favorites';

const pages = ['Map', 'About us'];

export const NavBar = () => {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState('');

  const navigate = useNavigate();

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = (e) => {
    setAnchorElNav(null);
    switch (e.target.innerText.toLowerCase()) {
    case 'map':
      navigate('/map');
      break;
    case 'about us':
      navigate('/about');
      break;
    default:
      break;
    }
  };

  const handleCloseFavorites = () => {
    setAnchorElFavorites(null);
  };

  const handleRemoveFavorite = (id) => {
    setFavorites(favorites.filter(favorite => favorite.id !== id));
    setSnackbarMessage('Removed from favorites');
    setSnackbarOpen(true);
  };

  React.useEffect(() => {
    const handleFavoriteAdded = (event) => {
      const newFavorite = event.detail;

      // Check if the favorite already exists
      const isAlreadyAdded = favorites.some(favorite => favorite.id === newFavorite.id);
      if (isAlreadyAdded) {
        setSnackbarMessage('This place is already in your favorites');
        setSnackbarOpen(true);
        return;
      }

      // Check if the favorites list has less than 5 items
      if (favorites.length < 5) {
        setFavorites([...favorites, newFavorite]);
        //here add to userHistoryDB
        if (profile){
          const name = profile.name;
          const email = profile.email;
          const favorites = newFavorite;
          postUserHistory(name, email, favorites);
        }
        setSnackbarMessage('Added to favorites');
      } else {
        setSnackbarMessage('Maximum of 5 favorites allowed');
      }
      setSnackbarOpen(true);
    };

    window.addEventListener('favoriteAdded', handleFavoriteAdded);

    return () => {
      window.removeEventListener('favoriteAdded', handleFavoriteAdded);
    };
  }, [favorites]);

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };
  //google login
  const [ user, setUser ] = useState([]);
  const [ profile, setProfile ] = useState([]);

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => setUser(codeResponse),
    onError: (error) => console.log('Login Failed:', error)
  });

  const logOut = () => {
    googleLogout();
    setProfile(null);
  };

  useEffect(
    () => {
      if (user) {
        axios
          .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
            headers: {
              Authorization: `Bearer ${user.access_token}`,
              Accept: 'application/json'
            }
          })
          .then((res) => {
            setProfile(res.data);
          })
          .catch((err) => console.log(err));
      }
    },
    [ user ]
  );
  
  return (
    <AppBar position='fixed'
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Container maxWidth='xl'>
        <Toolbar disableGutters>
          <Accessibility sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
          <Typography
            variant='h6'
            noWrap
            component='a'
            href='/'
            sx={{
              mr: 0,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            ACCESS
          </Typography>
          <Typography
            variant='h6'
            noWrap
            component='a'
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 300,
              letterSpacing: '0rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            NYC
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton size='large'
              aria-label='account of current user'
              aria-controls='menu-appbar'
              aria-haspopup='true'
              onClick={handleOpenNavMenu}
              color='inherit'>
              <MenuIcon />
            </IconButton>
            <Menu
              id='menu-appbar'
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page}
                  onClick={handleCloseNavMenu}>
                  <Typography textAlign='center'>{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Accessibility sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
          <Typography
            variant='h5'
            noWrap
            component='a'
            href='/'
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            ACCESS NYC
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button key={page}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: 'white', display: 'block' }}>
                {page}
              </Button>
            ))}
          </Box>

          <Box>
            <div style={{ margin: '20px' }}>
              {profile ? (
                <div>
                  <button onClick={logOut}>Log out</button>
                </div>
              ) : (
                <button onClick={login}>Sign in with Google </button>
              )}
            </div>
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
