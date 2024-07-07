import _ from 'lodash';
import { createContext, useState, useEffect } from 'react';
import { getPedestrianRamps } from '../services/pedestrianRamps';
import { getPedestrianSignals } from '../services/pedestrianSignals';
import { getPlaceInfos } from '../services/placeInfo';
import { getPublicRestrooms } from '../services/restrooms';
import { getSeatingAreas } from '../services/seatingAreas';

const DataContext = createContext();

const DataProvider = ({children}) => {
  const [restrooms, setRestrooms] = useState([]);
  const [placeInfos, setPlaceInfos] = useState([]);
  const [pedestrianRamps, setPedestrianRamps] = useState([]);
  const [pedestrianSignals, setPedestrianSignals] = useState([]);
  const [seatingAreas, setSeatingAreas] = useState([]);
    
  useEffect(() => {
    loadRestrooms();
    loadPlaceInfo();
    loadPedestrianRamps();
    loadPedestrianSignals();
    loadSeatingAreas();
  }, []);

  const loadRestrooms = async () => {
    const restrooms = await getPublicRestrooms('incl-partial');
    setRestrooms(restrooms);
  };

  const loadPedestrianSignals = async () => {
    const signals = await getPedestrianSignals();
    setPedestrianSignals(signals);
  };

  const loadPedestrianRamps = async () => {
    const ramps = await getPedestrianRamps();
    setPedestrianRamps(ramps);
  };

  const loadSeatingAreas = async () => {
    const ramps = await getSeatingAreas();
    setSeatingAreas(ramps);
  };
  
  const loadPlaceInfo = async () => {
    const placeInfos = await getPlaceInfos();
    setPlaceInfos(placeInfos);
  };
  
  return (
    <DataContext.Provider value={{restrooms, placeInfos, seatingAreas, pedestrianRamps, pedestrianSignals}}>
      {children}
    </DataContext.Provider>
  );
};

export { DataContext, DataProvider };