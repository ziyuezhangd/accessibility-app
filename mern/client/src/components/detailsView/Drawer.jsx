import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import { useEffect, useState } from 'react';
import DrawerHistoryList from './DrawerHistoryList';
import DrawerLocationDetails from './DrawerLocationDetails';

const drawerWidth = 400;

/**
 *
 * @param {selectedLocation: {lat: number, lng: number, isPlace: boolean }} props
 */
export default function PersistentDrawerLeft({ selectedLocation }) {
  const [selectedDrawerContent, setSelectedDrawerContent] = useState('history');
  const [location, setLocation] = useState(null);

  useEffect(() => {
    if (selectedLocation?.lat && selectedLocation?.lng) {
      const locationName = `${selectedLocation.lat}, ${selectedLocation.lng}`;
      setSelectedDrawerContent('location');
      setLocation({ name: locationName, lat: selectedLocation.lat, lng: selectedLocation.lng });
    }
  }, [selectedLocation]);

  const handleLocationSelected = (e) => {
    setSelectedDrawerContent('location');
    setLocation(e);
  };

  const handleBackClicked = (e) => {
    setSelectedDrawerContent('history');
    setLocation(null);
  };

  return (
    <>
      <Drawer
        variant='permanent'
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />
        {selectedDrawerContent === 'history' && <DrawerHistoryList onLocationSelected={handleLocationSelected} />}
        {selectedDrawerContent === 'location' && <DrawerLocationDetails location={location}
          onBackClicked={handleBackClicked} />}
      </Drawer>
    </>
  );
}
