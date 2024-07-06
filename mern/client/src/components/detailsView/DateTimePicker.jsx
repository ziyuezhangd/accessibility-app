import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

const DateTimePickerComponent = ({ selectedDate, onDateSelected }) => {
  const handleDateChange = (newValue) => {
    onDateSelected(newValue);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateTimePicker
        label="Date & Time picker"
        value={selectedDate}
        timezone="America/New_York"
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
