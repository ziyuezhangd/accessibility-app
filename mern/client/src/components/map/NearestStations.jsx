import { Avatar, AvatarGroup, Box, Container, Typography } from '@mui/material';
import { useState, useEffect } from 'react';
import { getPlaceInfos } from '../../services/placeInfo';
import { SUBWAY_LINE_COLORS, getSubwayLinesFromPlaceInfoString, getSubwayStationNameFromPlaceInfoString } from '../../utils/MapUtils';

export default function NearestStations({ placeInfos }) {
  const [nearestStations, setNearestStations] = useState([]);

  useEffect(() => {
    getNearestSubwayStations();
  }, []);

  // TODO: merge stations like Fulton Street
  const getNearestSubwayStations = async () => {
    // Grab a few stations for demo purposes
    const testStations = ['Fulton Street (2,3,A,C)', 'Fulton Street (A,C,J,Z)', '42nd Street-Grand Central (S,4,5,6,7)', '14th Street-Union Square (L,N,Q,R)', '33rd Street (PATH)'];
    const stations = placeInfos.filter((place) => testStations.includes(place.name));
    console.log(stations);
    for (const station of stations) {
      getSubwayLinesFromPlaceInfoString(station.name);
    }
    setNearestStations(stations);
  };

  return (
    <Box display='flex'
      flexDirection='column'
      alignItems='flex-start'>
      <Typography variant='h6'
        sx={{ fontWeight: 400, fontSize: 18 }}>
        Wheelchair accessible subway stations
      </Typography>
      {nearestStations.map((station) => (
        <>
          <AvatarGroup key={station.name}>
            {getSubwayLinesFromPlaceInfoString(station.name).map((line) => (
              <>
                <Avatar key={`${station.name}-${line}`}
                  sx={{ bgcolor: SUBWAY_LINE_COLORS[line], fontSize: line === 'PATH' ? 10 : 20 }}>
                  {line}
                </Avatar>
              </>
            ))}
          </AvatarGroup>
          <Typography variant='body1'>{getSubwayStationNameFromPlaceInfoString(station.name)}</Typography>
          <Typography>500m</Typography>
        </>
      ))}
    </Box>
  );
}
