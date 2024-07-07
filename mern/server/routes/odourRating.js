import express from 'express';
import ml from '../apis/ml.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const { datetime } = req.query;
  if (!datetime) {
    return res.status(400).send({ message: 'datetime parameter is required' });
  }
  const formatRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/;
  if(!formatRegex.test(datetime)) {
    return res.status(400).send({ message: 'datetime parameter should be in ISO 8601 format (e.g., \'2024-07-01T14:30:00\')' });
  }

  try {
    const predictions = await ml.getOdourPredictions(datetime);
    res.status(200).send(predictions);
  } catch (error) {
    res.status(500).json({message: 'Failed to retrieve the odour rating.', error: error.message });
  }
});

export default router;