import { Container } from '@mui/material';
import React from 'react';

export default function Blurb() {
  return (
    <div>
      <Container
        id='features'
        maxWidth={false}
        sx={{
          m: 0,
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
        Blurb here
      </Container>
    </div>
  );
}
