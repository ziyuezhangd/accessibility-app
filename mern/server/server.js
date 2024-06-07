import express from "express";
import cors from "cors";
import records from "./routes/record.js";
import placeInfosRouter from './routes/place-infos.js';
import busynessRating from "./routes/busynessRating.js"
import noiseRating from "./routes/noiseRating.js"
import odourRating from "./routes/odourRating.js"
import accessibilityHighlightPlace from "./routes/accessibilityHighlightPlace.js"

const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());
app.use("/record", records);
app.use('/place-infos', placeInfosRouter);
app.use("/busyness-ratings", busynessRating)
app.use("/noise-ratings", noiseRating)
app.use("/odour-ratings", odourRating)
app.use("/accessibility-highlight-place", accessibilityHighlightPlace)


// start the Express server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});