import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import MailIcon from '@mui/icons-material/Mail';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import { List, ListItem } from '@mui/material';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { useEffect, useState } from 'react';

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
      const parsedHistory = JSON.parse(history);
      const recentHistory = parsedHistory.slice(0, 10); // Get the 10 most recent items
      setHistory(recentHistory);
    }
  };
  return (
    <>
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