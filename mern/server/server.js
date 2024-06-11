import path from 'path';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import logger from './logger.js';
import accessibilityHighlightPlace from './routes/accessibilityHighlightPlace.js';
import busynessRating from './routes/busynessRating.js';
import feedback from './routes/feedback.js';
import noiseRating from './routes/noiseRating.js';
import odourRating from './routes/odourRating.js';
import placeInfosRouter from './routes/place-infos.js';
import records from './routes/record.js';
//npm install body-parser
import soundRating from './routes/soundRating.js';
//import reports from "./routes/report.js"

// Load environment variabls
dotenv.config();

const PORT = process.env.PORT || 5050;
const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(express.json());
app.use('/record', records);
app.use('/place-infos', placeInfosRouter);
app.use('/busyness-ratings', busynessRating);
app.use('/noise-ratings', noiseRating);
app.use('/odour-ratings', odourRating);
app.use('/accessibility-highlight-place', accessibilityHighlightPlace);

app.use('/feedback', feedback);
app.use('/sound-ratings', soundRating);

const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, '..', 'client', 'dist')));

// Configure logger for HTTP request
const morganStream = {
  write: (message) => {
    logger.http(message.trim());
  }
};
app.use(morgan('dev', { stream: morganStream }));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'client', 'dist', 'index.html'));
});

// start the Express server
app.listen(PORT, () => {
  logger.info(`Server listening on port ${PORT}`);
});