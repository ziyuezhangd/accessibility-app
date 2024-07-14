import { List, Typography, ListItemButton, ListItemText, Box, Paper, Container } from '@mui/material';
import { lightBlue, cyan } from '@mui/material/colors';
import React from 'react';
import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';

export default function ResourcesPage() {
  return (
    <Container
      maxWidth={false}
      sx={{
        pt: { xs: 4, sm: 12 },
        pb: { xs: 8, sm: 16 },
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: { xs: 3, sm: 6 },
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        minHeight: '100vh',
        padding: '20px',
      }}
    >
      <Typography variant='h4' gutterBottom sx={{ textAlign: 'center', color: '#3f51b5', fontWeight: 'bold' }}>
        Resources
      </Typography>
      <Paper elevation={3} sx={{ padding: '20px', marginBottom: '20px', width: '100%', maxWidth: 1200, borderRadius: '12px', background: 'white' }}>
        <Box display="flex" alignItems="center" mb={2}>
          <AccessibilityNewIcon sx={{ color: '#3f51b5', mr: 1 }} />
          <Typography variant='h5' sx={{ color: '#3f51b5', fontWeight: 'bold', borderBottom: '2px solid #3f51b5', pb: 1 }}>
            Know your rights
          </Typography>
        </Box>
        <List>
          <ListItemButton component="a"
            target='_blank'
            href="https://www.access-board.gov/ada/guides/chapter-4-ramps-and-curb-ramps/">
            <ListItemText primary="ADA Ramp & Curb Standards" />
          </ListItemButton>
          <ListItemButton component="a"
            target='_blank'
            href="https://www.ada.gov/">
            <ListItemText primary="Americans with Disabilities Act (ADA)"
              secondary="Information on ADA rights and regulations." />
          </ListItemButton>
          <ListItemButton component="a"
            target='_blank'
            href="https://www.eeoc.gov/">
            <ListItemText primary="Equal Employment Opportunity Commission (EEOC)"
              secondary="Laws enforced by EEOC and information on filing a complaint." />
          </ListItemButton>
          <ListItemButton component="a"
            target='_blank'
            href="https://www.hud.gov/program_offices/fair_housing_equal_opp">
            <ListItemText primary="Fair Housing Act"
              secondary="Information on fair housing rights and protections." />
          </ListItemButton>
          <ListItemButton component="a"
            target='_blank'
            href="https://www.dol.gov/general/topic/disability/ada">
            <ListItemText primary="Department of Labor - ADA"
              secondary="Resources and information on ADA from the U.S. Department of Labor." />
          </ListItemButton>
        </List>
      </Paper>
      <Paper elevation={3} sx={{ padding: '20px', width: '100%', maxWidth: 1200, borderRadius: '12px', background: 'white' }}>
        <Box display="flex" alignItems="center" mb={2}>
          <DirectionsBusIcon sx={{ color: '#3f51b5', mr: 1 }} />
          <Typography variant='h5' sx={{ color: '#3f51b5', fontWeight: 'bold', borderBottom: '2px solid #3f51b5', pb: 1 }}>
            Public Transportation
          </Typography>
        </Box>
        <List>
          <ListItemButton component="a"
            target='_blank'
            href="https://new.mta.info/accessibility/access-a-ride">
            <ListItemText primary="Paratransit Access-A-Ride Service"
              secondary="Door-to-door on-demand transportation service for customers with disabilities or health conditions." />
          </ListItemButton>
          <ListItemButton component="a"
            target='_blank'
            href="https://contact.mta.info/s/customer-feedback">
            <ListItemText primary="MTA Feedback Form"
              secondary="Provide feedback on subway accessibility and programs." />
          </ListItemButton>
          <ListItemButton component="a"
            target='_blank'
            href="https://new.mta.info/accessibility/bus-stroller-areas">
            <ListItemText primary="Bus Open Stroller program"
              secondary="Information on program for making bus transportation more family-friendly." />
          </ListItemButton>
          <ListItemButton component="a"
            target='_blank'
            href="https://www.transit.dot.gov/regulations-and-guidance/civil-rights-ada/ada-regulations">
            <ListItemText primary="ADA Regulations for Public Transit"
              secondary="Federal guidelines on accessibility in public transportation." />
          </ListItemButton>
          <ListItemButton component="a"
            target='_blank'
            href="https://www.apta.com/research-technical-resources/mobility-innovation-hub/accessibility/">
            <ListItemText primary="American Public Transportation Association (APTA) Accessibility"
              secondary="Resources on accessibility from APTA." />
          </ListItemButton>
        </List>
      </Paper>
    </Container>
  );
}
