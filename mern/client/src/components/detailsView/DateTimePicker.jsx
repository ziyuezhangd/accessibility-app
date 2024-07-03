import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import React from 'react';

const DateTimePickerComponent = ({ selectedDate, setSelectedDate }) => {
  const handleDateChange = (newValue) => {
    setSelectedDate(newValue);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateTimePicker
        label="Date & Time picker"
        value={selectedDate}
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
