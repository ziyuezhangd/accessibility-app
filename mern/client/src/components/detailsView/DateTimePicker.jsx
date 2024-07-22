import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import { useContext } from 'react';
import { DataContext } from '../../providers/DataProvider';
import { getCurrentTimeInNewYork } from '../../utils/dateTime';

const INITIAL_TIME = getCurrentTimeInNewYork();

const StyledTextField = styled(TextField)(({ theme }) => ({
  width: '250px',
  '& .MuiInputBase-root': {
    borderRadius: '8px',
    backgroundColor: 'white',
    boxShadow: theme.shadows[2],
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#1976d2',
    },
    '&:hover fieldset': {
      borderColor: '#1976d2',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#1976d2',
    },
  },
  '& .MuiInputAdornment-root': {
    color: '#1976d2',
  },
  '& .MuiInputLabel-root': {
    color: '#1976d2',
  },
}));

const DateTimePickerComponent = () => {
  const { getPredictions, selectedDateTime } = useContext(DataContext);

  const handleDateChange = (newValue) => {
    getPredictions(newValue);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateTimePicker
        label="Select Date & Time"
        timezone="America/New_York"
        value={dayjs(selectedDateTime)}
        onChange={handleDateChange}
        renderInput={(params) => <StyledTextField {...params} />}
      />
    </LocalizationProvider>
  );
};

export default DateTimePickerComponent;
