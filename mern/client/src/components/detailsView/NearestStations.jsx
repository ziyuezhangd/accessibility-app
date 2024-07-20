import { Avatar, AvatarGroup, Box, Typography, Link, styled, Card, CardContent, List } from '@mui/material';
import { useState, useEffect, useContext } from 'react';
import { DataContext } from '../../providers/DataProvider';
import { GoogleMapContext } from '../../providers/GoogleMapProvider';
import { PlaceInfo, PlaceInfoUtilities } from '../../services/placeInfo';
import { SUBWAY_LINE_COLORS, calculateDistanceBetweenTwoCoordinates } from '../../utils/MapUtils';

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

// Styled components
const Title = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  marginBottom: theme.spacing(2),
  textAlign: 'center',
  width: '100%',
}));

const StyledCard = styled(Card)(({ theme }) => ({
  width: '98%', // Increased width for better utilization of space
  marginBottom: theme.spacing(2),
  borderRadius: '8px',
  boxShadow: theme.shadows[3],
  position: 'relative',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out', // Added transition for hover effect
  '&:hover': {
    transform: 'scale(1.02)',
    boxShadow: theme.shadows[6],
  },
}));

const StationCardContent = styled(CardContent)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  padding: theme.spacing(2),
  '&:last-child': {
    paddingBottom: theme.spacing(2),
  },
}));

const DistanceText = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(1),
}));

const NameText = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  marginBottom: theme.spacing(1),
}));

const StyledAvatar = styled(Avatar)(({ theme, lineColor }) => ({
  backgroundColor: lineColor,
  color: theme.palette.common.white,
  fontSize: '1rem',
  width: theme.spacing(4),
  height: theme.spacing(4),
  margin: theme.spacing(0.5),
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'scale(1.2)',
  },
}));

export default function NearestStations({ lat, lng }) {
  const { placeInfos } = useContext(DataContext);
  const { createMarkers, removeMarkers } = useContext(GoogleMapContext);
  const [nearestStations, setNearestStations] = useState([]);

  useEffect(() => {
    const getNearestSubwayStations = async () => {
      const placeInfosObj = placeInfos.map(pi => new PlaceInfo(pi));
      const stations = placeInfosObj.filter((place) => place.isSubwayStation() && place.name !== '');
      const nearestStations = PlaceInfoUtilities.getNearest(stations, lat, lng, 3);

      // Remove duplicate stations
      const uniqueNearestStations = nearestStations.filter((station, index, self) => 
        index === self.findIndex((s) => s.name === station.name) && station.getSubwayLines().length > 0
      );

      console.log(uniqueNearestStations);
      setNearestStations(uniqueNearestStations);
      showStationMarkers(uniqueNearestStations);
    };

    const showStationMarkers = (stations) => {
      console.log('showStationMarkers', stations);
      const markers = stations.map(station => ({
        lat: station.latitude,
        lng: station.longitude,
        scale: 1.5
      }));
      createMarkers(markers, false, false, true); // Indicate these are station markers
    };

    getNearestSubwayStations();

    return () => {
      const markersToRemove = nearestStations.map(station => ({
        lat: station.latitude,
        lng: station.longitude,
      }));
      removeMarkers(markersToRemove, false, true); // Indicate these are station markers
    };
  }, [lat, lng, placeInfos]);

  return (
    <Box 
      display='flex'
      flexDirection='column'
      alignItems='center'
      width='100%'>
      <Title variant="h6">Wheelchair Accessible Subway Stations</Title>
      <List sx={{ width: '100%', bgcolor: 'background.paper' }}
        aria-label='stations'>
        {nearestStations.map((station, index) => (
          <StyledCard key={`${station.name}-${index}`}>
            <StationCardContent>
              <NameText variant="subtitle1"
                gutterBottom>
                {station.getSubwayStationName()}
              </NameText>
              <Box display="flex"
                flexWrap="wrap">
                {station.getSubwayLines().map((line) => (
                  <StyledAvatar key={`${station.name}-${line}`}
                    lineColor={SUBWAY_LINE_COLORS[line]}>
                    {line}
                  </StyledAvatar>
                ))}
              </Box>
              <DistanceText variant="body2">
                {Math.round(calculateDistanceBetweenTwoCoordinates(lat, lng, station.latitude, station.longitude))} meters away
              </DistanceText>
            </StationCardContent>
          </StyledCard>
        ))}
      </List>
      <Box mt={3}>
        <Typography variant='body2'>
          View the full accessible station map on the{' '}
          <Link href="https://new.mta.info/map/5346"
            target="_blank"
            rel="noopener">
            MTA website
          </Link>
          .
        </Typography>
      </Box>
    </Box>
  );
}
