import express from "express";
import cors from "cors";
import records from "./routes/record.js";
import path from "path";
//npm install body-parser
import bodyParser from "body-parser";
import busynessRating from "./routes/busynessRating.js"
import noiseRating from "./routes/noiseRating.js"
import odourRating from "./routes/odourRating.js"
import feedback from "./routes/feedback.js"
import soundRating from "./routes/soundRating.js"



const PORT = process.env.PORT || 5050;
const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(express.json());
app.use("/record", records);
app.use("/busyness-ratings", busynessRating)
app.use("/noise-ratings", noiseRating)
app.use("/odour-ratings", odourRating)
app.use("/feedback", feedback)
app.use("/sound-ratings", soundRating)



const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, "..", "client", "dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "client", "dist", "index.html"));
});

// start the Express server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});