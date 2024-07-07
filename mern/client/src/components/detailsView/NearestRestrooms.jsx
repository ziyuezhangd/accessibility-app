import { useState, useEffect, useContext } from 'react';
import { Box, Chip, Typography, List, ListItem, ListItemButton, ListItemText, ListItemSecondaryAction } from '@mui/material';
import { DataContext } from '../../providers/DataProvider';
import { GoogleMapContext } from '../../providers/GoogleMapProvider';
import { PublicRestroomUtilities } from '../../services/restrooms';
import { calculateDistanceBetweenTwoCoordinates } from '../../utils/MapUtils';
import RestroomDetailsPopup from './RestroomDetailsPopup'; // Assuming you create this component

export default function NearestRestrooms({ lat, lng }) {
  const { restrooms } = useContext(DataContext);
  const { createMarkers } = useContext(GoogleMapContext);

  const [nearestRestrooms, setNearestRestrooms] = useState([]);
  const [selectedRestroom, setSelectedRestroom] = useState(null);
  const [popupOpen, setPopupOpen] = useState(false);

  useEffect(() => {
    const getNearestRestrooms = async () => {
      const nearest = PublicRestroomUtilities.getNearest(restrooms, lat, lng, 3);
      setNearestRestrooms(nearest);
      showRestroomMarkers(nearest);
    };

    const showRestroomMarkers = (restrooms) => {
      const markers = restrooms.map(restroom => ({
        lat: restroom.latitude,
        lng: restroom.longitude
      }));
      createMarkers(markers);
    };

    getNearestRestrooms();
  }, [lat, lng, restrooms, createMarkers]);

  const handleRestroomClick = (restroom) => {
    setSelectedRestroom(restroom);
    setPopupOpen(true);
  };

  const handleClosePopup = () => {
    setPopupOpen(false);
  };

  return (
    <Box display='flex' flexDirection='column' alignItems='flex-start'>
      <Typography variant='h6' sx={{ fontWeight: 400, fontSize: 18 }}>
        Wheelchair accessible restrooms
      </Typography>
      <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }} aria-label='restrooms'>
        {nearestRestrooms.map((restroom, i) => (
          <ListItem key={i} disablePadding>
            <ListItemButton onClick={() => handleRestroomClick(restroom)}>
              <ListItemText
                primary={restroom.name}
                secondary={
                  <>
                    <Typography sx={{ display: 'inline' }} component="span" variant="body2" color="text.primary">
                      {restroom.formatHours().split('\n').map((h, index) => <p key={index}>{h}</p>)}
                    </Typography>
                    <div>{Math.round(calculateDistanceBetweenTwoCoordinates(restroom.latitude, restroom.longitude, lat, lng))} m</div>
                  </>
                }
              />
              <ListItemSecondaryAction>
                {restroom.isOpenNow() ? <Chip label='OPEN' color='success' /> : <Chip label='CLOSED' color='error' />}
              </ListItemSecondaryAction>
            </ListItemButton>
          </ListItem>
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
