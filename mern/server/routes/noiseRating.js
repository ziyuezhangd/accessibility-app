import express from 'express';
import ml from '../apis/ml.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const { hour } = req.query;
  if (!hour) {
    return res.status(400).send({ message: 'hour parameter is required' });
  }

  try {
    const predictions = ml.getNoisePredictions(hour);
    res.status(200).send(predictions);
  } catch (error){
    res.status(500).json({message: 'Failed to retrieve the noise rating', error: error.message });
  }
});

export default router;
