import { Box, Chip, Typography, List, ListItem, ListItemButton, ListItemText, ListItemSecondaryAction } from '@mui/material';
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
export default function NearestRestrooms({ lat, lng }) {
  const {restrooms} = useContext(DataContext);
  const { createMarkers } = useContext(GoogleMapContext);

  /** @type {[PublicRestroom[], React.Dispatch<React.SetStateAction<PublicRestroom[]>>]} */
  const [nearestRestrooms, setNearestRestrooms] = useState([]);

  useEffect(() => {
    const getNearestRestrooms = async () => {
    // TODO: remove not operational
      const nearest = PublicRestroomUtilities.getNearest(restrooms, lat, lng, 3);
      console.log(`Nearest ${nearest.length} restrooms: `, nearest);
      setNearestRestrooms(nearest);
      showRestroomMarkers(nearest);
    };

    const showRestroomMarkers = (restrooms) => {
      const markers = restrooms.map(restroom => {
        return {
          lat: restroom.latitude,
          lng: restroom.longitude
        };
      });
      createMarkers(markers);
    };

    getNearestRestrooms();
  }, [lat, lng, restrooms, createMarkers]);

  return (
    <Box display='flex'
      flexDirection='column'
      alignItems='flex-start'>
      <Typography variant='h6'
        sx={{ fontWeight: 400, fontSize: 18 }}>
        Wheelchair accessible restrooms
      </Typography>
      <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
        aria-label='contacts'>
        {nearestRestrooms.map((restroom, i) => (
          <ListItem key={i}
            disablePadding>
            <ListItemButton>
              <ListItemText
                primary={restroom.name}
                secondary={(
                  <>
                    <Typography
                      sx={{ display: 'inline' }}
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      {/* TODO: would be nice if we could make today's day bold */}
                      {restroom.formatHours().split('\n').map(h => <p key={h}>{h}</p>)}
                    </Typography>
                    <div>{Math.round(calculateDistanceBetweenTwoCoordinates(restroom.latitude, restroom.longitude, lat, lng))} m</div>
                  </>
                )}
                
              />
              <ListItemSecondaryAction>
                {/* TODO: we will actually want to know if its open at the predicted time */}
                {restroom.isOpenNow() ? <Chip label='OPEN'
                  color='success' /> : <Chip label='CLOSED'
                  color='error' />}
              </ListItemSecondaryAction>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
