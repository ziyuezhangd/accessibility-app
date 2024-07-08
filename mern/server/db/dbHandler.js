import getDB from './connection.js';

const dbHandler = {
  /**
   * @param {{
   * name: string, 
   * email: string, 
   * comment: string, 
   * age: int, 
   * gender: string, 
   * conditions: string, 
   * coordinates: [number, number], 
   * date: Date
   * }} feedback
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