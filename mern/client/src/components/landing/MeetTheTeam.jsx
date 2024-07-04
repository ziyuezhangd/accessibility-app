import { Avatar, Container, Grid, Typography } from '@mui/material';
import abishekImage from '../../assets/abishek.png';
import aprilImage from '../../assets/april.png';
import danielleImage from '../../assets/danielle.jpg';
import ellenImage from '../../assets/ellen.png';
import nithishhImage from '../../assets/nithishh.jpg';
import thomasImage from '../../assets/thomas.jpg';

const nameStyles = {
  fontWeight: 600,
  fontSize: 20,
};
const titleStyles = {
  fontWeight: 200,
  fontSize: 16,
  mt: -0.5,
};

export default function MeetTheTeam() {
  return (
    <Container
      id='meet-the-team'
      maxWidth={false}
      sx={{
        pt: { xs: 4, sm: 12 },
        pb: { xs: 8, sm: 16 },
        position: 'relative',
        gap: { xs: 3, sm: 6 },
        height: '85vh',
      }}
    >
      <Typography component='h2'
        variant='h4'
        color='text.primary'
        sx={{ fontVariant: 'all-small-caps', fontWeight: '100', mb: 5 }}>
        Meet the team
      </Typography>
      <Grid container
        gap={3}
        columns={3}
        justifyContent='center'
        pb={10}>
        <Grid item
          sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Avatar alt='April Polubiec'
            src={aprilImage}
            sx={{ width: 300, height: 300, filter: 'grayscale(100%)' }} />
          <Typography sx={nameStyles}>April Polubiec</Typography>
          <Typography sx={titleStyles}>Coordination Lead</Typography>
        </Grid>
        <Grid item
          sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Avatar alt='Ellen Doherty'
            src={ellenImage}
            sx={{ width: 300, height: 300, filter: 'grayscale(100%)' }} />
          <Typography sx={nameStyles}>Ellen Doherty</Typography>
          <Typography sx={titleStyles}>Backend Lead</Typography>
        </Grid>
        <Grid item
          sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Avatar alt='Thomas Pollock'
            src={thomasImage}
            sx={{ width: 300, height: 300, filter: 'grayscale(100%)' }} />
          <Typography sx={nameStyles}>Thomas Pollock</Typography>
          <Typography sx={titleStyles}>Data Lead</Typography>
        </Grid>
        <Grid item
          sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Avatar alt='Ziyue Zhang'
            src={danielleImage}
            sx={{ width: 300, height: 300, filter: 'grayscale(100%)' }} />
          <Typography sx={nameStyles}>Ziyue Zhang</Typography>
          <Typography sx={titleStyles}>Maintenance Lead</Typography>
        </Grid>
        <Grid item
          sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Avatar alt='Abishek B'
            src={abishekImage}
            sx={{ width: 300, height: 300, filter: 'grayscale(100%)' }} />
          <Typography sx={nameStyles}>Abishek B</Typography>
          <Typography sx={titleStyles}>Frontend Lead</Typography>
        </Grid>
        <Grid item
          sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Avatar alt='Nithishh Saravanan'
            src={nithishhImage}
            sx={{ width: 300, height: 300, filter: 'grayscale(100%)' }} />
          <Typography sx={nameStyles}>Nithishh Saravanan</Typography>
          <Typography sx={titleStyles}>Customer Lead</Typography>
        </Grid>
      </Grid>
    </Container>
  );
}
