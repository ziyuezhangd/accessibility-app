import _ from 'lodash';
import { createContext, useState, useEffect } from 'react';
import { getPlaceInfos } from '../services/placeInfo';
import { getPublicRestrooms } from '../services/restrooms';

const DataContext = createContext();

const DataProvider = ({children}) => {
  const [restrooms, setRestrooms] = useState([]);
  const [placeInfos, setPlaceInfos] = useState([]);
    
  useEffect(() => {
    loadRestrooms();
    loadPlaceInfo();
  }, []);

  const loadRestrooms = async () => {
    const restrooms = await getPublicRestrooms('incl-partial');
    setRestrooms(restrooms);
  };
  
  const loadPlaceInfo = async () => {
    const placeInfos = await getPlaceInfos();
    setPlaceInfos(placeInfos);
  };
  
  return (
    <DataContext.Provider value={{restrooms, placeInfos}}>
      {children}
    </DataContext.Provider>
  );
};

export { DataContext, DataProvider };