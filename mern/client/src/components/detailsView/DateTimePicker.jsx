import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useContext } from 'react';
import { DataContext } from '../../providers/DataProvider';
import { getCurrentTimeInNewYork } from '../../utils/dateTime';

const INITIAL_TIME = getCurrentTimeInNewYork();
const DateTimePickerComponent = () => {
  const { getPredictions } = useContext(DataContext);

  const handleDateChange = (newValue) => {
    getPredictions(newValue);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateTimePicker
        label="Date & Time picker"
        timezone="America/New_York"
        value={INITIAL_TIME}
        onChange={handleDateChange}
        renderInput={(params) => (
          <TextField
            {...params}
            sx={{ width: '150px', fontSize: '0.1rem', '.MuiInputBase-input': { padding: '8px' } }}
          />
        )}
      />
    </LocalizationProvider>
  );
};

export default DateTimePickerComponent;
