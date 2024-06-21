import express from 'express';
import cityofNY from '../apis/cityofNY.js';
import logger from '../logger.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const signalInfo = await cityofNY.getPedestrianSignals();
    res.status(200).send(signalInfo);
  } catch (error) {
    logger.error(error.stack);
    res.status(500).send({ message: 'Failed to load pedestrian signals.', error: error.message });
  }
});

export default router;
