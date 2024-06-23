import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import * as React from 'react';
import DrawerHistoryList from './DrawerHistoryList';
import DrawerLocationDetails from './DrawerLocationDetails';

const drawerWidth = 400;

export default function PersistentDrawerLeft() {
  const [selectedDrawerContent, setSelectedDrawerContent] = React.useState('history');
  const [location, setLocation] = React.useState(null);

  const handleLocationSelected = (e) => {
    console.log('Location selected:', e); 
    setSelectedDrawerContent('location');
    setLocation(e);
  };

  const handleBackClicked = (e) => {
    console.log('Back clicked');  
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
