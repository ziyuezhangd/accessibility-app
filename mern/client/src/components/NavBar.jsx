import { AppBar, Box, Button, Container, Menu, MenuItem, Toolbar, Typography, IconButton, Snackbar } from '@mui/material';
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import {AccessBarNoRouter} from 'aditum';
import axios from 'axios';
import * as React from 'react';
import { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Favorites from './navBar/Favorites';
import Logo from './navBar/Logo';
import { UserContext } from '../providers/UserProvider';

const pages = ['Map', 'About us', 'Resources'];

export const NavBar = () => {
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState('');
  const {userHistories} = useContext(UserContext);
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
            const userDetails = res.data;
            console.log(userDetails);
            const name = userDetails.name;
            const email = userDetails.email;
            console.log(email);
            if (userHistories) {
              userHistories.name = name;
              userHistories.email = email;
              console.log(userHistories.email);
            }
          })
          .catch((err) => console.log(err));
      }
    }, [user, userHistories]);
  
  return (
    <AppBar position='fixed'
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
