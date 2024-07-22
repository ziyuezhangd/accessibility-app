import { Container, Grid, Typography } from '@mui/material';
import { lightBlue } from '@mui/material/colors';

export default function Faq() {
  return (
    <Container
      id='faq'
      maxWidth={false}
      sx={{
        pt: { xs: 4, sm: 12 },
        pb: { xs: 8, sm: 16 },
        minHeight: '85vh',
        backgroundColor: lightBlue[100],
        display: 'flex',
        alignItems: 'center',
      }}
      aria-labelledby='Frequently asked questions'
    >
      <Grid container
        spacing={3}>
        <Grid item
          xs={12}
          sm={4}
          md={4}
          textAlign={'left'}>
          <Typography component='h2'
            variant='h4'
            color='text.primary'
            sx={{ fontVariant: 'all-small-caps', fontWeight: '100' }}>
            FAQ
          </Typography>
          <Typography variant='h1'
            color='text.primary'
            fontFamily={'Playfair Display'}
            mb={5}
            sx={{fontSize: {xs: 50, md: 72}}}>
            Common Questions
          </Typography>
          <Typography variant='h5'
            component='h2'>
            Here are some of the most common questions that we get.
          </Typography>
        </Grid>
        <Grid item
          maxWidth={900}
          textAlign={'left'}>
          <Typography color='text.primary'
            mb={1}
            fontWeight='500'
            fontSize={24}>
            How can I search for accessible areas in NYC?
          </Typography>
          <Typography color='text.primary'
            mb={3}
            fontWeight='100'
            fontSize={20}>
            You can use the search bar on our website to look for accessible areas in NYC by entering keywords or locations.
          </Typography>

          <Typography color='text.primary'
            mb={1}
            fontWeight='500'
            fontSize={24}>
            Are all the listed areas guaranteed to be fully accessible?
          </Typography>
          <Typography color='text.primary'
            mb={3}
            fontWeight='100'
            fontSize={20}>
            While we strive to provide accurate information, we recommend contacting the venues directly to ensure their accessibility meets your specific needs.{' '}
          </Typography>
          <Typography color='text.primary'
            mb={1}
            fontWeight='500'
            fontSize={24}>
            Is there a mobile app available for accessing this information on the go?
          </Typography>
          <Typography color='text.primary'
            mb={3}
            fontWeight='100'
            fontSize={20}>
            No, not yet. This website is designed to be responsive on all devices. If you experience any issues, please contact us.{' '}
          </Typography>
        </Grid>
      </Grid>
    </Container>
  );
}
