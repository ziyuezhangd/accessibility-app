import express from "express";
import db from "../db/connection.js";

const router = express.Router();
router.post("/", async (req, res) => {
    const { name, email, comment, coordinates } = req.body;
  
    if (!name || !email || !comment || !coordinates) {
      return res.status(400).send({ message: "The following fields are required: name, email, comment. Coordinates are not required." });
    }
  
    try {
      const collection = db.collection("feedback");
  
      const feedback = {
        name,
        email,
        comment,
        coordinates,
        date: new Date()
      };
  
      await collection.insertOne(feedback);
  
      res.status(201).send({ message: "Feedback submitted successfully" });
    } catch (error) {
      res.status(500).send({ message: "An error occurred", error: error.message });
    }
  });
  
  export default router;