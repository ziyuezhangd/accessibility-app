import React from 'react';
import { Control } from 'react-google-map-wrapper';
import { Button, Icon, IconButton } from '@mui/material';
import { Help } from '@mui/icons-material';

export default function HelpIcon() {
  const handleButtonClick = () => {
    // TODO
    console.log('Open menu')
  };

  return (
    <Control position={google.maps.ControlPosition.TOP_RIGHT}>
      <IconButton aria-label='help' aria-controls='help-button' aria-haspopup='true' onClick={handleButtonClick} color='secondary'>
        <Help sx={{fontSize: 40}}/>
      </IconButton>
    </Control>
  );
}
