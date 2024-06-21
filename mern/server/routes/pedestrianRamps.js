import express from 'express';
import logger from '../logger.js';
import cityofNY from '../services/cityofNY.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const rampInfo = await cityofNY.getPedestrianRamps();
    res.status(200).send(rampInfo);
  } catch (error) {
    logger.error(error.stack);
    res.status(500).send({ message: 'Failed to load pedestrian ramps..', error: error.message });
  }
});

export default router;
