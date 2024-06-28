import FilterListIcon from '@mui/icons-material/FilterList';
import { FormControl, Select, MenuItem, IconButton, Menu } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { styled } from '@mui/system';
import { useState } from 'react';
import list from '../../list.json';

const CustomFormControl = styled(FormControl)({
  width: '200px',
  backgroundColor: '#4a90e2',
  borderRadius: '8px',
  position: 'absolute',
  top: '10px',
  left: '190px',
  zIndex: 1000,
  '@media (max-width: 1440px)': {
    maxWidth: '200px',
  },
  '@media (max-width: 1280px)': {
    maxWidth: '200px',
    left: '160px',
  },
  '@media (max-width: 960px)': {
    maxWidth: '200px',
    left: '120px',
  },
  '@media (max-width: 600px)': {
    maxWidth: '200px',
    left: '80px',
    top: '20px',
  },
  '@media (max-width: 480px)': {
    maxWidth: '200px',
    left: '40px',
    top: '30px',
  },
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

function Dropdown({ onSelect }) {
  const isTabletOrSmaller = useMediaQuery('(max-width: 960px)');

  const [selectedOption, setSelectedOption] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);

  const handleSelect = (event) => {
    const selectedItem = list.find(item => item.name === event.target.value);
    onSelect(selectedItem);
    setSelectedOption(event.target.value);
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
      {!isTabletOrSmaller ? (
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
          </CustomSelect>
        </CustomFormControl>
      ) : (
        <>
          <IconButton
            aria-controls="simple-menu"
            aria-haspopup="true"
            onClick={handleMenuClick}
            sx={{
              backgroundColor: '#4a90e2',
              color: 'white',
              position: 'absolute',
              top: '10px',
              left: '190px',
              '&:hover': {
                backgroundColor: '#357ABD',
              },
              '@media (max-width: 1280px)': {
                left: '160px',
              },
              '@media (max-width: 960px)': {
                left: '120px',
              },
              '@media (max-width: 600px)': {
                left: '80px',
                top: '20px',
              },
              '@media (max-width: 480px)': {
                left: '40px',
                top: '30px',
              },
            }}
          >
            <FilterListIcon />
          </IconButton>
          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={() => handleMenuClose(null)}
          >
            {list.map((item, index) => (
              <MenuItem
                key={index}
                onClick={() => handleMenuClose(item)}
              >
                {item.name}
              </MenuItem>
            ))}
          </Menu>
        </>
      )}
    </>
  );
}

export default Dropdown;
