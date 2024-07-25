import express from 'express';
import dbHandler from '../db/dbHandler.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const userId = req.query.userId;
  try {
    const results = await dbHandler.getUserHistories(userId);
    res.status(200).json(results);

  } catch (error) {
    res.status(500).json({message: 'Failed to get user history documents.', error: error.message });
  }
});

router.post('/', async (req, res) => {
  const { userId, favorites} = req.body;
  // eslint-disable-next-line no-console
  console.log('Received user history:', req.body);
  if (!userId) {
    return res.status(400).send({ message: 'userId is required' });
  }
  try {
    const userHistory = {
      userId,
      favorites,
    };

    if (favorites){
      await dbHandler.insertFavorites(userHistory);
      res.status(201).send({ message: ' Favorites updated!' });
      
    } else{
      await dbHandler.insertSearchHistory(userHistory);
      res.status(201).send({ message: ' Search History updated!' });
    }
    
  } catch (error) {
    res.status(500).send({ message: 'An error occurred in server side', error: error.message });
  }
});

export default router;