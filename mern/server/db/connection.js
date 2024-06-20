import dotenv from 'dotenv';
import { MongoClient, ServerApiVersion } from 'mongodb';
import logger from '../logger.js';

// Load environment variables
dotenv.config();
// Note: somehow this script is executed even before server.js, so I have to load environment variables here
// When we fix this issue, we can delete this and have environment variables loaded within our entry file server.js

const uri = process.env.ATLAS_URI || '';
let db;

if (!process.env.NO_DB) {
  logger.info(`Connecting to db: ${uri}`);
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });

  try {
    // Connect the client to the server
    logger.info('Connecting...');
    await client.connect();
    // Send a ping to confirm a successful connection
    logger.info('Pinging...');
    await client.db('admin').command({ ping: 1 });
    logger.info('Pinged your deployment. You successfully connected to MongoDB!');
  } catch (err) {
    logger.error(`${err}`);
  }

  db = client.db('practicumAppDB');
} else {
  logger.info('Running without database connection');
  db = null;
}

export default db;
