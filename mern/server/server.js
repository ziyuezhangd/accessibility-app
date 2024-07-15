import path from 'path';
import bodyParser from 'body-parser';
import compression from 'compression';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import logger from './logger.js';
import routes from './routes/index.js';

// Load environment variabls
dotenv.config();

const PORT = process.env.PORT || 5050;
const app = express();

app.use(bodyParser.json());
app.use(express.json());
app.use(cors());
app.use(helmet()); // Add security-related HTTP headers
app.use(compression()); // Compress HTTP responses using gzip

// Configure logger for HTTP request
const morganStream = {
  write: (message) => {
    logger.http(message.trim());
  }
};
app.use(morgan('dev', { stream: morganStream }));

app.use(routes);

const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, '..', 'client', 'dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'client', 'dist', 'index.html'));
});

// Error handling
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).send('Internal Server Error: Our team is investigating this issue.');
});

// start the Express server
app.listen(PORT, () => {
  logger.info(`Server listening on port ${PORT}`);
});