import { List, ListItem, ListItemText } from '@mui/material';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import ListItemButton from '@mui/material/ListItemButton';
import { styled } from '@mui/material/styles';
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
const HoverLine = styled('div')(({ theme }) => ({
  position: 'absolute',
  height: '100%',
  background: '#1976d2', // Updated to use #1976d2
  left: 0,
  width: '5px', // Slightly thicker line
  top: 0,
  transform: 'scaleY(0)',
  transition: 'transform 0.3s ease-out',
}));

const StyledListItemButton = styled(ListItemButton)(({ theme }) => ({
  position: 'relative',
  padding: '10px 20px',
  transition: 'box-shadow 0.3s, transform 0.3s',
  overflow: 'hidden',
  '&:hover': {
    boxShadow: theme.shadows[3], // Elevate on hover
    transform: 'translateX(5px)', // Slight movement to the right
    '& .hover-line': {
      transform: 'scaleY(1)',
    },
    '&::after': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      height: '100%',
      width: '0%',
      backgroundColor: 'rgba(25, 118, 210, 0.12)', // Fill background on hover
      zIndex: 0,
      transition: 'width 1s ease-out', // Slowed down transition
    },
  },
  '&:hover::after': {
    width: '100%',
  },
  '& .hover-line': {
    transform: 'scaleY(0)',
  },
}));

export default function DrawerHistoryList({ onLocationSelected }) {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    getHistory();
  }, []);

  const getHistory = () => {
    const history = localStorage.getItem('searchHistory');
    if (history) {
      const parsedHistory = JSON.parse(history);
      const recentHistory = parsedHistory.slice(0, 10); // Get the 10 most recent items
      setHistory(recentHistory);
    }
  };

  return (
    <Box sx={{ overflowY: 'auto', overflowX: 'hidden' }}
      aria-labelledby='Side bar with information'>
      <List aria-labelledby='Recently viewed locations'
        aria-label='Recently viewed locations'>
        {history.map((location) => (
          <ListItem data-test='list' 
            key={location.name}
            disablePadding>
            <StyledListItemButton onClick={() => onLocationSelected(location)}>
              <HoverLine className="hover-line" />
              <ListItemText primary={location.name}
                sx={{ zIndex: 1, position: 'relative' }} />
            </StyledListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
    </Box>
  );
}
