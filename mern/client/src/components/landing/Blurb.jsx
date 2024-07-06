import { Container, Typography } from '@mui/material';

export default function Blurb() {
  return (
    <Container data-test='blurb'
      id='blurb'
      maxWidth={false}
      sx={{
        pt: { xs: 4, sm: 12 },
        pb: { xs: 8, sm: 16 },
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '85vh',
      }}
    >
      <Typography variant='h1'
        fontFamily={'Playfair Display'}
        sx={{ mb: 4 }}>
        Welcome to Access NYC
      </Typography>
      <Typography variant='h5'
        component={'h2'}
        maxWidth={{ sm: 900 }}>
        Access NYC is your go-to resource for discovering wheelchair-friendly locations, accessible restaurants, and inclusive venues in New York City. Whether you&apos;re a local resident or a visitor, we make it easy for everyone to enjoy the
        vibrant city life without limitations.
      </Typography>
    </Container>
  );
}
