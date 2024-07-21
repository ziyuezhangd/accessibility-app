import FilterListIcon from '@mui/icons-material/FilterList';
import { FormControl, Select, MenuItem, IconButton, Menu, Box } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { styled } from '@mui/system';
import { useState } from 'react';
import list from '../../list.json';

const CustomFormControl = styled(FormControl)({
  width: '200px',
  backgroundColor: '#4a90e2',
  borderRadius: '8px',
  zIndex: 1000,
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: 'white',
    },
    '&:hover fieldset': {
      borderColor: 'white',
    },
    '&.Mui-focused fieldset': {
      borderColor: 'white',
    },
    color: 'white',
  },
  '& .MuiSelect-icon': {
    color: 'white',
  },
  '& .MuiMenu-paper': {
    backgroundColor: '#4a90e2',
    color: 'white',
  },
});

const CustomSelect = styled(Select)({
  '& .MuiSelect-select': {
    display: 'flex',
    alignItems: 'center',
    color: 'white',
  },
});

const PlaceholderOption = styled(MenuItem)({
  display: 'none',
});

function PredictionDropdown({ onSelect }) {
  const isTabletOrSmaller = useMediaQuery('(max-width: 960px)');

  const [selectedOption, setSelectedOption] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);

  const handleSelect = (event) => {
    const value = event.target.value;
    const selectedItem = value !== 'none' ? list.find(item => item.name === value) : { name: 'none' };
    onSelect(selectedItem);
    setSelectedOption(value);
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = (item) => {
    if (item) {
      onSelect(item);
      setSelectedOption(item.name);
    }
    setAnchorEl(null);
  };

  return (
    <>
      <CustomFormControl variant="outlined">
        <CustomSelect
          id="dropdown"
          value={selectedOption}
          onChange={handleSelect}
          displayEmpty
          renderValue={
            selectedOption !== '' ? undefined : () => 'Select Heatmap'
          }
        >
          <PlaceholderOption value="">
            <em>Select Heatmap</em>
          </PlaceholderOption>
          {list.map((item, index) => (
            <MenuItem key={index}
              value={item.name}>
              {item.name}
            </MenuItem>
          ))}
          <MenuItem value="none">
              None
          </MenuItem>
        </CustomSelect>
      </CustomFormControl>
     
    </>
  );
}

export default PredictionDropdown;
