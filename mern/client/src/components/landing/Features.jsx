import { Grid, Container, Typography, Box, Paper } from '@mui/material';
import { cyan } from '@mui/material/colors';
import React from 'react';

export default function Features() {
  const features = [
    {
      title: 'Accessibility heatmap',
      description: 'See the busyness, odor and noise levels across the entire city.',
    },
    {
      title: 'Subway station accessibility',
      description: 'Find subway stations with accessible entrances',
    },
    {
      title: 'Search by location',
      description: 'Discover destinations which accommodate to your needs',
    },
    {
      title: 'Provide feedback',
      description: 'Help keep our information up-to-date and accurate',
    },
  ];
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
        backgroundColor: cyan[100],
        height: '85vh',
      }}
    >
      <Box
        sx={{
          width: { sm: '100%', md: '60%' },
          textAlign: { sm: 'left', md: 'center' },
        }}
      >
        <Typography component='h2' variant='h4' color='text.primary'>
          Features
        </Typography>
        <Typography variant='body1' color='text.secondary'>
          Explore the city with ease using our platform features.
        </Typography>
      </Box>
      <Grid container spacing={2}>
        {features.map((feature, index) => (
          <Grid item xs={12} sm={6} md={6} key={index} sx={{ display: 'flex' }}>
            <Paper
              elevation={0}
              square='false'
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'start',
                flexGrow: 1,
                p: 1,
                backgroundColor: cyan[50],
                height: '150px',
              }}
            >
              {/* ICON HERE */}
              <Typography variant='h5' color='text.primary'>
                {feature.title}
              </Typography>
              <Typography variant='body' color='text.secondary'>
                {feature.description}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
