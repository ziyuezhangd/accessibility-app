import https from 'https';
import dotenv from 'dotenv';
import express from 'express';

dotenv.config();

const ACCESSIBILITY_CLOUD_API_KEY = process.env.ACCESSIBILITY_CLOUD_API_KEY;
const placeInfosRouter = express.Router();
const tiles = [
  { z: 15, x: 9650, y: 12320},
  { z: 15, x: 9649, y: 12320},
  { z: 15, x: 9648, y: 12320},
  { z: 16, x: 19296, y: 24642},
  { z: 14, x: 4823, y: 6160 }, 

  { z: 14, x: 4824, y: 6159 }, 
  { z: 14, x: 4823, y: 6159 }, 
  { z: 15, x: 9650, y: 12318 },
  { z: 15, x: 9650, y: 12319 },

  { z: 14, x: 4824, y: 6158 },
  { z: 15, x: 9647, y: 12316 },
  { z: 15, x: 9647, y: 12317 },
  { z: 15, x: 9650, y: 12316 },
  { z: 15, x: 9650, y: 12317},
  { z: 16, x: 19302, y: 24632},

  { z: 14, x: 4824, y: 6157 },
  { z: 14, x: 4825, y: 6157 },
  { z: 15, x: 9647, y: 12314 },
  { z: 15, x: 9647, y: 12315 },
  { z: 16, x: 19304, y: 24630},
  { z: 16, x: 19304, y: 24629},
  { z: 16, x: 19304, y: 24628},
  { z: 16, x: 19305, y: 24628},
  { z: 17, x: 38608, y: 49262},
  { z: 17, x: 38610, y: 49259},
  { z: 17, x: 38610, y: 49258},
  { z: 17, x: 38611, y: 49258},
  { z: 17, x: 38612, y: 49256},
  { z: 18, x: 77224, y: 98514},

  { z: 15, x: 9652, y: 12312},
  { z: 15, x: 9651, y: 12312},
  { z: 15, x: 9651, y: 12313},
  { z: 16, x: 19306, y: 24627},
  { z: 16, x: 19306, y: 24626},
  { z: 16, x: 19307, y: 24626},
  { z: 14, x: 4825, y: 6156 },
  { z: 14, x: 4824, y: 6156 },

  { z: 15, x: 9654, y: 12311},
  { z: 15, x: 9654, y: 12310},
  { z: 15, x: 9655, y: 12310},
  { z: 16, x: 19310, y: 24622},
  { z: 17, x: 38620, y: 49247},
  { z: 17, x: 38620, y: 49246},
  { z: 17, x: 38621, y: 49246},
  { z: 17, x: 38622, y: 49245},
  { z: 17, x: 38622, y: 49244},
  { z: 16, x: 19312, y: 24620},
  { z: 17, x: 38624, y: 49242},
  { z: 14, x: 4826, y: 6155 },
  { z: 14, x: 4825, y: 6155 },
  { z: 15, x: 9649, y: 12311},
  {z: 16, x: 19299, y: 24621},

  { z: 14, x: 4826, y: 6154 },
  { z: 14, x: 4825, y: 6154 },
  { z: 16, x: 19308, y: 24616},
  { z: 16, x: 19308, y: 24617},
  { z: 15, x: 9654, y: 12309},
  { z: 16, x: 19310, y: 24619},
  
  { z: 14, x: 4826, y: 6153 },
  { z: 15, x: 9651, y: 12307},
  { z: 16, x: 19308, y: 24612},
  { z: 16, x: 19308, y: 24613},
  { z: 16, x: 19308, y: 24614},
  { z: 16, x: 19308, y: 24615},

  { z: 16, x: 19308, y: 24611},
  { z: 16, x: 19308, y: 24609},
  {z: 16, x: 19308, y: 24608},
  { z: 16, x: 19309, y: 24608},
  { z: 14, x: 4826, y: 6152 },

  {z: 15, x: 9653, y: 12303},
  { z: 15, x: 9654, y: 12303},
  {z: 16, x: 19310, y: 24606},
  { z: 15, x: 9653, y: 12302},
  { z: 15, x: 9654, y: 12302},
  { z: 15, x: 9655, y: 12302},
  { z: 15, x: 9654, y: 12301},
  { z: 15, x: 9655, y: 12301},
  { z: 16, x: 19312, y: 24603},
  {z: 16, x: 19312, y: 24602},
  { z: 16, x: 19312, y: 24601},
  { z: 16, x: 19311, y: 24601},
  { z: 16, x: 19310, y: 24601},
  { z: 16, x: 19309, y: 24601},
  { z: 17, x: 38620, y: 49201},
  {z: 17, x: 38621, y: 49201},
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
    res
      .status(500)
      .send({ message: 'An error occurred', error: error.message });
  }
});

export default placeInfosRouter;
