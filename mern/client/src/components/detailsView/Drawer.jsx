import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import { useContext, useEffect, useState } from 'react';
import DrawerHistoryList from './DrawerHistoryList';
import DrawerLocationDetails from './DrawerLocationDetails';
import { GoogleMapContext } from '../../providers/GoogleMapProvider';
import { MapLocation } from '../../utils/MapUtils';

const drawerWidth = 400;

/**
 * PersistentDrawerLeft component.
 * 
 * This component renders a persistent drawer on the left side of the screen. If a location
 * is selected, it will show the details for that location. Otherwise, it will show the
 * history.
 * 
 * @param {Object} props - The properties passed to the component.
 * @param {MapLocation} props.selectedLocation - The currently selected location.
 * 
 * @returns {JSX.Element} The rendered PersistentDrawerLeft component.
 */
export default function PersistentDrawerLeft({ selectedLocation}) {
  const {clearMarkers} = useContext(GoogleMapContext);
  const [selectedDrawerContent, setSelectedDrawerContent] = useState('history');

  /** @type {[MapLocation, React.Dispatch<React.SetStateAction<MapLocation>>]} */
  const [location, setLocation] = useState(null);

  useEffect(() => {
    if (selectedLocation?.lat && selectedLocation?.lng) {
      setSelectedDrawerContent('location');
      setLocation(selectedLocation);
    }
  }, [selectedLocation]);

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
        {selectedDrawerContent === 'location' && <DrawerLocationDetails 
          location={location}
          onBackClicked={handleBackClicked} />}
      </Drawer>
    </>
  );
}
