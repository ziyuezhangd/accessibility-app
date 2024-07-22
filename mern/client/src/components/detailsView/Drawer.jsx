import { Global } from '@emotion/react';
import { ArrowDropDown, ArrowDropUp } from '@mui/icons-material';
import { SwipeableDrawer } from '@mui/material';
import { grey } from '@mui/material/colors';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { useEffect, useState, useContext } from 'react';
import DateTimePickerComponent from './DateTimePicker';
import DrawerHistoryList from './DrawerHistoryList';
import DrawerLocationDetails from './DrawerLocationDetails';
import { GoogleMapContext } from '../../providers/GoogleMapProvider';

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

const drawerBleeding = 100;

const Root = styled('div')(({ theme }) => ({
  height: '100%',
  backgroundColor:
    theme.palette.mode === 'light' ? grey[100] : theme.palette.background.default,
}));

const StyledBox = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'light' ? '#fff' : grey[800],
}));

const Puller = styled('div')(({ theme }) => ({
  width: 30,
  height: 6,
  backgroundColor: theme.palette.mode === 'light' ? grey[300] : grey[900],
  borderRadius: 3,
  position: 'absolute',
  top: 8,
  left: 'calc(50% - 15px)',
}));

export default function PersistentDrawerLeft({ selectedLocation, predictions, onLocationSelected }) {
  const { removeMarkers } = useContext(GoogleMapContext);
  const [selectedDrawerContent, setSelectedDrawerContent] = useState('history');
  
  /** @type {[MapLocation, React.Dispatch<React.SetStateAction<MapLocation>>]} */
  const [location, setLocation] = useState(null);

  const [open, setOpen] = useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

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
    onLocationSelected(e.lat, e.lng, e.placeId, e.name, e.isPlace);
  };

  const handleBackClicked = (location) => {
    // TODO: markers are not all getting removed!
    setSelectedDrawerContent('history');
    setLocation(null);
    removeMarkers([{ lat: location.lat, lng: location.lng }]);
  };
  const drawerWidth = 350;
  const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: {xs: 'row', sm: 'column'},
    alignItems: 'center',
    padding: theme.spacing(3, 1),
    // necessary for content to be below app bar
    justifyContent: 'center',
    backgroundColor: 'rgba(25, 118, 210, 0.12)', // Changed color
    boxShadow: '0px 2px 4px rgba(0,0,0,0.1)',
  }));
  
  const drawer = (
    <>
      <DrawerHeader>
        <DateTimePickerComponent />
        <IconButton onClick={toggleDrawer(!open)}
          sx={{zIndex: 100, position: 'absolute', right: 0}}>
          {open ? <ArrowDropUp sx={{fontSize: 50, display: { xs: 'block', sm: 'block', md: 'none', lg: 'none'}}} /> : <ArrowDropDown sx={{fontSize: 50, display: { xs: 'block', sm: 'block', md: 'none', lg: 'none'}}} />}
        </IconButton>
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
    </>
  );

  return (
    <>
      <Root>
        <Global
          styles={{
            '.MuiDrawer-root > .MuiPaper-root': {
              height: `calc(92% - ${drawerBleeding}px)`,
              overflow: 'visible',
            },
          }}/>
        <SwipeableDrawer
          anchor="bottom"
          open={open}
          onClose={toggleDrawer(false)}
          onOpen={toggleDrawer(true)}
          swipeAreaWidth={drawerBleeding}
          disableSwipeToOpen={false}
          allowSwipeInChildren={true}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{display: { xs: 'block', sm: 'block', md: 'none', lg: 'none'}}}
        >
          <StyledBox
            sx={{
              position: 'absolute',
              top: -drawerBleeding,
              borderTopLeftRadius: 8,
              borderTopRightRadius: 8,
              visibility: 'visible',
              right: 0,
              left: 0,
            }}
          >
            <Puller />
            {drawer}
          </StyledBox>
        </SwipeableDrawer>
      </Root>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'none', md: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, height: '100%', pt: 8 },
        }}
        open
      >
        {drawer}
      </Drawer>
    </>
  );
}
