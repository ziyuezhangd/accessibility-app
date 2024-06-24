import express from 'express';
import accessibilityCloud from '../apis/accessibilityCloud.js';
import logger from '../logger.js';

const placeInfosRouter = express.Router();

placeInfosRouter.get('/', async (req, res) => {
  try {
    const placeInfos = await accessibilityCloud.getPlaceInfos();
    res.status(200).json(placeInfos);
  } catch (error) {
    logger.error(error.stack);
    res.status(500).send({ message: 'Failed to get place infos.', error: error.message });
  }
});

placeInfosRouter.get('/categories', async (req, res) => {
  try {
    const categories = await accessibilityCloud.getCategories();
    res.status(200).send(categories);
  } catch (error) {
    logger.error(error.stack);
    res.status(500).send({ message: 'Failed to get categories.', error: error.message });
  }
});

export default placeInfosRouter;