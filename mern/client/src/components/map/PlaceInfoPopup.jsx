// PlaceInfoPopup.jsx
import { AccessTime, ExpandMore, ExpandLess, Accessible } from '@mui/icons-material';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box, Collapse, IconButton, Zoom } from '@mui/material';
import { styled } from '@mui/system';
import React, { useContext, useEffect, useState } from 'react';
import { DataContext } from '../../providers/DataProvider';
import { PlaceInfoUtilities } from '../../services/placeInfo';
import { PublicRestroomUtilities } from '../../services/restrooms';
import { calculateDistanceBetweenTwoCoordinates } from '../../utils/MapUtils';

const primaryColor = '#4a90e2';

const StyledDialogTitle = styled(DialogTitle)({
  backgroundColor: primaryColor,
  color: '#fff',
});

const StyledDialogContent = styled(DialogContent)({
  backgroundColor: '#f5f5f5',
});

const StyledDialogActions = styled(DialogActions)({
  backgroundColor: '#f5f5f5',
});

const StyledButton = styled(Button)({
  backgroundColor: primaryColor,
  color: '#fff',
  '&:hover': {
    backgroundColor: '#357abd',
  },
});

const SectionTitle = styled(Box)({
  color: primaryColor,
  marginBottom: '8px',
  display: 'flex',
  alignItems: 'center',
});

const InfoBox = styled(Box)({
  backgroundColor: '#fff',
  padding: '12px',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  marginBottom: '16px',
});

const DetailText = styled(Typography)({
  marginBottom: '4px',
});

const StatusText = styled(Typography)(({ operational }) => ({
  color: operational ? 'green' : 'red',
  marginLeft: '8px',
}));

