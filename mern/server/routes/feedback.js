import express from 'express';
import dbHandler from '../db/dbHandler.js';
import logger from '../logger.js';

const router = express.Router();
router.post('/', async (req, res) => {
  const { name, email, comment, coordinates } = req.body;
  
  if (!name || !email || !comment) {
    return res.status(400).send({ message: 'The following fields are required: name, email, comment.' });
  }
  
  try {
    const feedback = {
      name,
      email,
      comment,
      date: new Date()
    };

    if (coordinates) {
      feedback.coordinates = coordinates;
    }
  
    // await collection.insertOne(feedback);
    await dbHandler.insertFeedback(feedback);
  
    res.status(201).send({ message: 'Thank you for your feedback!' });
  } catch (error) {
    res.status(500).send({ message: 'An error occurred', error: error.message });
  }
});
  
export default router;