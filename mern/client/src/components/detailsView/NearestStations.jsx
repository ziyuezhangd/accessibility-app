import { Avatar, AvatarGroup, Box, Typography } from '@mui/material';
import { useState, useEffect, useContext } from 'react';
import { DataContext } from '../../providers/DataProvider';
import { PlaceInfo, PlaceInfoUtilities } from '../../services/placeInfo';
import { SUBWAY_LINE_COLORS } from '../../utils/MapUtils';

export default function NearestStations({ lat, lng }) {
  const { placeInfos } = useContext(DataContext);
  const [nearestStations, setNearestStations] = useState([]);

  useEffect(() => {
    // TODO: merge stations like Fulton Street
    const getNearestSubwayStations = async () => {
      const placeInfosObj = placeInfos.map(pi => new PlaceInfo(pi.category, pi.name, pi.address, pi.latitude, pi.longitude, pi.hasWheelchairAccessibleRestroom));
      const stations = placeInfosObj.filter((place) => place.isSubwayStation() && place.name !== '');
      const nearestStations = PlaceInfoUtilities.getNearest(stations, lat, lng, 3);
      setNearestStations(nearestStations);
    };
    getNearestSubwayStations();
  }, [placeInfos]);

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
            {station.getSubwayLines().map((line) => (
              <Avatar key={`${station.name}-${line}`}
                sx={{ bgcolor: SUBWAY_LINE_COLORS[line], fontSize: line === 'PATH' ? 10 : 20 }}>
                {line}
              </Avatar>
            ))}
          </AvatarGroup>
          <Typography variant='body1'>{station.getSubwayStationName()}</Typography>
          <Typography>500m</Typography>
        </>
      ))}
    </Box>
  );
}