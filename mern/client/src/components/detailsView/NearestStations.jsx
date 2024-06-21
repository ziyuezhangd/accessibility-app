import { Avatar, AvatarGroup, Box, Typography } from '@mui/material';
import { useState, useEffect } from 'react';
import { PlaceInfoUtilities } from '../../services/placeInfo';
import { SUBWAY_LINE_COLORS } from '../../utils/MapUtils';

export default function NearestStations({ placeInfos, lat, lng }) {
  const [nearestStations, setNearestStations] = useState([]);

  useEffect(() => {
    getNearestSubwayStations();
  }, []);

  // TODO: merge stations like Fulton Street
  const getNearestSubwayStations = async () => {
    const stations = placeInfos.filter((place) => PlaceInfoUtilities.isSubwayStation(place) && place.name !== '');
    const nearestStations = PlaceInfoUtilities.getNearest(stations, lat, lng, 3);
    setNearestStations(nearestStations);
  };

  return (
    <Box display='flex' flexDirection='column' alignItems='flex-start'>
      <Typography variant='h6' sx={{ fontWeight: 400, fontSize: 18 }}>
        Wheelchair accessible subway stations
      </Typography>
      {nearestStations.map((station) => (
        <>
          <AvatarGroup key={station.name}>
            {PlaceInfoUtilities.getSubwayLines(station).map((line) => (
              <Avatar key={`${station.name}-${line}`} sx={{ bgcolor: SUBWAY_LINE_COLORS[line], fontSize: line === 'PATH' ? 10 : 20 }}>
                {line}
              </Avatar>
            ))}
          </AvatarGroup>
          <Typography variant='body1'>{PlaceInfoUtilities.getSubwayStationName(station)}</Typography>
          <Typography>500m</Typography>
        </>
      ))}
    </Box>
  );
}
