import { FavoriteBorder, Delete } from '@mui/icons-material';
import { List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Menu, Snackbar } from '@mui/material';
import * as React from 'react';
import { useContext, useEffect, useState } from 'react';
import { UserContext} from '../../providers/UserProvider';
import { postUserHistory } from '../../services/userHistory';

export const Favorites = () => {
  const [anchorElFavorites, setAnchorElFavorites] = React.useState(null);
  const [favorites, setFavorites] = React.useState([]);
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState('');
  const {UserHistory} = useContext(UserContext);

  // Load favorites from localStorage on component mount
  React.useEffect(() => {
    const storedFavorites = localStorage.getItem('favorites');
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

  // Update localStorage whenever the favorites state changes
  React.useEffect(() => {
    if (favorites.length > 0) {
      localStorage.setItem('favorites', JSON.stringify(favorites));
    } else {
      localStorage.removeItem('favorites');
    }
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
    const updatedFavorites = favorites.filter(favorite => favorite.placeId !== placeId);
    setFavorites(updatedFavorites);
    setSnackbarMessage('Removed from favorites');
    setSnackbarOpen(true);

    const event = new CustomEvent('favoriteRemoved', { detail: { placeId } });
    window.dispatchEvent(event);
  };

  const handleFavoriteClick = (favorite) => {
    const event = new CustomEvent('favoriteSelected', { detail: favorite });
    window.dispatchEvent(event);
    handleCloseFavorites();
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
      let storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];

      const isAlreadyAdded = storedFavorites.some(favorite => favorite.placeId === newFavorite.placeId);
      if (isAlreadyAdded) {
        setSnackbarMessage('This place is already in your favorites');
        if (UserHistory){
          const name = UserHistory.name;
          const email = UserHistory.email;
          const favorites = newFavorite;
          postUserHistory(name, email, favorites);
        }
        setSnackbarOpen(true);
        return;
      }

      if (storedFavorites.length < 5) {
        storedFavorites = [newFavorite, ...storedFavorites];
        setFavorites(storedFavorites);
        setSnackbarMessage('Added to favorites');
      } else {
        setSnackbarMessage('Maximum of 5 favorites allowed');
      }
      setSnackbarOpen(true);
    };

    const handleFavoriteRemoved = (event) => {
      const removedFavorite = event.detail;
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
                alignItems='flex-start'
                onClick={() => handleFavoriteClick(favorite)}
                sx={{ cursor: 'pointer' }}>
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
