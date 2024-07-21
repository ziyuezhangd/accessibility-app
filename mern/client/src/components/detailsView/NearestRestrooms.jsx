import { Box, Typography, List, styled, Card, CardContent, Chip } from '@mui/material';
import _ from 'lodash';
import { useState, useEffect, useContext } from 'react';
import RestroomDetailsPopup from './RestroomDetailsPopup'; // Assuming you create this component
import { DataContext } from '../../providers/DataProvider';
import { GoogleMapContext } from '../../providers/GoogleMapProvider';
import { PlaceInfoUtilities } from '../../services/placeInfo';
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

  const [nearestRestrooms, setNearestRestrooms] = useState([]);
  const [selectedRestroom, setSelectedRestroom] = useState(null);
  const [popupOpen, setPopupOpen] = useState(false);

  useEffect(() => {
    const getNearestRestrooms = async () => {
      const nearest = PublicRestroomUtilities.getNearest(restrooms, lat, lng, 3);

      // Remove duplicate restrooms
      const uniqueNearestRestrooms = nearest.filter((restroom, index, self) => 
        index === self.findIndex((r) => r.name === restroom.name && r.latitude === restroom.latitude && r.longitude === restroom.longitude)
      );

      setNearestRestrooms(uniqueNearestRestrooms);
      const markers = uniqueNearestRestrooms.map(restroom => ({
        lat: restroom.latitude,
        lng: restroom.longitude,
        imgSrc: PlaceInfoUtilities.getMarkerPNG({category: 'toilets'}),
        imgSize: 50,
        category: 'toilet',
        title: restroom.name,
        onClick: () => console.log('Clicked restroom')
      }));
      createMarkers(markers, 'restroom', true);
    };

    getNearestRestrooms();

    return () => {
      const markersToRemove = nearestRestrooms.map(restroom => ({
        lat: restroom.latitude,
        lng: restroom.longitude,
      }));
      removeMarkers(markersToRemove, 'restroom');
    };
  }, [lat, lng, restrooms]);

  const handleRestroomClick = (restroom) => {
    setSelectedRestroom(restroom);
    setPopupOpen(true);
  };

  const handleClosePopup = () => {
    setPopupOpen(false);
    setSelectedRestroom(null); // Clear the selected restroom when popup is closed
  };

  return (
    <Box display='flex'
      flexDirection='column'
      alignItems='center'
      width='100%'>
      <Title variant="h6">Wheelchair Accessible Restrooms</Title>
      <List sx={{ width: '100%', bgcolor: 'background.paper' }}
        aria-label='restrooms'>
        {nearestRestrooms.map((restroom, i) => (
          <StyledCard key={i}
            onClick={() => handleRestroomClick(restroom)}>
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

      {/* Popup for displaying detailed restroom info */}
      {selectedRestroom && popupOpen && (
        <RestroomDetailsPopup
          restroom={selectedRestroom}
          onClose={handleClosePopup}
        />
      )}
    </Box>
  );
}
