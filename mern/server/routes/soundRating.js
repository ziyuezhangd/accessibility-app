import express from 'express';
import db from '../db/connection.js';

const router = express.Router();

router.get('/sound-ratings', async (req, res) => {
  const { datetime } = req.query;
  const datetimeObj = new Date(datetime);
  if (!datetime) {
    return res.status(400).send({ message: 'Datetime parameter is required' });
  }

  try {
    const collection = db.collection('soundModel');
    const latestModel = await collection.findOne({}, { sort: { date: -1 } });

    //this assumes a method called 'predict'
    const predictions = latestModel.predict(datetimeObj);

    res.status(200).send(predictions);
  } catch (error){
    res
      .status(500)
      .send({ message: 'An error occurred', error: error.message });
  }
});
router.get('/sound-ratings/location', async (req, res) => {
  const { datetime, lat, long } = req.query;
  if (!datetime) {
    return res
      .status(400)
      .send({ message: 'A datetime parameter is required' });
  }

  if (!lat || !long) {
    return res
      .status(400)
      .send({ message: 'The latitude and longitude parameters are required' });
  }
  const latitude = parseFloat(lat);
  const longitude = parseFloat(long);
  const datetimeObj = new Date(datetime);

  try {
    const collection = db.collection('soundModel');
    const latestModel = await collection.findOne({}, { sort: { date: -1 } });

    //this assumes a method called 'predict'
    const predictions = latestModel.predict(datetimeObj, latitude, longitude);

    res.status(200).send(predictions);
  } catch (error){
    res
      .status(500)
      .send({ message: 'An error occurred', error: error.message });
  }
});

export default router;
