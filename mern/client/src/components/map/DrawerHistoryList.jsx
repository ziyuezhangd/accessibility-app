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
          {history.map((text, index) => (
            <ListItem key={text}
              disablePadding>
              <ListItemButton onClick={() => onLocationSelected(text)}>
                <ListItemText primary={text} />
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
