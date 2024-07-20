import { Box, Typography, List, styled, Card, CardContent, Chip } from '@mui/material';
import _ from 'lodash';
import { useState, useEffect, useContext } from 'react';
import { DataContext } from '../../providers/DataProvider';
import { GoogleMapContext } from '../../providers/GoogleMapProvider';
import { PublicRestroomUtilities } from '../../services/restrooms';
import { calculateDistanceBetweenTwoCoordinates } from '../../utils/MapUtils';

/**
 * 
 * This component retrieves and displays a list of nearest restrooms based on given coordinates.
 * 
 * @param {Object} props - The properties passed to the component.
 * @param {number} props.lat - The latitude coordinate.
 * @param {number} props.lng - The longitude coordinate.
 * 
 * @returns {JSX.Element} The rendered NearestRestrooms component.
 */
// Styled components
const Title = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  marginBottom: theme.spacing(2),
  textAlign: 'center',
  width: '100%',
}));

const StyledCard = styled(Card)(({ theme }) => ({
  width: '100%',
  marginBottom: theme.spacing(2),
  borderRadius: '8px',
  boxShadow: theme.shadows[3],
  position: 'relative',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'scale(1.02)',
    boxShadow: theme.shadows[6],
  },
}));

const RestroomCardContent = styled(CardContent)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  padding: theme.spacing(2),
  '&:last-child': {
    paddingBottom: theme.spacing(2),
  },
}));

const StatusChip = styled(Chip)(({ theme, status }) => ({
  marginLeft: theme.spacing(1),
  backgroundColor: status === 'OPEN' ? theme.palette.success.main : status === 'CLOSED' ? theme.palette.error.main : theme.palette.grey[500],
  color: theme.palette.common.white,
  fontSize: '0.75rem',
  height: '1.5rem',
  minWidth: '2.5rem',
  borderRadius: '0.75rem',
}));

const DistanceText = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(1),
  display: 'flex',
  alignItems: 'center',
}));

const NameText = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
}));

export default function NearestRestrooms({ lat, lng }) {
  const { restrooms, selectedDateTime } = useContext(DataContext);
  const { createMarkers, removeMarkers } = useContext(GoogleMapContext);

  /** @type {[PublicRestroom[], React.Dispatch<React.SetStateAction<PublicRestroom[]>>]} */
  const [nearestRestrooms, setNearestRestrooms] = useState([]);

  useEffect(() => {
    const getNearestRestrooms = async () => {
      // TODO: remove not operational
      const nearest = PublicRestroomUtilities.getNearest(restrooms, lat, lng, 3);
      setNearestRestrooms(nearest);
      showRestroomMarkers(nearest);
    };

    const showRestroomMarkers = (restrooms) => {
      const markers = restrooms.map(restroom => ({
        lat: restroom.latitude,
        lng: restroom.longitude,
        imgSrc: null,
        color: 'red',
        scale: 0.8,
        title: restroom.name,
      }));
      createMarkers(markers, false);
    };

    getNearestRestrooms();

    return () => {
      const markersToRemove = nearestRestrooms.map(restroom => ({
        lat: restroom.latitude,
        lng: restroom.longitude,
      }));
      removeMarkers(markersToRemove);
    };
  }, [lat, lng, restrooms, createMarkers, removeMarkers]);

  return (
    <Box display='flex'
      flexDirection='column'
      alignItems='center'
      width='100%'>
      <Title variant="h6">Wheelchair Accessible Restrooms</Title>
      <List sx={{ width: '100%', bgcolor: 'background.paper' }}
        aria-label='restrooms'>
        {nearestRestrooms.map((restroom, i) => (
          <StyledCard key={i}>
            <RestroomCardContent>
              <NameText variant="subtitle1"
                gutterBottom>
                {restroom.name}
              </NameText>
              <DistanceText variant="body2">
                {Math.round(calculateDistanceBetweenTwoCoordinates(restroom.latitude, restroom.longitude, lat, lng))} meters away
                <StatusChip label={restroom.isOpen(selectedDateTime) ? 'OPEN' : restroom.isOpen(selectedDateTime) === false ? 'CLOSED' : 'UNKNOWN'}
                  status={restroom.isOpen(selectedDateTime) ? 'OPEN' : restroom.isOpen(selectedDateTime) === false ? 'CLOSED' : 'UNKNOWN'} />
              </DistanceText>
            </RestroomCardContent>
          </StyledCard>
        ))}
      </List>
    </Box>
  );
}
