import express from 'express';
import https from 'https';
import dotenv from 'dotenv';


dotenv.config();
const ACCESSIBILITY_CLOUD_API_KEY = process.env.ACCESSIBILITY_CLOUD_API_KEY;

const router = express.Router();

router.get("/", (req, res) => {
  const apiUrl = 'https://accessibility-cloud-v2.freetls.fastly.net';

  const lat = 40.7831;
  const lon = -73.9712;
  const radius = 2.3;
  const queryString = `/place-infos?lat=${lat}&lon=${lon}&radius=${radius}`;

  const options = {
    hostname: apiUrl.replace('https://', ''),
    path: queryString,
    method: 'GET',
    headers: {
      Authorization: `Bearer ${ACCESSIBILITY_CLOUD_API_KEY}`,
    },
  };

  const request = https.request(options, (response) => {
    let data = '';

    response.on('data', (chunk) => {
      data += chunk;
    });

    response.on('end', () => {
      res.json(JSON.parse(data));
    });
  });

  request.on('error', (error) => {
    console.error(error);
    res.status(500).send('Error retrieving data from the Accessibility Cloud');
  });

  request.end();
});

export default router;