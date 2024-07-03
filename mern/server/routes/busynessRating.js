import express from 'express';
import ml from '../apis/ml.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const { datetime } = req.query;
  if (!datetime) {
    return res.status(400).send({ message: 'datetime parameter is required' });
  }

  try{
    const predictions = await ml.getBusynessPredictions(datetime);
    res.status(200).send(predictions);
  }
  catch (error){
    res.status(500).json({message: 'Failed to retrieve the busyness rating.', error: error.message });
  }
});

export default router;