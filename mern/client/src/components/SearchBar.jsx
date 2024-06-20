import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

const SearchBar = ({ onPOISelect }) => {
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    // Replace with actual search logic
    const poi = { name: query, lat: 40.7128, lng: -74.0060 }; // Example coordinates
    onPOISelect(poi);
  };

  return (
    <div>
      <TextField
        label="Search Point of Interest"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <Button onClick={handleSearch}>Search</Button>
    </div>
  );
};

export default SearchBar;
