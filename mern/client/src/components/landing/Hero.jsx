import { Button, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function Hero() {
  const navigate = useNavigate();
  const handleGetStartedClicked = () => {
    navigate('/map');
  };

  return (
    <Container data-test='hero'
      id='hero'
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
        fontFamily={'Playfair Display'}>
        Discover Accessible Areas in NYC
      </Typography>
      <Typography variant='h4'
        component={'h2'}
        sx={{ mb: 4 }}>
        Find the best spots that cater to your needs
      </Typography>
      <Button variant='contained'
        size='large'
        aria-labelledby='Button to go to map'
        onClick={handleGetStartedClicked}>
        Get started
      </Button>
      <Button variant='text'>Learn more</Button>
    </Container>
  );
}
