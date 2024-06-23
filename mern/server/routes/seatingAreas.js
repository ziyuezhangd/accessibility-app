import express from 'express';
import cityofNY from '../apis/cityofNY.js';
import logger from '../logger.js';

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
