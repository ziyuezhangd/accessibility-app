// DontRemindButton.jsx
import { Button, Box } from '@mui/material';

const DontRemindButton = ({ onClick }) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 1 }}>
      <Button onClick={onClick} color="primary" size="small">
        Don't remind me again
      </Button>
    </Box>
  );
};

export default DontRemindButton;
