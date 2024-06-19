import express from 'express';
import logger from '../logger.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const result = await fetch(`https://data.cityofnewyork.us/resource/ufzp-rrqu.json?borough=1&$$app_token=${process.env.SOCRATA_APP_KEY}`);
    const data = await result.json();
    // TODO: cant get the logger to work correctly
    logger.info(`${data}`);
    // Filter down to the data we care about
    const rampInfo = data.map((d) => ({
      latitude: d.the_geom.coordinates[1],
      longitude: d.the_geom.coordinates[0],
      width: d.ramp_width,
    }));
    res.status(200).send(rampInfo);
  } catch (error) {
    logger.error(error.stack);
    res.status(500).send({ message: 'Failed to load pedestrian ramps..', error: error.message });
  }
});

export default router;
