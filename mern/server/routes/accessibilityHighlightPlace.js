import express from 'express';
import db from '../db/connection.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const results = await db.collection('accessibilityHighlightPlace').find({}).toArray();
    res.status(200).json(results);

  } catch (error) {
    res.status(500).json({message: 'Failed to get feedback documents.', error });
  }
});

export default router;