// Drawer.jsx
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import { useContext, useEffect, useState } from 'react';
import DrawerHistoryList from './DrawerHistoryList';
import DrawerLocationDetails from './DrawerLocationDetails';
import { GoogleMapContext } from '../../providers/GoogleMapProvider';
import { MapLocation } from '../../utils/MapUtils';

const drawerWidth = 400;

export default function PersistentDrawerLeft({ selectedLocation }) {
  const { clearMarkers } = useContext(GoogleMapContext);
  const [selectedDrawerContent, setSelectedDrawerContent] = useState('history');
  const [location, setLocation] = useState(null);

  useEffect(() => {
    if (selectedLocation?.lat && selectedLocation?.lng) {
      setSelectedDrawerContent('location');
      setLocation(selectedLocation);
    }
  }, [selectedLocation]);

  useEffect(() => {
    const handleFavoriteSelected = (event) => {
      setSelectedDrawerContent('location');
      setLocation(event.detail);
    };

    window.addEventListener('favoriteSelected', handleFavoriteSelected);

    return () => {
      window.removeEventListener('favoriteSelected', handleFavoriteSelected);
    };
  }, []);

  const handleLocationSelected = (e) => {
    clearMarkers();
    setSelectedDrawerContent('location');
    setLocation(e);
  };

  const handleBackClicked = () => {
    clearMarkers();
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
        {selectedDrawerContent === 'location' && (
          <DrawerLocationDetails location={location}
            onBackClicked={handleBackClicked} />
        )}
      </Drawer>
    </>
  );
}
