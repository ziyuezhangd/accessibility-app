import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { useEffect, useState, useContext } from 'react';
import DateTimePickerComponent from './DateTimePicker';
import DrawerHistoryList from './DrawerHistoryList';
import DrawerLocationDetails from './DrawerLocationDetails';
import { GoogleMapContext } from '../../providers/GoogleMapProvider';

const drawerWidth = 350;
const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: theme.spacing(2, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'center',
  backgroundColor: 'rgba(25, 118, 210, 0.12)', // Changed color
  boxShadow: '0px 2px 4px rgba(0,0,0,0.1)',
}));

/**
 * PersistentDrawerLeft component.
 * 
 * This component renders a persistent drawer on the left side of the screen. If a location
 * is selected, it will show the details for that location. Otherwise, it will show the
 * history.
 * 
 * @param {Object} props - The properties passed to the component.
 * @param {MapLocation} props.selectedLocation - The currently selected location.
 * @param {string} props.prediction - The prediction for the selected location if available
 * 
 * @returns {JSX.Element} The rendered PersistentDrawerLeft component.
 */

const TitleHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: theme.spacing(2),
  backgroundColor: '#1976d2', // Updated to use #1976d2
  color: 'white', // White text color
}));

export default function PersistentDrawerLeft({ selectedLocation, predictions }) {
  const { removeMarkers } = useContext(GoogleMapContext);
  const [selectedDrawerContent, setSelectedDrawerContent] = useState('history');
  
  /** @type {[MapLocation, React.Dispatch<React.SetStateAction<MapLocation>>]} */
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
    setSelectedDrawerContent('location');
    setLocation(e);
  };

  const handleBackClicked = (location) => {
    setSelectedDrawerContent('history');
    setLocation(null);
    removeMarkers([{ lat: location.lat, lng: location.lng }]);
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

        <DrawerHeader>
          <DateTimePickerComponent />
        </DrawerHeader>
        {selectedDrawerContent === 'history' && (
          <>
            <TitleHeader>
              <Typography variant='h6'>Last Viewed</Typography>
            </TitleHeader>
            <DrawerHistoryList onLocationSelected={handleLocationSelected} />
          </>
        )}
        {selectedDrawerContent === 'location' && (
          <DrawerLocationDetails
            location={location}
            predictions={predictions}
            onBackClicked={handleBackClicked}/>
        )}
      </Drawer>
    </>
  );
}
