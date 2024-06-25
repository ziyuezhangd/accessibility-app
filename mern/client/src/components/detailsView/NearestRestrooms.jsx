import { Box, Typography } from '@mui/material';
import _ from 'lodash';
import { useState, useEffect } from 'react';
import { PlaceInfoUtilities } from '../../services/placeInfo';
import { getPublicRestrooms } from '../../services/restrooms';
import { calculateDistanceBetweenTwoCoordinates } from '../../utils/MapUtils';

export default function NearestRestrooms({ lat, lng, onLoaded }) {
  const [nearestRestrooms, setNearestRestrooms] = useState([]);

  useEffect(() => {
    getNearestRestrooms();
  }, []);

  const getNearestRestrooms = async () => {
    // TODO: we don't need to query all restrooms every single time - move this up the stack? maybe even cache?
    const restrooms = await getPublicRestrooms('incl-partial');
    const nearest = PlaceInfoUtilities.getNearest(restrooms, lat, lng, 3);
    setNearestRestrooms(nearest);
    onLoaded(nearest);
  };

  return (
    <Box display='flex'
      flexDirection='column'
      alignItems='flex-start'>
      <Typography variant='h6'
        sx={{ fontWeight: 400, fontSize: 18 }}>
        Wheelchair accessible restrooms
      </Typography>
      {nearestRestrooms.map((restroom) => (
        <>
          <div>{restroom.name}</div>
          <div>{PlaceInfoUtilities.getStreetAddressText(restroom)}</div>
          <div>{Math.round(calculateDistanceBetweenTwoCoordinates(restroom.latitude, restroom.longitude, lat, lng))} m</div>
        </>
      ))}
    </Box>
  );
}
