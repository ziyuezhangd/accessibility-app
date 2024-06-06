import React from 'react';
import Paper from '@mui/material/Paper';
import { Box, Card, CardContent, Grid, Typography } from '@mui/material';

export default function DetailsView() {
  return (
    <div className='h-screen absolute z-10'>
      <Paper className='h-screen w-80 p-5' elevation={4}>
        <Box sx={{ flexGrow: 1 }}>
          <Typography component='h1' variant='h5'>
            53rd & 1st
          </Typography>
          <Grid container spacing={1}>
            <Grid item xs={4}>
              <Card>
                <CardContent>
                  <Typography sx={{ fontSize: 14 }} color='text.secondary' gutterBottom>
                    Busyness
                  </Typography>
                  <Typography variant='h5' component='div'>
                    A
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={4}>
              <Card>
                <CardContent>
                  <Typography sx={{ fontSize: 14 }} color='text.secondary' gutterBottom>
                    Noise
                  </Typography>
                  <Typography variant='h5' component='div'>
                    A
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={4}>
              <Card>
                <CardContent>
                  <Typography sx={{ fontSize: 14 }} color='text.secondary' gutterBottom>
                    Odour
                  </Typography>
                  <Typography variant='h5' component='div'>
                    A
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          <Typography component='h2' variant='h6'>
            Nearby
          </Typography>
          <Typography component='h2' variant='h7'>
            Wheelchair accessible train stations
          </Typography>
          <Typography component='h2' variant='h7'>
            Wheelchair accessible restrooms
          </Typography>
        </Box>
      </Paper>
    </div>
  );
}
