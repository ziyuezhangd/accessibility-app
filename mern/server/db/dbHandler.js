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
  },

  /**
   * @param {string} userHistory.email
   * @param {array} userHistory.favourites
   * @param {array} userHistory.searchHistory
   */

  async getUserData(){
    const db = await getDB();
    const collection = db.collection('userHistory');
    const results = await collection.find({}).toArray();

    return results;
  },

  async insertUserHistory(userHistory){
    const db = await getDB();
    const collection = db.collection('userHistory');
    //if the user is in the db, update that entry, else insert new entry
    if (collection.find({email: userHistory.email})) {
      const user = db.users.find({email:userHistory.email})
      await collection.update(user);
    } else await collection.insertOne(userHistory);
  },

  async insertSearchHistory(userHistory){
    const db = await getDB();
    const collection = db.collection('userHistory');
    if (collection.find({email: userHistory.email})) {
      await collection.update(userHistory.searchHistory);
    }else {
      await collection.insertOne(userHistory.searchHistory);
    }
  },
  
  async insertFavorites(userHistory){
    const db = await getDB();
    const collection = db.collection('userHistory');
    if (collection.find({email: userHistory.email})) {
      await collection.insertOne(userHistory.favorites);
    }
    else {
      await collection.insertOne(userHistory.favorites);
    }
  },

};

export default dbHandler;