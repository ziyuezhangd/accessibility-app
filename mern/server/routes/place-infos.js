import express from 'express';
import https from 'https';
import dotenv from 'dotenv';


dotenv.config();
const ACCESSIBILITY_CLOUD_API_KEY = process.env.ACCESSIBILITY_CLOUD_API_KEY;

const placeInfosRouter = express.Router();
  
placeInfosRouter.get("/", (req, res) => {
  const apiUrl = 'https://accessibility-cloud-v2.freetls.fastly.net';

  const lat = 40.7831;
  const lon = -73.9712;
  const acc = 100;
  const queryString = `?appToken=${ACCESSIBILITY_CLOUD_API_KEY}&latitude=${lat}&longitude=${lon}&accuracy=${acc}&filter=fully-accessible-by-wheelchair`;

  const options = {
    hostname: apiUrl.replace('https://', ''),
    path: `/place-infos.json${queryString}`,
    method: 'GET',
    headers: {
      'Accept': 'application/json'
    }
  };
  
  const request = https.request(options, (response) => {
    let data = '';
  
    response.on('data', (chunk) => {
      data += chunk;
    });
  
    response.on('end', () => {
      // Check if response is JSON or another types
      if (response.headers['content-type'] && response.headers['content-type'].includes('application/json')) {
        try {
          res.json(JSON.parse(data));
        } catch (error) {
          console.error('Error parsing JSON:', error);
          res.status(500).send('Error parsing JSON response');
        }
      } else {
        console.error('Received non-JSON response:', data);
        res.status(500).send('Received non-JSON response');
        console.log(data)
      }
    });
  });
  request.end(); 
});
  

export default placeInfosRouter;