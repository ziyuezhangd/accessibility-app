import express from 'express';
import https from 'https';
import dotenv from 'dotenv';


dotenv.config();


const apiUrl = 'https://accessibility-cloud-v2.freetls.fastly.net';
const ACCESSIBILITY_CLOUD_API_KEY = process.env.ACCESSIBILITY_CLOUD_API_KEY;
const placeInfosRouter = express.Router();
const tiles = [
  {z: 14, x: 4825, y: 6160},
  {z: 14, x: 4824, y: 6160},
  {z: 14, x: 4823, y: 6160},
  {z: 14, x: 4825, y: 6159},
  {z: 14, x: 4824, y: 6159},
  {z: 14, x: 4823, y: 6159},
  {z: 14, x: 4825, y: 6158},
  {z: 14, x: 4824, y: 6158},
  {z: 14, x: 4823, y: 6158},
  {z: 14, x: 4826, y: 6157},
  {z: 14, x: 4825, y: 6157},
  {z: 14, x: 4824, y: 6157},
  {z: 14, x: 4823, y: 6157},
  {z: 14, x: 4826, y: 6156},
  {z: 14, x: 4825, y: 6156},
  {z: 14, x: 4824, y: 6156},
  {z: 14, x: 4827, y: 6155},
  {z: 14, x: 4826, y: 6155},
  {z: 14, x: 4825, y: 6155},
  {z: 14, x: 4824, y: 6155},
  {z: 14, x: 4827, y: 6154},
  {z: 14, x: 4826, y: 6154},
  {z: 14, x: 4825, y: 6154},
  {z: 14, x: 4827, y: 6153},
  {z: 14, x: 4826, y: 6153},
  {z: 14, x: 4825, y: 6153},
  {z: 14, x: 4827, y: 6152},
  {z: 14, x: 4826, y: 6152},
  {z: 14, x: 4827, y: 6151},
  {z: 14, x: 4826, y: 6151},
  {z: 14, x: 4828, y: 6150},
  {z: 14, x: 4827, y: 6150}
  

];  

const makeRequest = ({ x, y, z }) => {
    return new Promise((resolve, reject) => {
      const queryString = `?appToken=${ACCESSIBILITY_CLOUD_API_KEY}&z=${z}&x=${x}&y=${y}&filter=fully-accessible-by-wheelchair&exclude=originalId,infoPageUrl,sourceId,sourceImportId,parentCategoryIds`;
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
};


placeInfosRouter.get("/", async (req, res) => {
  try {
    const results = await Promise.all(tiles.map(tile => makeRequest(tile)));
    const combinedResults = results.flat();
    res.status(200).json(combinedResults);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send({ message: "An error occurred", error: error.message });
  }
});

export default placeInfosRouter;

