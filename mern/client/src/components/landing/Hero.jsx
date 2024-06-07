import React from 'react';
import { Button, Container, Typography } from '@mui/material';

export default function Hero() {
  return (
    <Container
      id='features'
      maxWidth={false}
      sx={{
        pt: { xs: 4, sm: 12 },
        pb: { xs: 8, sm: 16 },
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: { xs: 3, sm: 6 },
        height: '85vh',
      }}
    >
      <Typography variant='h1'>Discover Accessible Areas in NYC</Typography>
      <Typography variant='h2'>Find the best spots that cater to your needs</Typography>
      <Button variant='contained'>Get started</Button>
      <Button variant='text'>Learn more</Button>
    </Container>
  );
}
