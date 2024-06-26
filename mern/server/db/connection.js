import dotenv from 'dotenv';
import { MongoClient, ServerApiVersion } from 'mongodb';
import logger from '../logger.js';

dotenv.config();

const uri = process.env.ATLAS_URI || '';
let db = null;

const connectToDB = async() => {
  if (db) return db;

  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });

  try {
    // Connect the client to the server
    logger.info('Connecting to db...');
    await client.connect();
    // Send a ping to confirm a successful connection
    logger.info('Pinging...');
    await client.db('admin').command({ ping: 1 });
    logger.info('Pinged your deployment. You successfully connected to MongoDB!');
    db = client.db('practicumAppDB');
  } catch (error) {
    logger.error(error.stack);
    throw error;
  }

  return db;
};

const getDB = async () => {
  // No-database mode
  if (process.env.NO_DB) return db;

  // Return actual database instance
  if (!db) {
    await connectToDB();
  }
  return db;
};

export default getDB;

// if (!process.env.NO_DB) {
//   logger.info(`Connecting to db: ${uri}`);
//   const client = new MongoClient(uri, {
//     serverApi: {
//       version: ServerApiVersion.v1,
//       strict: true,
//       deprecationErrors: true,
//     },
//   });

//   try {
//     // Connect the client to the server
//     logger.info('Connecting...');
//     await client.connect();
//     // Send a ping to confirm a successful connection
//     logger.info('Pinging...');
//     await client.db('admin').command({ ping: 1 });
//     logger.info('Pinged your deployment. You successfully connected to MongoDB!');
//   } catch (err) {
//     logger.error(`${err}`);
//   }

//   db = client.db('practicumAppDB');
// } else {
//   logger.info('Running without database connection');
//   db = null;
// }