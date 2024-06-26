import express from 'express';
import cityofNY from '../apis/cityofNY.js';
import logger from '../logger.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    let restrooms;
    const { accessibility } = req.query;
    switch (accessibility) {
    case 'full-only':
      restrooms = await cityofNY.getAccessibleRestrooms(false);
      break;
    case 'incl-partial':
      restrooms = await cityofNY.getAccessibleRestrooms(true);
      break;
    case 'all':
      restrooms = await cityofNY.getPublicRestrooms();
      break;
    }
    res.status(200).send(restrooms);
  } catch (error) {
    logger.error(error);
    res.status(500).send({ message: 'Failed to load restrooms.', error: error.message });
  }
});

export default router;
