import express from 'express';
import logger from '../logger.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const result = await fetch(`https://data.cityofnewyork.us/resource/esmy-s8q5.json?boroname=Manhattan&$$app_token=${process.env.SOCRATA_APP_KEY}`);
    const data = await result.json();
    // TODO: cant get the logger to work correctly
    // logger.log(`${data}`);
    // Filter down to the data we care about
    const seatingInfo = data.map((d) => ({
      seatType: d.asset_subtype,
      category: d.category,
      latitude: d.latitude,
      longitude: d.longitude,
    }));
    res.status(200).send(seatingInfo);
  } catch (error) {
    logger.error(error);
    res.status(500).send({ message: 'Failed to load seating areas.', error: error.message });
  }
});

export default router;
