// Favorites.jsx
import { FavoriteBorder, Delete } from '@mui/icons-material';
import { List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Menu, Snackbar } from '@mui/material';
import _ from 'lodash';
import * as React from 'react';

export const Favorites = () => {
  const [anchorElFavorites, setAnchorElFavorites] = React.useState(null);
  const [favorites, setFavorites] = React.useState([]);
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState('');

  React.useEffect(() => {
    console.log('Fetching favorites from localStorage');
    const storedFavorites = localStorage.getItem('favorites');
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
      console.log('Favorites loaded:', JSON.parse(storedFavorites));
    } else {
      console.log('No favorites found in localStorage');
    }
  }, []);

  React.useEffect(() => {
    console.log('Updating localStorage with new favorites:', favorites);
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const handleOpenFavorites = (event) => {
    if (favorites.length > 0) {
      setAnchorElFavorites(event.currentTarget);
    } else {
      setSnackbarMessage('No favorite places added yet');
      setSnackbarOpen(true);
    }
  };

  const handleCloseFavorites = () => {
    setAnchorElFavorites(null);
  };

  const handleRemoveFavorite = (placeId) => {
    console.log('Removing favorite with placeId:', placeId);
    setFavorites(favorites.filter(favorite => favorite.placeId !== placeId));
    setSnackbarMessage('Removed from favorites');
    setSnackbarOpen(true);
    const event = new CustomEvent('favoriteRemoved', { detail: { placeId } });
    window.dispatchEvent(event);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  React.useEffect(() => {
    const handleFavoriteAdded = (event) => {
      const newFavorite = event.detail;
      console.log('Adding new favorite:', newFavorite);
      console.log('New favorite placeId:', newFavorite.placeId);
      
      if (!newFavorite.placeId) {
        console.error('New favorite does not have a placeId:', newFavorite);
        setSnackbarMessage('Failed to add favorite, missing placeId');
        setSnackbarOpen(true);
        return;
      }
      
      let storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
      console.log('Current stored favorites:', storedFavorites);

      // Check if the favorite already exists
      const isAlreadyAdded = storedFavorites.some(favorite => {
        console.log('Checking favorite placeId:', favorite.placeId);
        return favorite.placeId === newFavorite.placeId;
      });
      if (isAlreadyAdded) {
        setSnackbarMessage('This place is already in your favorites');
        setSnackbarOpen(true);
        console.log('Favorite already exists:', newFavorite);
        return;
      }

      // Check if the favorites list has less than 5 items
      if (storedFavorites.length < 5) {
        storedFavorites = [newFavorite, ...storedFavorites];
        setFavorites(storedFavorites);
        localStorage.setItem('favorites', JSON.stringify(storedFavorites));
        setSnackbarMessage('Added to favorites');
        console.log('Added to favorites:', newFavorite);
      } else {
        setSnackbarMessage('Maximum of 5 favorites allowed');
        console.log('Cannot add more than 5 favorites');
      }
      setSnackbarOpen(true);
    };

    const handleFavoriteRemoved = (event) => {
      const removedFavorite = event.detail;
      console.log('Removing favorite:', removedFavorite);
      setFavorites(prevFavorites => prevFavorites.filter(favorite => favorite.placeId !== removedFavorite.placeId));
      setSnackbarMessage('Removed from favorites');
      setSnackbarOpen(true);
    };

    window.addEventListener('favoriteAdded', handleFavoriteAdded);
    window.addEventListener('favoriteRemoved', handleFavoriteRemoved);

    return () => {
      window.removeEventListener('favoriteAdded', handleFavoriteAdded);
      window.removeEventListener('favoriteRemoved', handleFavoriteRemoved);
    };
  }, []);

  return (
    <>
      <IconButton onClick={handleOpenFavorites}
        sx={{ p: 0 }}>
        <FavoriteBorder alt='Favorites'
          sx={{ color: 'white' }} />
      </IconButton>
      {favorites.length > 0 && (
        <Menu
          sx={{ mt: '45px' }}
          id='menu-appbar'
          anchorEl={anchorElFavorites}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={Boolean(anchorElFavorites)}
          onClose={handleCloseFavorites}
        >
          <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
            {favorites.map((favorite, index) => (
              <ListItem key={index}
                alignItems='flex-start'>
                <ListItemText primary={favorite.name} />
                <ListItemSecondaryAction>
                  <IconButton edge="end"
                    aria-label="delete"
                    onClick={() => handleRemoveFavorite(favorite.placeId)}>
                    <Delete />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Menu>
      )}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />
    </>
  );
};

export default Favorites;
