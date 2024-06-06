import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import records from "./routes/record.js";
import path from "path";
//import blockRatings from "./routes/blockRating.js"
//import models from "./routes/modelRoute.js"
//import reports from "./routes/report.js"
//import pointsOfInterst from "./routes/pointOfInterest.js"
import logger from "./logger.js";

// Load environment variabls
dotenv.config();
const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());
app.use("/record", records);
//app.use("/blockRating", blockRatings);
//app.use("/modelRoute", models);
//app.use("/report", reports);
//app.use("/pointOfInterest", pointsOfInterst)

const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, "..", "client", "dist")));

const morganStream = {
  write: (message) => {
    // Pass Morgan log messages to Winston
    logger.http(message.trim());
  }
};
app.use(morgan('dev', { stream: morganStream }));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "client", "dist", "index.html"));
});


// start the Express server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});