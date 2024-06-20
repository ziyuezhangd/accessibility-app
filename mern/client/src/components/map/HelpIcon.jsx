import { Help } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { useState } from 'react';
import { Control } from 'react-google-map-wrapper';
import HelpModal from './HelpModal';

export default function HelpIcon() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const handleButtonClick = () => {
    setIsModalVisible(!isModalVisible);
  };

  return (
    <>
      <Control position={google.maps.ControlPosition.TOP_RIGHT}>
        <IconButton aria-label='help' aria-controls='help-button' aria-haspopup='true' onClick={handleButtonClick} color='secondary'>
          <Help sx={{ fontSize: 40 }} />
        </IconButton>
      </Control>
      <HelpModal isOpen={isModalVisible} onClose={() => setIsModalVisible(false)} />
    </>
  );
}
