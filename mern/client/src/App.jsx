import React, { useState } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import SearchBar from './components/SearchBar';
// import Map from '../Map';
import Map from './components/map/Map';

import NavBar from './components/NavBar';
import PointOfInterestDetails from './components/PointOfInterestDetails';

const App = () => {
  const [selectedPOI, setSelectedPOI] = useState(null);

  const handlePOISelect = (poi) => {
    setSelectedPOI(poi);
  };

  return (
    <div>
      <CssBaseline />
      <NavBar />
      <Container>
        <SearchBar onPOISelect={handlePOISelect} />
        <Map selectedPOI={selectedPOI} />
        {selectedPOI && <PointOfInterestDetails poi={selectedPOI} />}
      </Container>
    </div>
  );
};

export default App;
