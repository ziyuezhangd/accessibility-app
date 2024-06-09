import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import records from "./routes/record.js";
import path from "path";
import busynessRating from "./routes/busynessRating.js"
import noiseRating from "./routes/noiseRating.js"
import odourRating from "./routes/odourRating.js"
import soundRating from "./routes/soundRating.js"
//import reports from "./routes/report.js"
import logger from "./logger.js";

// Load environment variabls
dotenv.config();

const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());
app.use("/record", records);
app.use("/busyness-ratings", busynessRating)
app.use("/noise-ratings", noiseRating)
app.use("/odour-ratings", odourRating)
app.use("/sound-ratings", soundRating)
//app.use("/report", reports);


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