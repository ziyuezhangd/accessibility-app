import express from "express";
import db from "../db/connection.js";


const router = express.Router();



router.get("/busyness-ratings", async (req, res) => {
    const { datetime } = req.query;
    if (!datetime) {
        return res.status(400).send({ message: "Datetime parameter is required" });
      }
    
    try{
        let collection = db.collection("busynessModel");
        let latestModel = await collection.findOne({}, { sort: { date: -1 } });

        //this assumes a method called 'predict'
        const predictions = latestModel.predict(datetime);

        res.status(200).send(predictions);
    }
    catch{
        res.status(500).send({ message: "An error occurred", error: error.message });
    }
})


export default router;

