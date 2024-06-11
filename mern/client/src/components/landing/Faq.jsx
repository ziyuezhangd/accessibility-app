import { Container } from '@mui/material';
import { lightBlue } from '@mui/material/colors';
import React from 'react';

export default function Faq() {
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
        backgroundColor: lightBlue[100]
      }}
    >
        Faq here
    </Container>
  );
}
