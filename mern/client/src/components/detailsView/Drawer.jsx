import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { useContext, useEffect, useState } from 'react';
import DateTimePickerComponent from './DateTimePicker';
import DrawerHistoryList from './DrawerHistoryList';
import DrawerLocationDetails from './DrawerLocationDetails';
import { GoogleMapContext } from '../../providers/GoogleMapProvider';

const drawerWidth = 350;
const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'start',
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
 * 
 * @returns {JSX.Element} The rendered PersistentDrawerLeft component.
 */
export default function PersistentDrawerLeft({ selectedLocation }) {
  const { clearMarkers } = useContext(GoogleMapContext);

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
    clearMarkers();
    setSelectedDrawerContent('location');
    setLocation(e);
  };

  const handleBackClicked = (e) => {
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

        <DrawerHeader>
          {selectedDrawerContent === 'history' && <Typography variant='h6'>Last viewed </Typography>}
          {selectedDrawerContent === 'location' && <IconButton aria-label='Back to recently viewed'
            onClick={handleBackClicked}>
            <ChevronLeftIcon />
          </IconButton>}
          <div><DateTimePickerComponent /></div>

        </DrawerHeader>

        {selectedDrawerContent === 'history' &&
          <DrawerHistoryList onLocationSelected={handleLocationSelected} />}
        {selectedDrawerContent === 'location' &&
          <DrawerLocationDetails
            location={location}
            onBackClicked={handleBackClicked} />
        }
      </Drawer>
    </>
  );
}
