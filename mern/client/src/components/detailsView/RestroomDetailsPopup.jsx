import CloseIcon from '@mui/icons-material/Close';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Divider,
} from '@mui/material';
import React from 'react';

const RestroomDetailsPopup = ({ restroom, onClose }) => {
  const isOpenNow = restroom.isOpen(new Date());

  return (
    <Dialog open={true}
      onClose={onClose}
      maxWidth="sm"
      fullWidth>
      <DialogTitle>{restroom.name}</DialogTitle>
      <DialogContent dividers>
        <Box mb={2}>
          <Typography variant="body1">
            <strong>Status:</strong> {isOpenNow ? 'OPEN' : 'CLOSED'}
          </Typography>
        </Box>

        <Box mb={2}>
          <Typography variant="body1">
            <strong>Hours:</strong>
          </Typography>
          <Typography variant="body2">
            {restroom.formatHours().split('\n').map((h, index) => (
              <p key={index}>{h}</p>
            ))}
          </Typography>
        </Box>

        <Box mb={2}>
          <Typography variant="body1">
            <strong>Accessibility:</strong>
          </Typography>
          <Typography variant="body2">
            {restroom.isFullyAccessible
              ? 'Fully Accessible'
              : restroom.isPartiallyAccessible
                ? 'Partially Accessible'
                : 'Not Accessible'}
          </Typography>
        </Box>

        <Box mb={2}>
          <Typography variant="body1">
            <strong>Restroom Type:</strong> {restroom.restroomType}
          </Typography>
        </Box>

        <Box mb={2}>
          <Typography variant="body1">
            <strong>Has Changing Stations:</strong>{' '}
            {restroom.hasChangingStations ? 'Yes' : 'No'}
          </Typography>
        </Box>
        
        <Divider />

        <Box mt={2}
          display="flex"
          justifyContent="flex-end">
          <Chip
            label={isOpenNow ? 'OPEN' : 'CLOSED'}
            color={isOpenNow ? 'success' : 'error'}
          />
        </Box>
      </DialogContent>
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
        }}
      >
        <CloseIcon />
      </IconButton>
    </Dialog>
  );
};

export default RestroomDetailsPopup;
