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
      console.log("showRestroomMarkers",restrooms);
      const markers = restrooms.map(restroom => ({
        lat: restroom.latitude,
        lng: restroom.longitude
      }));
      console.log("markers to create", markers);
      createMarkers(markers,true);
    };

    getNearestRestrooms();
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
    <Box display='flex' flexDirection='column' alignItems='flex-start'>
      <Typography variant='h6' sx={{ fontWeight: 400, fontSize: 18 }}>
        Wheelchair accessible restrooms
      </Typography>
      <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }} aria-label='restrooms'>
        {nearestRestrooms.map((restroom, i) => (
          <ListItem key={i} disablePadding>
            <ListItemButton aria-label={restroom.name} onClick={() => handleRestroomClick(restroom)}>
              <ListItemText
                aria-label='Restroom information'
                primary={restroom.name}
                secondary={
                  <>
                    <Typography
                      sx={{ display: 'inline' }}
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      {/* TODO: would be nice if we could make today's day bold */}
                      {restroom.formatHours().split('\n').map(h => (
                        <p aria-label={`Hours of operation ${h}`} key={h}>{h}</p>
                      ))}
                    </Typography>
                    <p aria-label={`Distance from selected location ${Math.round(calculateDistanceBetweenTwoCoordinates(restroom.latitude, restroom.longitude, lat, lng))} meters`}>
                      {Math.round(calculateDistanceBetweenTwoCoordinates(restroom.latitude, restroom.longitude, lat, lng))} m
                    </p>
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
