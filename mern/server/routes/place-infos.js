import https from 'https';
import axios from 'axios';
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

placeInfosRouter.get('/', async (req, res) => {
  try {
    const results = [];
    for (const tile of tiles) {
      const { x, y, z } = tile;
      const result = await axios.get('https://accessibility-cloud-v2.freetls.fastly.net/place-infos.json', {
        params: {
          appToken: ACCESSIBILITY_CLOUD_API_KEY,
          x,
          y,
          z,
          filter: 'fully-accessible-by-wheelchair'
        },
      });
      results.push(result.data);
    }

    const placeInfos = [];
    for (const result of results) {
      const places = result.features;
      for (const place of places) {
        const { properties } = place;
        const placeInfo = {
          category: properties.category,
          name: properties.name?.en,
          address: properties.address,
          latitude: place.geometry.coordinates[1],
          longitude: place.geometry.coordinates[0],
        };
        placeInfos.push(placeInfo);
      }
    }
    res.status(200).json(placeInfos);
  } catch (error) {
    res.status(500).send({ message: 'Failed to get place infos.', error: error.message });
  }
});

placeInfosRouter.get('/categories', async (req, res) => {
  try {
    const result = await axios.get('https://accessibility-cloud-v2.freetls.fastly.net/categories.json', {
      params: {
        appToken: ACCESSIBILITY_CLOUD_API_KEY,
      },
    });
    const categories = [];
    for (const d of result.data.results) {
      categories.push(d._id);
    }
    res.status(200).send(categories);
  } catch (error) {
    res.status(500).send({ message: 'Failed to get categories.', error: error.message });
  }
});

export default placeInfosRouter;
