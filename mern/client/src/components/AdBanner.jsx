import { Box, TextField, Button, Typography } from '@mui/material';
import React, { useState } from 'react';

const AdBanner = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(email)) {
      // Here you would handle the email submission, e.g., sending it to a server
      console.log('Email submitted:', email);
      setSubmitted(true);
      setError('');
    } else {
      setError('Please enter a valid email address.');
    }
  };

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        my: 4,
      }}
    >
      <Box data-test='ad'
        sx={{
          width: '100%',
          maxWidth: 600,
          backgroundColor: 'white',
          borderRadius: 2,
          boxShadow: 3,
          p: 3,
          textAlign: 'center',
        }}
      >
        {!submitted ? (
          <>
            <Typography variant="h6"
              component="p"
              sx={{ mb: 2 }}>
              Enroll into our Beta program
            </Typography>
            <Typography variant="body1"
              component="p"
              sx={{ mb: 2 }}>
              Sign up to be a beta tester and get early access to our app. Help improve our data!
            </Typography>
            <Box component="form"
              onSubmit={handleSubmit}
              sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
              <TextField data-test='email-textfield'
                label="Enter your email"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{ mb: 2, width: '100%' }}
                error={!!error}
                helperText={error}
              />
              <Button type="submit"
                variant="contained"
                color="primary">
                Sign Up
              </Button>
            </Box>
          </>
        ) : (
          <Typography variant="h6"
            component="p">
            Thanks for joining our beta program
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default AdBanner;
