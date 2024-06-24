// NavBar.jsx

import { Accessibility, FavoriteBorder } from '@mui/icons-material';
import MenuIcon from '@mui/icons-material/Menu';
import { List, ListItem, ListItemText } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
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

  const navigate = useNavigate();

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenFavorites = (event) => {
    setAnchorElFavorites(event.currentTarget);
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

  React.useEffect(() => {
    const handleFavoriteAdded = (event) => {
      setFavorites([...favorites, event.detail]);
    };

    window.addEventListener('favoriteAdded', handleFavoriteAdded);

    return () => {
      window.removeEventListener('favoriteAdded', handleFavoriteAdded);
    };
  }, [favorites]);

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

          <Box sx={{ flexGrow: 0 }}>
            <IconButton onClick={handleOpenFavorites}
              sx={{ p: 0 }}>
              <FavoriteBorder alt='Favorites'
                sx={{ color: 'white' }} />
            </IconButton>
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
                  <ListItem key={index} alignItems='flex-start'>
                    <ListItemText primary={`Place ID: ${favorite.id}`} secondary={`Lat: ${favorite.lat}, Lng: ${favorite.lng}`} />
                  </ListItem>
                ))}
              </List>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
