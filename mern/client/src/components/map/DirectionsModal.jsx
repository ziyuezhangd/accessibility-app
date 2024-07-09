import { Card, CardContent, ButtonGroup, Button, Typography } from '@mui/material';
import { green, red } from '@mui/material/colors';
import React, { useContext, useState } from 'react';
import { AdvancedMarker } from 'react-google-map-wrapper';
import { GoogleMapContext } from '../../providers/GoogleMapProvider';

export default function DirectionsModal({position, onDirectionsPositionSelected}) {
  const {createMarkers} = useContext(GoogleMapContext);

  const showDirectionsMarker = (type) => {
    if (type === 'from') {
      // Create a green marker
      createMarkers([{lat: position.lat, lng: position.lng, color: green[400] }]);
      onDirectionsPositionSelected('from');
    }

    if (type === 'to') {
      // Create a red marker
      createMarkers([{lat: position.lat, lng: position.lng, color: red[400] }]);
      onDirectionsPositionSelected('to');
    }
  };
  return (
    <AdvancedMarker lat={position.lat}
      lng={position.lng}>
      <ButtonGroup
        orientation="vertical"
        aria-label="Vertical button group"
        variant='contained'
      >
        <Typography variant='body2'
          style={{backgroundColor: 'white', padding: 6}}>Get directions</Typography>
        <Button key="from"
          onClick={() => showDirectionsMarker('from')}>From here</Button>
        <Button key="to"
          onClick={() => showDirectionsMarker('to')} >To here</Button>
      </ButtonGroup>

    </AdvancedMarker>
  );
}