const WheelchairText = styled(Typography)(({ accessible }) => ({
  color: accessible ? 'green' : 'red',
  marginTop: '4px',
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return (<Zoom ref={ref}
    {...props} />);
});

// Helper function to format category names
const formatCategoryName = (category) => {
  return category
    .toLowerCase()
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const PlaceInfoPopup = ({ open, onClose, placeInfo }) => {
  const { placeInfos, restrooms } = useContext(DataContext);
  const [openHours, setOpenHours] = useState(false);
  const [expandedRestroom, setExpandedRestroom] = useState(null);
  const [nearestRestrooms, setNearestRestrooms] = useState([]);
  const [nearestStations, setNearestStations] = useState([]);

  useEffect(() => {
    if (!placeInfos || !restrooms) return;
    const nearbyStations = getNearestStations(placeInfo.latitude, placeInfo.longitude);
    setNearestStations(nearbyStations);
  
    const nearbyRestrooms = getNearestRestrooms(placeInfo.latitude, placeInfo.longitude);
    setNearestRestrooms(nearbyRestrooms);
    return () => {
      // Pass
    };
  }, [placeInfos, restrooms]);

  const getNearestStations = (lat, lng) => {
    const stations = placeInfos.filter(place => place.isSubwayStation() && place.name !== '');
    const nearestStations = PlaceInfoUtilities.getNearest(stations, lat, lng, 3);
    const uniqueNearestStations = nearestStations.filter((station, index, self) => 
      index === self.findIndex((s) => s.name === station.name) && station.getSubwayLines().length > 0
    );
    return uniqueNearestStations.map(station => ({
      ...station,
      distance: calculateDistanceBetweenTwoCoordinates(lat, lng, station.latitude, station.longitude),
    }));
  };

  const getNearestRestrooms = (lat, lng) => {
    const nearestRestrooms = PublicRestroomUtilities.getNearest(restrooms, lat, lng, 3);
    return nearestRestrooms.map(restroom => ({
      ...restroom,
      distance: calculateDistanceBetweenTwoCoordinates(lat, lng, restroom.latitude, restroom.longitude),
    }));
  };

  const toggleOpenHours = () => {
    setOpenHours(!openHours);
  };

  const toggleRestroomHours = (index) => {
    setExpandedRestroom(expandedRestroom === index ? null : index);
  };

  const renderOpeningHours = (hours) => {
    if (Array.isArray(hours)) {
      return hours.map((hour, index) => (
        <DetailText key={index}
          variant="body2">
          {hour}
        </DetailText>
      ));
    }
    return <DetailText variant="body2">{hours}</DetailText>;
  };

  const renderRestroomHours = (hours) => {
    if (!hours) return 'N/A';
    if (Array.isArray(hours)) {
      return hours.map((hour, index) => (
        <DetailText key={index}
          variant="body2">
          {hour}
        </DetailText>
      ));
    }
    return <DetailText variant="body2">{hours}</DetailText>;
  };

  return (
    <Dialog open={open}
      onClose={onClose}
      TransitionComponent={Transition}
      maxWidth="sm"
      fullWidth>
      <StyledDialogTitle>{placeInfo.name}</StyledDialogTitle>
      <StyledDialogContent dividers>
        <InfoBox>
          <SectionTitle>
            <Typography variant="h6">Category</Typography>
          </SectionTitle>
          <DetailText variant="body1">{formatCategoryName(placeInfo.category)}</DetailText>
        </InfoBox>
        {placeInfo.hasWheelchairAccessibleRestroom !== undefined && (
          <InfoBox>
            <SectionTitle>
              <Typography variant="h6">Wheelchair Accessible Restroom</Typography>
            </SectionTitle>
            <WheelchairText accessible={placeInfo.hasWheelchairAccessibleRestroom}>
              {placeInfo.hasWheelchairAccessibleRestroom ? 'Yes' : 'No'}
            </WheelchairText>
          </InfoBox>
        )}
        {nearestRestrooms && nearestRestrooms.length > 0 && (
          <InfoBox>
            <SectionTitle>
              <Typography variant="h6">Nearest Restrooms</Typography>
              <Accessible sx={{ marginLeft: '8px' }} />
            </SectionTitle>
            {nearestRestrooms.map((restroom, index) => (
              <Box key={index}
                sx={{ marginBottom: '8px' }}>
                <DetailText variant="body2">
                  <strong>{restroom.name}</strong> ({Math.round(restroom.distance)} m)
                </DetailText>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <DetailText variant="body2"
                    sx={{ display: 'flex', alignItems: 'center' }}>
                    Status:
                    <StatusText operational={restroom.status === 'Operational'}>
                      {restroom.status}
                    </StatusText>
                  </DetailText>
                  <IconButton onClick={() => toggleRestroomHours(index)}
                    size="small">
                    {expandedRestroom === index ? <ExpandLess /> : <ExpandMore />}
                  </IconButton>
                </Box>
                <Collapse in={expandedRestroom === index}>
                  {renderRestroomHours(restroom.hours)}
                </Collapse>
                {restroom.wheelchairAccessible !== undefined && (
                  <WheelchairText accessible={restroom.wheelchairAccessible}>
                    Wheelchair Accessible
                  </WheelchairText>
                )}
              </Box>
            ))}
          </InfoBox>
        )}
        {nearestStations && nearestStations.length > 0 && (
          <InfoBox>
            <SectionTitle>
              <Typography variant="h6">Nearest Subway Stations</Typography>
              <Accessible sx={{ marginLeft: '8px' }} />
            </SectionTitle>
            {nearestStations.map((station, index) => (
              <Box key={index}
                sx={{ marginBottom: '8px' }}>
                <DetailText variant="body2">
                  <strong>{station.name}</strong> ({Math.round(station.distance)} m)
                </DetailText>
                {station.wheelchairAccessible && (
                  <WheelchairText accessible={station.wheelchairAccessible}>
                    Wheelchair Accessible
                  </WheelchairText>
                )}
              </Box>
            ))}
          </InfoBox>
        )}
        {placeInfo.hours && (
          <InfoBox>
            <SectionTitle>
              <Typography variant="h6">
                <AccessTime /> 
                {placeInfo.isOpenNow ? 'Open' : 'Closed'}
                <StatusText operational={placeInfo.isOpenNow}>
                  {placeInfo.isOpenNow ? 'Open' : 'Closed'}
                </StatusText>
                <IconButton onClick={toggleOpenHours}
                  size="small"
                  sx={{ marginLeft: '8px' }}>
                  {openHours ? <ExpandLess /> : <ExpandMore />}
                </IconButton>
              </Typography>
            </SectionTitle>
            <Collapse in={openHours}>
              {renderOpeningHours(placeInfo.hours)}
            </Collapse>
          </InfoBox>
        )}
      </StyledDialogContent>
      <StyledDialogActions>
        <StyledButton onClick={onClose}>Close</StyledButton>
      </StyledDialogActions>
    </Dialog>
  );
};

export default PlaceInfoPopup;
