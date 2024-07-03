import express from 'express';
import dbHandler from '../db/dbHandler.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const results = await dbHandler.getAccessibilityHighlightPlaces();
    res.status(200).json(results);

  } catch (error) {
    res.status(500).json({message: 'Failed to get feedback documents.', error: error.message });
  }
});

export default router;