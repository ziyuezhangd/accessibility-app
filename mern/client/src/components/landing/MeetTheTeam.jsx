import { Container } from '@mui/material';

export default function MeetTheTeam() {
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
        Meet the team here
    </Container>
  );
}
