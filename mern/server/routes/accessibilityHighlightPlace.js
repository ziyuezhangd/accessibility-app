import express from 'express';
import db from '../db/connection.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const collection = await db.collection('accessibilityHighlightPlace');
    const results = await collection.find({}).toArray();
    res.status(200).json(results);

  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;