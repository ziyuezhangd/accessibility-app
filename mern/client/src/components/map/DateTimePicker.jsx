// DateTimePicker.jsx

import { TextField } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker as MuiDateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import * as React from 'react';

const DateTimePicker = ({ selectedDate, setSelectedDate }) => {
  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DateTimePicker']}>
        <MuiDateTimePicker
          label="Select Date & Time"
          value={selectedDate}
          onChange={handleDateChange}
          renderInput={(params) => <TextField {...params} />}
        />
      </DemoContainer>
    </LocalizationProvider>
  );
};

export default DateTimePicker;
