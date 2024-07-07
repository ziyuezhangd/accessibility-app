import { Avatar, AvatarGroup, Box, Typography,Link,List, ListItem, ListItemButton, ListItemText, ListItemSecondaryAction } from '@mui/material';
import { useState, useEffect, useContext } from 'react';
import { DataContext } from '../../providers/DataProvider';
import { GoogleMapContext } from '../../providers/GoogleMapProvider';
import { PlaceInfo, PlaceInfoUtilities } from '../../services/placeInfo';
import { SUBWAY_LINE_COLORS } from '../../utils/MapUtils';

/**
 * 
 * This component retrieves and displays a list of nearest subway stations based on given coordinates.
 * 
 * @param {Object} props - The properties passed to the component.
 * @param {number} props.lat - The latitude coordinate.
 * @param {number} props.lng - The longitude coordinate.
 * 
 * @returns {JSX.Element} The rendered NearestStations component.
 */
export default function NearestStations({ lat, lng }) {
  const { placeInfos } = useContext(DataContext);
  const { createMarkers } = useContext(GoogleMapContext);
  const [nearestStations, setNearestStations] = useState([]);

  useEffect(() => {
    // TODO: merge stations like Fulton Street
    const getNearestSubwayStations = async () => {
      const placeInfosObj = placeInfos.map(pi => new PlaceInfo(pi.category, pi.name, pi.address, pi.latitude, pi.longitude, pi.hasWheelchairAccessibleRestroom));
      const stations = placeInfosObj.filter((place) => place.isSubwayStation() && place.name !== '');
      const nearestStations = PlaceInfoUtilities.getNearest(stations, lat, lng, 3);
      console.log(nearestStations);
      setNearestStations(nearestStations);
      showStationMarkers(nearestStations);
    };

    const showStationMarkers = (stations) => {
      const markers = stations.map(station => ({
        lat: station.latitude,
        lng: station.longitude 
      }));
      createMarkers(markers);
    };

    getNearestSubwayStations();
  }, [lat, lng, placeInfos, createMarkers]);

  return (
    <Box display='flex' flexDirection='column' alignItems='flex-start'>
      <Typography variant='h6' sx={{ fontWeight: 400, fontSize: 18 }}>
        Wheelchair accessible subway stations
      </Typography>
      {nearestStations.map((station) => (
        <Box key={station.name} mb={2}>
          <AvatarGroup>
            {station.getSubwayLines().map((line) => (
              <Avatar key={`${station.name}-${line}`} sx={{ bgcolor: SUBWAY_LINE_COLORS[line], fontSize: line === 'PATH' ? 10 : 20 }}>
                {line}
              </Avatar>
            ))}
          </AvatarGroup>
          <Typography variant='body1'>{station.name}</Typography>
          <Typography>500m</Typography> {/* Replace with actual distance if available */}
        </Box>
      ))}
    <Box mt={3}>
        <Typography variant='body2'>
          View the full accessible station map on the{' '}
          <Link href="https://new.mta.info/map/5346" target="_blank" rel="noopener">
            MTA website
          </Link>
          .
        </Typography>
      </Box>
    </Box>
  );
}