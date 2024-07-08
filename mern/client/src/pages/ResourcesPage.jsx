import { List, Typography, ListItemButton, ListItemText } from '@mui/material';
import React from 'react';

export default function ResourcesPage() {
  return (
    <div className='mt-20'>
      <Typography variant='h5'>
            Know your rights
      </Typography>
      <List>
        <ListItemButton component="a"
          target='_'
          href="https://www.access-board.gov/ada/guides/chapter-4-ramps-and-curb-ramps/">
          <ListItemText primary="ADA Ramp & Curb Standards" />
        </ListItemButton>
      </List>
      <Typography variant='h5'>
            Public Transportation
      </Typography>
      <List>
        <ListItemButton component="a"
          target='_'
          href="https://new.mta.info/accessibility/access-a-ride">
          <ListItemText primary="Paratransit Access-A-Ride Service"
            secondary="Door-to-door on-demand transportation service for customers with disabilities or health conditions." />
        </ListItemButton>
        <ListItemButton component="a"
          target='_'
          href="https://contact.mta.info/s/customer-feedback">
          <ListItemText primary="MTA Feedback Form"
            secondary="Provide feedback on subway accessibility and programs." />
        </ListItemButton>
        <ListItemButton component="a"
          target='_'
          href="https://new.mta.info/accessibility/bus-stroller-areas">
          <ListItemText primary="Bus Open Stroller program"
            secondary="Information on program for making bus transportation more family-friendly." />
        </ListItemButton>
      </List>
    </div>
  );
}
