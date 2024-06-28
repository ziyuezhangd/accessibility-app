import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import MailIcon from '@mui/icons-material/Mail';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import { List, ListItem } from '@mui/material';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

/**
 * DrawerHistoryList function component.
 * 
 * This component renders a list of location history items in a drawer.
 * 
 * @param {Object} props - The properties passed to the component.
 * @param {function} props.onLocationSelected - Function to call when a location item is selected. Takes a MapLocation as a parameter
 * 
 * @returns {JSX.Element} The rendered DrawerHistoryList component.
 */

export default function DrawerHistoryList({ onLocationSelected }) {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    getHistory();
  }, []);

  // TODO: maybe we want to show the date/time?
  const getHistory = () => {
    const history = localStorage.getItem('searchHistory');
    if (history) {
      setHistory(JSON.parse(history));
    }
  };

  return (
    <>
      <DrawerHeader>
        <Typography variant='h5'>Last viewed</Typography>
      </DrawerHeader>
      <Box sx={{ overflow: 'auto' }}>
        <List>
          {history.map((location, index) => (
            <ListItem key={location.name} 
              disablePadding>
              <ListItemButton onClick={() => onLocationSelected(location)}>
                <ListItemText primary={location.name} />
                <ChevronRightIcon />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
      </Box>
    </>
  );
}