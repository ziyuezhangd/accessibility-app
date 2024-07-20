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
    if (!userId) {
      res.status(400).send({ message: 'User ID required', error: 'Must provide a user id' });
    }
    await dbHandler.upsertUser({ userId, clinicalRecords, bloodPressure, heartRate, audioLevel });
    res.status(201).send({result: 'Done'});
  } catch (error) {
    res.status(500).send({ message: 'An error occurred', error: error.message });
  }
});

router.post('/location-data', async (req, res) => {
  try {
    const { latitude, longitude, altitude, accuracy, userId } = req.body;
    if (!latitude || !longitude) {
      res.status(400).send({ message: `Invalid values. Latitude: ${latitude}, Longitude: ${longitude}`, error: 'Latitude and longitude required.' });
    }
    const timeStamp = Date.now();
    await dbHandler.insertLocationData({ latitude, longitude, altitude, accuracy, userId, timeStamp });
    res.status(201).send({result: 'Done'});
  } catch (error) {
    res.status(500).send({ message: 'An error occurred', error: error.message });
  }
});

export default router;
