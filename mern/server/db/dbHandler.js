import db from './connection.js';
import logger from '../logger.js';

const dbHandler = {
  db: db,

  /**
     * @param {string} modelName
     * @returns {Promise<Array<string>>} 
     */
  async getLatestModel(modelName) {
    const collection = db.collection(modelName);
    const latestModel = await collection.findOne({}, { sort: { date: -1 } });

    return latestModel;
  },

  /**
     * @param {object} feedback
     * @param {string} feedback.name
     * @param {string} feedback.email
     * @param {string} feedback.comment
     * @param {Date} feedback.date
     * @param {[number, number]} feedback.coordinates
     * @returns {Promise<Array<string>>} 
     */
  async insertFeedback(feedback){
    try {
      const collection = db.collection('feedback');
      await collection.insertOne(feedback);

    } catch(error) {
      logger.error(error.stack);

    }
  }
};

export default dbHandler;