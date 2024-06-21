import express from 'express';
import logger from '../logger.js';
import cityofNY from '../apis/cityofNY.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const seatingInfo = await cityofNY.getSeatingAreas();
    res.status(200).send(seatingInfo);
  } catch (error) {
    logger.error(error);
    res.status(500).send({ message: 'Failed to load seating areas.', error: error.message });
  }
});

export default router;
