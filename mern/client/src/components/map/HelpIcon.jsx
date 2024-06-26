import { Help } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { useState, useEffect } from 'react';
import { Control } from 'react-google-map-wrapper';
import HelpModal from './HelpModal';
import DontRemindButton from './DontRemindButton'; // Import DontRemindButton

export default function HelpIcon() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [dontRemind, setDontRemind] = useState(false);

  useEffect(() => {
    setDontRemind(localStorage.getItem('dontRemind') === 'true');
  }, []);

  const handleButtonClick = () => {
    if (!dontRemind) {
      setIsModalVisible(!isModalVisible);
    }
  };

  const handleDontRemind = () => {
    localStorage.setItem('dontRemind', 'true');
    setDontRemind(true);
    setIsModalVisible(false);
  };

  return (
    <>
      <Control position={google.maps.ControlPosition.TOP_RIGHT}>
        <IconButton aria-label='help'
          aria-controls='help-button'
          aria-haspopup='true'
          onClick={handleButtonClick}
          color='secondary'>
          <Help sx={{ fontSize: 40 }} />
        </IconButton>
      </Control>
      <HelpModal
        isOpen={isModalVisible}
        onClose={() => setIsModalVisible(false)}
      />
      {isModalVisible && (
        <DontRemindButton onClick={handleDontRemind} />
      )}
    </>
  );
}
