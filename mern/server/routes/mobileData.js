import express from 'express';
import dbHandler from '../db/dbHandler.js';
import logger from '../logger.js';

const router = express.Router();

router.post('/users', async (req, res) => {
  // Pass for now
});

router.post('/health-data', async (req, res) => {
  try {
    const { userId, clinicalRecords, bloodPressure, heartRate, audioLevel } = req.body;
    dbHandler.upsertUser({ userId, clinicalRecords, bloodPressure, heartRate, audioLevel });
    res.status(200).send('Done');
  } catch (error) {
    res.status(500).send({ message: 'An error occurred', error: error.message });
  }
});

router.post('/location-data', async (req, res) => {
  const { latitude, longitude, altitude, accuracy, audioLevel, userId, clinicalRecords, heartRate, bloodPressure } = req.body;
  dbHandler.insertLocationData({ latitude, longitude, altitude, accuracy, audioLevel, userId, clinicalRecords, heartRate, bloodPressure });
});

export default router;
