import https from 'https';
import dotenv from 'dotenv';
import express from 'express';

dotenv.config();

const ACCESSIBILITY_CLOUD_API_KEY = process.env.ACCESSIBILITY_CLOUD_API_KEY;
const placeInfosRouter = express.Router();
const tiles = [
  { z: 14, x: 4825, y: 6160 },
  { z: 14, x: 4824, y: 6160 },
  { z: 14, x: 4823, y: 6160 },
  { z: 14, x: 4825, y: 6159 },
  { z: 14, x: 4824, y: 6159 },
  { z: 14, x: 4823, y: 6159 },
  { z: 14, x: 4825, y: 6158 },
  { z: 14, x: 4824, y: 6158 },
  { z: 14, x: 4823, y: 6158 },
  { z: 14, x: 4826, y: 6157 },
  { z: 14, x: 4825, y: 6157 },
  { z: 14, x: 4824, y: 6157 },
  { z: 14, x: 4823, y: 6157 },
  { z: 14, x: 4826, y: 6156 },
  { z: 14, x: 4825, y: 6156 },
  { z: 14, x: 4824, y: 6156 },
  { z: 14, x: 4827, y: 6155 },
  { z: 14, x: 4826, y: 6155 },
  { z: 14, x: 4825, y: 6155 },
  { z: 14, x: 4824, y: 6155 },
  { z: 14, x: 4827, y: 6154 },
  { z: 14, x: 4826, y: 6154 },
  { z: 14, x: 4825, y: 6154 },
  { z: 14, x: 4827, y: 6153 },
  { z: 14, x: 4826, y: 6153 },
  { z: 14, x: 4825, y: 6153 },
  { z: 14, x: 4827, y: 6152 },
  { z: 14, x: 4826, y: 6152 },
  { z: 14, x: 4827, y: 6151 },
  { z: 14, x: 4826, y: 6151 },
  { z: 14, x: 4828, y: 6150 },
  { z: 14, x: 4827, y: 6150 },
];

const makeRequest = ({ x, y, z }) => {
  return new Promise((resolve, reject) => {
    const queryString = `?appToken=${ACCESSIBILITY_CLOUD_API_KEY}&z=${z}&x=${x}&y=${y}&filter=fully-accessible-by-wheelchair&exclude=properties.infoPageUrl,properties.parentCategoryIds`;
    const options = {
      hostname: 'accessibility-cloud-v2.freetls.fastly.net',
      path: `/place-infos.json${queryString}`,
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    };

    const request = https.request(options, (response) => {
      let data = '';

      response.on('data', (chunk) => {
        data += chunk;
      });

      response.on('end', () => {
        if (
          response.headers['content-type'] &&
          response.headers['content-type'].includes('application/json')
        ) {
          try {
            resolve(JSON.parse(data));
          } catch (error) {
            reject(new Error('Error parsing JSON: ' + error.message));
          }
        } else {
          reject(new Error('Received non-JSON response'));
        }
      });
    });

    request.on('error', (error) => {
      reject(new Error('Request error: ' + error.message));
    });

    request.end();
  });
};

placeInfosRouter.get('/', async (req, res) => {
  try {
    const results = await Promise.all(tiles.map((tile) => makeRequest(tile)));
    const combinedResults = results.flat();
    res.status(200).json(combinedResults);
  } catch (error) {
    console.error('Error fetching data:', error);
    res
      .status(500)
      .send({ message: 'An error occurred', error: error.message });
  }
});


placeInfosRouter.get("/googleMapsLocation", async (req, res) => {
  //const {lat, long } = req.query;
  const lat = 40.7057752;
  const long = -74.0028376;
  const accuracy = 1;

  if (!lat || !long) {
    return res.status(400).send({ message: "The latitude and longitude parameters are required" });
  }  
    //not specifically filtering for 'fully' accessible here
  const queryString = `?appToken=${ACCESSIBILITY_CLOUD_API_KEY}&latitude=${lat}&longitude=${long}&accuracy=${accuracy}&exclude=properties.infoPageUrl,properties.parentCategoryIds`;;
  const options = {
    hostname: 'accessibility-cloud-v2.freetls.fastly.net',
    path: `/place-infos.json${queryString}`,
    method: 'GET',
    headers: {
      'Accept': 'application/json'
    }
  };

  try {
    const data = await new Promise((resolve, reject) => {
      const request = https.request(options, (response) => {
        let data = '';

        response.on('data', (chunk) => {
          data += chunk;
        });

        response.on('end', () => {
          if (response.headers['content-type'] && response.headers['content-type'].includes('application/json')) {
            try {
              resolve(JSON.parse(data));
            } catch (error) {
              reject(new Error('Error parsing JSON: ' + error.message));
            }
          } else {
            reject(new Error('Received non-JSON response'));
          }
        });
      });

      request.on('error', (error) => {
        reject(new Error('Request error: ' + error.message));
      });

      request.end();
    });

    res.status(200).send(data);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});


  

export default placeInfosRouter;
