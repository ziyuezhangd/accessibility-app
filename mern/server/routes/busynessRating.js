import express from "express";
import db from "../db/connection.js";


const router = express.Router();



router.get("/busyness-ratings", async (req, res) => {
    const { datetime } = req.query;
    try{
        let collection = db.collection("busynessModel");
        let latestModel = await collection.find().sort({ date: -1 }).limit(1).toArray();
        //this assumes a method called 'predict'
        const predictions = latestModel.predict(datetime);

        res.status(200).send(predictions);
    }
    catch{
        res.status(500).send({ message: "An error occurred", error: error.message });
    }
})

export default router;

//this returns the most recent model in the busynessModels table, http://localhost:5050/busynessRating
//router.get("/", async (req, res) => {
   // let results = await collection.find().sort({ date: -1 }).limit(1).toArray();
    //res.send(results).status(200);
 // })