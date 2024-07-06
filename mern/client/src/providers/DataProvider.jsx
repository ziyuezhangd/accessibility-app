import dayjs from 'dayjs';
import _ from 'lodash';
import { createContext, useState, useEffect } from 'react';
import { getPlaceInfos } from '../services/placeInfo';
import { getBusynessRatings, getNoiseRatings, getOdourRatings } from '../services/ratings';
import { getPublicRestrooms } from '../services/restrooms';
import { getCurrentTimeInNewYork } from '../utils/dateTime';

const DataContext = createContext();

const DataProvider = ({children}) => {
  const [restrooms, setRestrooms] = useState([]);
  const [placeInfos, setPlaceInfos] = useState([]);
  const [busynessData, setBusynessData] = useState([]);
  const [noiseData, setNoiseData] = useState([]);
  const [odorData, setOdorData] = useState([]);
  const [predictionDateTime, setPredictionDateTime] = useState(null);
    
  useEffect(() => {
    loadRestrooms();
    loadPlaceInfo();
    getPredictions();
  }, []);

  const loadRestrooms = async () => {
    const restrooms = await getPublicRestrooms('incl-partial');
    setRestrooms(restrooms);
  };
  
  const loadPlaceInfo = async () => {
    const placeInfos = await getPlaceInfos();
    setPlaceInfos(placeInfos);
  };

  const getPredictions = async (selectedDate) => {
    if (selectedDate === null || selectedDate === undefined) {
      selectedDate = getCurrentTimeInNewYork();
    }

    // Convert to ISO string
    selectedDate = dayjs(selectedDate).format('YYYY-MM-DD[T]HH:mm:ss');
    console.log('Getting predictions for', selectedDate);

    const isNewDayAndHour = (dayjs(selectedDate).day() !== dayjs(predictionDateTime).day() && dayjs(selectedDate).hour() !== dayjs(predictionDateTime).hour());
    const isFirstPrediction = !predictionDateTime;
    // Re-load with the new selected date
    if (isFirstPrediction || isNewDayAndHour) {
      console.log('Reloading from server');
      console.log('predictionDateTime ', predictionDateTime);
      console.log('selectedDate ', selectedDate);
      await loadBusynessRatings(selectedDate);
      await loadNoiseRatings(selectedDate);
      await loadOdourRatings(selectedDate);
    }
    setPredictionDateTime(selectedDate);
    return {busynessData, noiseData, odorData};
  };

  const loadBusynessRatings = async (selectedDate) => {
    const busynessRatings = await getBusynessRatings(selectedDate);
    console.log('busynessRatings: ', busynessRatings);
    setBusynessData(busynessRatings);
    return busynessRatings;
  };
  
  const loadNoiseRatings = async (selectedDate) => {
    const noiseRatings = await getNoiseRatings(selectedDate);
    console.log('noiseRatings: ', noiseRatings);
    setNoiseData(noiseRatings);
    return noiseRatings;
  };
  
  const loadOdourRatings = async (selectedDate) => {
    const odorRatings = await getOdourRatings(selectedDate);
    console.log('OdorRatings: ', odorRatings);
    setOdorData(odorRatings);
    return odorRatings;
  };
  
  return (
    <DataContext.Provider value={{restrooms, placeInfos, getPredictions, busynessData, noiseData, odorData}}>
      {children}
    </DataContext.Provider>
  );
};

export { DataContext, DataProvider };