import getDB from './connection.js';

const dbHandler = {
  /**
   * @param {object} feedback
   * @param {string} feedback.name
   * @param {string} feedback.email
   * @param {string} feedback.comment
   * @param {Date} feedback.date
   * @param {[number, number]} feedback.coordinates 
   */
  async insertFeedback(feedback){
    if (feedback.coordinates){
      const db = await getDB();
      const collection = db.collection('feedback');
      await collection.insertOne(feedback);
    } else {
      throw new Error('Coordinates is required');
    }
  },
  
  /**
   * @returns {Promise<Array>}
   */
  async getAccessibilityHighlightPlaces(){
    const db = await getDB();
    const collection = db.collection('accessibilityHighlightPlace');
    const results = await collection.find({}).toArray();

    return results;
  }
};

export default dbHandler;