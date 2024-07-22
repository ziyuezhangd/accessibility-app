import { Container, Grid, Typography, Avatar, Link, Box, Paper, Divider } from '@mui/material';
import React from 'react';
import abishekImage from '../assets/abishek.png';
import aprilImage from '../assets/april.jpg';
import danielleImage from '../assets/danielle.jpg';
import ellenImage from '../assets/ellen.png';
import nithishhImage from '../assets/nithishh.jpg';
import thomasImage from '../assets/thomas.jpg';
import AdBanner from '../components/AdBanner';

const teamMembers = [
  {
    name: 'April Polubiec',
    title: 'Coordination Lead',
    image: aprilImage,
    github: 'https://github.com/aprilpolubiec',
  },
  {
    name: 'Ellen Doherty',
    title: 'Backend Lead',
    image: ellenImage,
    github: 'https://github.com/ellendoherty',
  },
  {
    name: 'Thomas Pollock',
    title: 'Data Lead',
    image: thomasImage,
    github: 'https://github.com/thomaspollock',
  },
  {
    name: 'Ziyue Zhang',
    title: 'Maintenance Lead',
    image: danielleImage,
    github: 'https://github.com/ziyuezhang',
  },
  {
    name: 'Abishek B',
    title: 'Frontend Lead',
    image: abishekImage,
    github: 'https://github.com/abishekb',
  },
  {
    name: 'Nithishh Saravanan',
    title: 'Customer Lead',
    image: nithishhImage,
    github: 'https://github.com/nithishhsaravanan',
  },
];

const AboutUs = () => {
  return (
    <Container
      id="about-us"
      maxWidth={false}
      sx={{
        pt: { xs: 4, sm: 12 },
        pb: { xs: 8, sm: 16 },
        background: 'linear-gradient(180deg, #FFFFFF 0%, #F9F9F9 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: 6,
        backgroundImage: `url('https://www.transparenttextures.com/patterns/diamond-upholstery.png')`,
        backgroundSize: 'cover',
      }}
      aria-labelledby="About Us"
    >
      <Typography
        component="h2"
        variant="h3"
        color="primary"
        sx={{
          fontVariant: 'all-small-caps',
          fontWeight: 'bold',
          mb: 3,
          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)',
        }}
      >
        About Us
      </Typography>

      <Box
        sx={{
          mb: 5,
          maxWidth: 900,
          textAlign: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          p: 4,
          borderRadius: 2,
          boxShadow: 3,
          transition: 'transform 0.3s ease-in-out',
          '&:hover': {
            transform: 'scale(1.05)',
          },
        }}
      >
        <Typography variant="h4"
          gutterBottom
          color="secondary">
          Who we are
        </Typography>
        <Typography variant="body1"
          paragraph>
          We are a team of students at the University College Dublin (UCD) passionate about improving accessibility in urban areas.
        </Typography>
        <Divider sx={{ my: 3 }} />
        <Typography variant="h4"
          gutterBottom
          color="secondary">
          What the purpose of our application is
        </Typography>
        <Typography variant="body1"
          paragraph>
          Our application, Access NYC, aims to help users find wheelchair-friendly locations, accessible restaurants, and inclusive venues in New York City.
        </Typography>
        <Divider sx={{ my: 3 }} />
        <Typography variant="h4"
          gutterBottom
          color="secondary">
          Why this is important
        </Typography>
        <Typography variant="body1"
          paragraph>
          Accessibility is a crucial aspect of urban living, ensuring that all individuals, regardless of their physical abilities, can enjoy and participate in the vibrant life of the city. Our application seeks to make this information easily accessible, promoting inclusivity and improving quality of life.
        </Typography>
      </Box>

      <Typography
        component="h2"
        variant="h3"
        color="primary"
        sx={{
          fontVariant: 'all-small-caps',
          fontWeight: 'bold',
          mb: 3,
          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)',
        }}
      >
        Meet the Team
      </Typography>

      <Grid container
        spacing={4}
        justifyContent="center">
        {teamMembers.map((member) => (
          <Grid
            item
            key={member.name}
            xs={12}
            sm={6}
            md={4}
            lg={3}
            sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          >
            <Paper
              elevation={6}
              sx={{
                padding: 3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                borderRadius: 4,
                transition: 'box-shadow 0.3s ease-in-out, transform 0.3s ease-in-out',
                '&:hover': {
                  boxShadow: 8,
                  transform: 'scale(1.05)',
                },
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
              }}
            >
              <Avatar
                alt={member.name}
                src={member.image}
                sx={{
                  width: 150,
                  height: 150,
                  mb: 2,
                  border: '4px solid #1976d2',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                }}
              />
              <Typography sx={{ fontWeight: 600, fontSize: 20 }}>{member.name}</Typography>
              <Typography sx={{ fontWeight: 200, fontSize: 16, mt: -0.5 }}>
                {member.title}
              </Typography>
              <Link
                href={member.github}
                target="_blank"
                rel="noopener"
                sx={{ mt: 1, color: 'primary.main', fontSize: 14 }}
              >
                GitHub Profile
              </Link>
            </Paper>
          </Grid>
        ))}
      </Grid>
      <AdBanner />
    </Container>
  );
};

export default AboutUs;
