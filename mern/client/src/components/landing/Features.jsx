import { Chat, Search, Subway, Whatshot } from '@mui/icons-material';
import { Grid, Container, Typography, Box, Paper } from '@mui/material';
import { cyan } from '@mui/material/colors';

export default function Features() {
  const features = [
    {
      title: 'Accessibility heatmap',
      description: 'See the busyness, odor and noise levels across the entire city.',
      icon: <Whatshot fontSize='large' />,
    },
    {
      title: 'Subway station accessibility',
      description: 'Find subway stations with accessible entrances',
      icon: <Subway fontSize='large' />,
    },
    {
      title: 'Search by location',
      description: 'Discover destinations which accommodate to your needs',
      icon: <Search fontSize='large' />,
    },
    {
      title: 'Provide feedback',
      description: 'Help keep our information up-to-date and accurate',
      icon: <Chat fontSize='large' />,
    },
  ];
  return (
    <Container data-test='features'
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
      aria-labelledby='List of features'
    >
      <Box
        sx={{
          width: { sm: '100%', md: '60%' },
          textAlign: { sm: 'left', md: 'center' },
        }}
      >
        <Typography component='h2'
          variant='h4'
          color='text.primary'
          sx={{ fontVariant: 'all-small-caps', fontWeight: '100' }}>
          Features
        </Typography>
        <Typography color='text.primary'
          sx={{ fontSize: 24 }}>
          Explore the city with ease using our platform&apos;s features.
        </Typography>
      </Box>
      <Grid container
        spacing={2}>
        {features.map((feature, index) => (
          <Grid item
            xs={12}
            sm={6}
            md={6}
            key={index}
            sx={{ display: 'flex' }}>
            <Paper
              elevation={0}
              square={false}
              sx={{
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                flexGrow: 1,
                p: 5,
                backgroundColor: cyan[50],
                minHeight: '200px',
              }}
            >
              <Box sx={{ width: 100 }}>{feature.icon}</Box>
              <Box sx={{ textAlign: 'left'}}>
                <Typography variant='h5'
                  color='text.primary'
                  fontSize={24}
                  pb={2}>
                  {feature.title}
                </Typography>
                <Typography variant='body'
                  color='text.secondary'
                  fontSize={20}>
                  {feature.description}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
