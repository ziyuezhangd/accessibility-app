import dayjs from 'dayjs';
import _ from 'lodash';
import { createContext, useState, useEffect } from 'react';
import { getPedestrianRamps } from '../services/pedestrianRamps';
import { getPedestrianSignals } from '../services/pedestrianSignals';
import { getPlaceInfos } from '../services/placeInfo';
import { getBusynessRatings, getNoiseRatingsDaily, getOdourRatings } from '../services/ratings';
import { getPublicRestrooms } from '../services/restrooms';
import { getSeatingAreas } from '../services/seatingAreas';
import { getCurrentTimeInNewYork } from '../utils/dateTime';
import { calculateDistanceBetweenTwoCoordinates } from '../utils/MapUtils';

const DataContext = createContext();

const DataProvider = ({children}) => {
  const [restrooms, setRestrooms] = useState([]);
  const [placeInfos, setPlaceInfos] = useState([]);
  const [pedestrianRamps, setPedestrianRamps] = useState([]);
  const [pedestrianSignals, setPedestrianSignals] = useState([]);
  const [seatingAreas, setSeatingAreas] = useState([]);
  const [busynessData, setBusynessData] = useState([]);
  const [noiseData, setNoiseData] = useState([]);
  const [odorData, setOdorData] = useState([]);
  const [polylineData, setPolylineData] = useState(null);
  const [predictionDateTime, setPredictionDateTime] = useState(null);
    
  useEffect(() => {
    loadRestrooms();
    loadPlaceInfo();
    loadPedestrianRamps();
    loadPedestrianSignals();
    loadSeatingAreas();
    getPredictions();
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

  const getPredictions = async (selectedDate) => {
    console.log('Getting predictions');
    let busynessPredictions = busynessData;
    let noisePredictions = noiseData;
    let odorPredictions = odorData;
    const isFirstPrediction = !predictionDateTime;
    if (selectedDate === null || selectedDate === undefined) {
      if (isFirstPrediction) {
        selectedDate = getCurrentTimeInNewYork();
      } else {
        selectedDate = predictionDateTime;
      }
    }

    // Convert to ISO string
    selectedDate = dayjs(selectedDate).format('YYYY-MM-DD[T]HH:mm:ss');

    const isNewDayAndHour = (dayjs(selectedDate).day() !== dayjs(predictionDateTime).day() || dayjs(selectedDate).hour() !== dayjs(predictionDateTime).hour());
    // Re-load with the new selected date
    if (isFirstPrediction || isNewDayAndHour) {
      console.log('Reloading from server');
      console.log('selectedDate ', selectedDate);
      busynessPredictions = await loadBusynessRatings(selectedDate);
      noisePredictions = await loadNoiseRatings(selectedDate);
      odorPredictions = await loadOdourRatings(selectedDate);
      // Set polyline data
      const polylineData = [];
      for (const bp of busynessPredictions) {
        const location = bp.location;
        const busynessPrediction = bp.prediction;
        const noisePrediction = _.find(noisePredictions, np => 
          np.location.start.lat === bp.location.start.lat && 
          np.location.start.lng === bp.location.start.lng && 
          np.location.end.lat === bp.location.end.lat && 
          np.location.end.lng === bp.location.end.lng
        ).prediction;
        const odorPrediction = _.minBy(odorPredictions, op => calculateDistanceBetweenTwoCoordinates(op.location.lat, op.location.lng, bp.location.start.lat, bp.location.start.lng)).prediction;
        polylineData.push({location, busyness: busynessPrediction, noise: noisePrediction, odor: odorPrediction});
      }
      setPolylineData(polylineData);
    }
    setPredictionDateTime(selectedDate);

    return {busynessPredictions, noisePredictions, odorPredictions};
  };

  const loadBusynessRatings = async (selectedDate) => {
    const busynessRatings = await getBusynessRatings(selectedDate);
    setBusynessData(busynessRatings);
    return busynessRatings;
  };
  
  const loadNoiseRatings = async (selectedDate) => {
    const noiseRatings = await getNoiseRatingsDaily(selectedDate);
    setNoiseData(noiseRatings);
    return noiseRatings;
  };
  
  const loadOdourRatings = async (selectedDate) => {
    const odorRatings = await getOdourRatings(selectedDate);
    setOdorData(odorRatings);
    return odorRatings;
  };
  
  return (
    <DataContext.Provider value={{restrooms, placeInfos, getPredictions, busynessData, noiseData, odorData, seatingAreas, pedestrianRamps, pedestrianSignals, polylineData}}>
      {children}
    </DataContext.Provider>
  );
};

export { DataContext, DataProvider };