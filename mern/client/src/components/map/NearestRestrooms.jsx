import { Box, Typography } from '@mui/material';
import _ from 'lodash';
import { useState, useEffect } from 'react';
import { PlaceInfoUtilities } from '../../services/placeInfo';
import { MANHATTAN_LAT, MANHATTAN_LNG, calculateDistanceBetweenTwoCoordinates } from '../../utils/MapUtils';

export default function NearestRestrooms({ placeInfos }) {
  const [nearestRestrooms, setNearestRestrooms] = useState([]);

  useEffect(() => {
    getNearestRestrooms();
  }, []);

  const getNearestRestrooms = async () => {
    // Grab a few stations for demo purposes
    const restrooms = placeInfos.filter(PlaceInfoUtilities.hasWheelchairAccessibleRestroom);
    const restroomsSortedByDistance = _.sortBy(restrooms, (r) => calculateDistanceBetweenTwoCoordinates(r.latitude, r.longitude, MANHATTAN_LAT, MANHATTAN_LNG));
    setNearestRestrooms(restroomsSortedByDistance.slice(0, 3));
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
          <div>{Math.round(calculateDistanceBetweenTwoCoordinates(restroom.latitude, restroom.longitude, MANHATTAN_LAT, MANHATTAN_LNG))} m</div>
        </>
      ))}
    </Box>
  );
}
