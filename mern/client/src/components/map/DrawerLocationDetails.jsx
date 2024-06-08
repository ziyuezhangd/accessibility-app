import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'start',
}));

export default function DrawerLocationDetails({ location, onBackClicked }) {
  return (
    <>
      <DrawerHeader>
        <IconButton onClick={onBackClicked}>
          <ChevronLeftIcon />
        </IconButton>
      </DrawerHeader>
      <Box sx={{ overflow: 'auto' }}>
        <Typography variant='h5'>{location}</Typography>
        Hello
      </Box>
    </>
  );
}
