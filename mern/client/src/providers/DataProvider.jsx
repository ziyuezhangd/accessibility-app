import _ from 'lodash';
import { createContext, useState, useEffect } from 'react';
import { getAccessibilityHighlightPlaces } from '../services/highlights';
import { getPlaceInfos } from '../services/placeInfo';
import { getPublicRestrooms } from '../services/restrooms';

const DataContext = createContext();

const DataProvider = ({children}) => {
  const [restrooms, setRestrooms] = useState([]);
  const [placeInfos, setPlaceInfos] = useState([]);
  const [accessibilityHighlightPlaces, setAccessibilityHighlightPlaces] = useState([]);
    
  useEffect(() => {
    loadRestrooms();
    loadPlaceInfo();
    loadAccessibilityHighlightPlaces();
  }, []);

  const loadRestrooms = async () => {
    const restrooms = await getPublicRestrooms('incl-partial');
    setRestrooms(restrooms);
  };
  
  const loadPlaceInfo = async () => {
    const placeInfos = await getPlaceInfos();
    setPlaceInfos(placeInfos);
  };

  const loadAccessibilityHighlightPlaces = async () => {
    const accessibilityHighlightPlaces = await getAccessibilityHighlightPlaces();
    setAccessibilityHighlightPlaces(accessibilityHighlightPlaces);
  };
  
  return (
    <DataContext.Provider value={{restrooms, placeInfos, accessibilityHighlightPlaces}}>
      {children}
    </DataContext.Provider>
  );
};