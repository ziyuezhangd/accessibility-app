import express from 'express';
import ml from '../apis/ml.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const { month, day, hour, dayOfWeek } = req.query;
  if (!month || !day || !hour || !dayOfWeek) {
    return res.status(400).send({ message: 'month, day, hour and dayOfWeek parameters are required' });
  }

  try{
    const predictions = ml.getBusynessPredictions(month, day, hour, dayOfWeek);
    res.status(200).send(predictions);
  }
  catch (error){
    res.status(500).json({message: 'Failed to retrieve the busyness rating.', error: error.message });
  }
});


export default router;