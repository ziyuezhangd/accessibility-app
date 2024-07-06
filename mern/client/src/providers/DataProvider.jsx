import _ from 'lodash';
import { createContext, useState, useEffect } from 'react';
import { getPlaceInfos } from '../services/placeInfo';
import { getPublicRestrooms } from '../services/restrooms';
import { getUserHistories } from '../services/userHistory';

const DataContext = createContext();

const DataProvider = ({children}) => {
  const [restrooms, setRestrooms] = useState([]);
  const [placeInfos, setPlaceInfos] = useState([]);
  const [userHistories, setUserHistories] = useState([]);
    
  useEffect(() => {
    loadRestrooms();
    loadPlaceInfo();
    loadUserHistory();
  }, []);

  const loadRestrooms = async () => {
    const restrooms = await getPublicRestrooms('incl-partial');
    setRestrooms(restrooms);
  };
  
  const loadPlaceInfo = async () => {
    const placeInfos = await getPlaceInfos();
    setPlaceInfos(placeInfos);
  };
  
  const loadUserHistory = async () => {
    const userHistories = await getUserHistories();
    setUserHistories(userHistories);
  };
  
  return (
    <DataContext.Provider value={{restrooms, placeInfos, userHistories}}>
      {children}
    </DataContext.Provider>
  );
};

export { DataContext, DataProvider };