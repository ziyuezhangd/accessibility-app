import express from 'express';
import logger from '../logger.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const result = await fetch(`https://data.cityofnewyork.us/resource/de3m-c5p4.json?boroname=Manhattan&$$app_token=${process.env.SOCRATA_APP_KEY}`);
    const data = await result.json();
    // TODO: cant get the logger to work correctly
    // logger.log(`${data}`);
    // Filter down to the data we care about
    const signalInfo = data.map((d) => ({
      latitude: d.point_y,
      longitude: d.point_x,
    }));
    res.status(200).send(signalInfo);
  } catch (error) {
    logger.error(error);
    res.status(500).send({ message: 'Failed to load pedestrian signals.', error: error.message });
  }
});

export default router;
