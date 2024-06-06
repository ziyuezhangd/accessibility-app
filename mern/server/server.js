import express from "express";
import cors from "cors";
import records from "./routes/record.js";
import path from "path";
import busynessRating from "./routes/busynessRating.js"
//import blockRatings from "./routes/blockRating.js"
//import models from "./routes/modelRoute.js"
//import reports from "./routes/report.js"
//import pointsOfInterst from "./routes/pointOfInterest.js"

const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());
app.use("/record", records);
app.use("/busynessRating", busynessRating)
//app.use("/blockRating", blockRatings);
//app.use("/modelRoute", models);
//app.use("/report", reports);
//app.use("/pointOfInterest", pointsOfInterst)

const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, "..", "client", "dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "client", "dist", "index.html"));
});

// start the Express server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});