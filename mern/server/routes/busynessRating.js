import express from 'express';
import dbHandler from '../db/dbHandler.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const { datetime } = req.query;
  const datetimeObj = new Date(datetime);
  if (!datetime) {
    return res.status(400).send({ message: 'Datetime parameter is required' });
  }

  try{
    const latestModel = await dbHandler.getLatestModel('busynessModel');

    //this assumes a method called 'predict'
    const predictions = latestModel.predict(datetimeObj);

    res.status(200).send(predictions);
  }
  catch (error){
    res.status(500).json({message: 'Failed to retrieve the busyness rating.', error });
  }
});

router.get('/location', async (req, res) => {
  const { datetime, lat, long } = req.query;
  if (!datetime) {
    return res.status(400).send({ message: 'A datetime parameter is required' });
  }
      
  if (!lat || !long) {
    return res.status(400).send({ message: 'The latitude and longitude parameters are required' });
  }  
  const latitude = parseFloat(lat);
  const longitude = parseFloat(long);  
  const datetimeObj = new Date(datetime);
    
  try{
    const latestModel = await dbHandler.getLatestModel('busynessModel');

    //this assumes a method called 'predict'
    const predictions = latestModel.predict(datetimeObj, latitude, longitude);

    res.status(200).send(predictions);
  }
  catch (error){
    res.status(500).json({message: 'Failed to retrieve the busyness rating.', error });
  }
});

export default router;

