import express from 'express';
import dbHandler from '../db/dbHandler.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const results = await dbHandler.getUserHistory();
    res.status(200).json(results);

  } catch (error) {
    res.status(500).json({message: 'Failed to get user history documents.', error: error.message });
  }
});

router.post('/', async (req, res) => {
  const { name, email, favorites, searchHistory } = req.body;
    
  if (!email) {
    return res.status(400).send({ message: 'Email address is required' });
  }
  try {
    const userHistory = {
      name,
      email,
      favorites,
      searchHistory
    };

    if (userHistory.favorites && userHistory.searchHistory){
      await dbHandler.insertUserHistory(userHistory);
    }else if (userHistory.searchHistory){
      await dbHandler.insertSearchHistory(userHistory.searchHistory);
    }
    if (userHistory.favorites){
      await dbHandler.insertfavorites(userHistory.favorites);
    }
    
    res.status(201).send({ message: 'Thank you for your feedback!' });
  } catch (error) {
    res.status(500).send({ message: 'An error occurred', error: error.message });
  }
});

export default router;