import './App.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import '@fontsource/playfair-display';
import { Outlet } from 'react-router-dom';
import { NavBar } from './components/NavBar';

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
