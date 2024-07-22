import { HelpOutline } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { useState,useEffect } from 'react';
import HelpModal from './HelpModal';

export default function HelpIcon() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const handleButtonClick = () => {
    setIsModalVisible(!isModalVisible);
  };

  // Add this useEffect to get the localStorage value
  useEffect(() => {
    const shouldnotshowhowhelp = localStorage.getItem('dontShowAgain');
    setIsModalVisible(!shouldnotshowhowhelp);
  }, []);

  return (
    <>
      <IconButton aria-label='help'
        aria-controls='help-button'
        aria-haspopup='true'
        onClick={handleButtonClick}
        color='primary'>
        <HelpOutline sx={{ fontSize: 25, fill: '#ffffff' }} />
      </IconButton>
      <HelpModal isOpen={isModalVisible}
        onClose={() => setIsModalVisible(false)} />
    </>
  );
}
