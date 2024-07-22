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
  const { name, email, favorites, searchHistory} = req.body;
  // eslint-disable-next-line no-console
  console.log('Received user history:', req.body);
  if (!email) {
    return res.status(400).send({ message: 'Email address is required' });
  }
  try {
    const userHistory = {
      name,
      email,
      favorites,
      searchHistory,
    };

    if (favorites){
      await dbHandler.insertFavorites(userHistory);
    } else{
      await dbHandler.insertSearchHistory(userHistory);
    }
    res.status(201).send({ message: ' added!!' });
  } catch (error) {
    res.status(500).send({ message: 'An error occurred in server side', error: error.message });
  }
});

export default router;