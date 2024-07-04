import { Accessibility, FavoriteBorder, Delete } from '@mui/icons-material';
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
import * as React from 'react';
import { useNavigate } from 'react-router-dom';

const pages = ['Map', 'About us'];

export const NavBar = () => {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElFavorites, setAnchorElFavorites] = React.useState(null);
  const [favorites, setFavorites] = React.useState([]);
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState('');

  const navigate = useNavigate();

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenFavorites = (event) => {
    if (favorites.length > 0) {
      setAnchorElFavorites(event.currentTarget);
    } else {
      setSnackbarMessage('No favorite places added yet');
      setSnackbarOpen(true);
    }
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

  return (
    <AppBar position='fixed'
      id='app-bar'
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

          <Box sx={{ flexGrow: 0 }}>
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
                          onClick={() => handleRemoveFavorite(favorite.id)}>
                          <Delete />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              </Menu>
            )}
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
