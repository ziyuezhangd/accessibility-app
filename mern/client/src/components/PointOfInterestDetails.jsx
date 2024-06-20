import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

const PointOfInterestDetails = ({ poi }) => {
  return (
    <Card style={{ marginTop: '20px' }}>
      <CardContent>
        <Typography variant="h5" component="h2">
          {poi.name}
        </Typography>
        <Typography color="textSecondary">
          Coordinates: {poi.lat}, {poi.lng}
        </Typography>
        {/* Add more details as needed */}
      </CardContent>
    </Card>
  );
};

export default PointOfInterestDetails;
