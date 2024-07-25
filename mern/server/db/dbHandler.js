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
  async insertFeedback(feedback) {
    if (feedback.coordinates) {
      const db = await getDB();
      const collection = db.collection('feedback');
      await collection.insertOne(feedback);
    } else {
      throw new Error('Coordinates is required');
    }
  },

  async upsertUser(userData) {
    const { userId } = userData;
    const existingUser = await this.getUser(userId);
    let updatedUser = existingUser;
    if (existingUser) {
      // Get the existing historical data
      const { clinical_records, bloodPressureOverTime, heartRateOverTime, audioLevelOverTime } = existingUser;
      updatedUser = {
        clinical_records: [...clinical_records, ...userData.clinical_records],
        bloodPressureOverTime: [...bloodPressureOverTime, ...userData.bloodPressureOverTime],
        heartRateOverTime: [...heartRateOverTime, ...userData.heartRateOverTime],
        audioLevelOverTime: [...audioLevelOverTime, ...userData.audioLevelOverTime],
      };
    }
    updatedUser.lastUpdated = new Date();
    const db = await getDB();
    const collection = db.collection('users');
    await collection.update({ userId }, updatedUser, { upsert: true, w: 1 });
  },

  async createUser(userData) {
    const db = await getDB();
    const collection = db.collection('users');
    await collection.insertOne(userData);
  },

  async getUser(userId) {
    const db = await getDB();
    const collection = db.collection('users');
    const res = await collection.find({ userId }).toArray();
    if (res.length === 0) {
      return null;
    }
    return res[0];
  },

  async insertLocationData(locationData) {
    const db = await getDB();
    const collection = db.collection('locationTracking');
    await collection.insertOne(locationData);
  },

  /**
   * @returns {Promise<Array>}
   */
  async getAccessibilityHighlightPlaces() {
    const db = await getDB();
    const collection = db.collection('accessibilityHighlightPlace');
    const results = await collection.find({}).toArray();

    return results;
  },

  /**
   * @param {string} userHistory.name
   * @param {string} userHistory.email
   * @param {array} userHistory.favorites
   */

  async getUserHistories(userId){
    const db = await getDB();
    const collection = db.collection('userHistory');
    try {
      const results = await collection.find({ userId }).toArray();
      return results;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching user histories:', error);
      throw error;
    }
  },

  async insertSearchHistory(userHistory){
    // eslint-disable-next-line no-console
    console.log('insertSearchHistory called');
  
    const db = await getDB();
    const userId = userHistory.userId;
    const collection = db.collection('users');

    try {
      const user = await collection.findOne({ userId });

      if (user) {
        await collection.updateOne(
          { userId },
          { $set: { searchHistory: userHistory.searchHistory } }
        );
      } else {
        await collection.insertOne(userHistory);
      }
      // eslint-disable-next-line no-console
      console.log('Inserted Search History');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error inserting searchHistory:', error);
    }
  },
  
  async insertFavorites(userHistory){
    // eslint-disable-next-line no-console
    console.log('insertFavorites called');
  
    const db = await getDB();
    const userId = userHistory.userId;
    const collection = db.collection('users');

    try {
      const user = await collection.findOne({ userId });

      if (user) {
        await collection.updateOne(
          { userId },
          { $set: { favorites: userHistory.favorites } }
        );
      } else {
        await collection.insertOne(userHistory);
      }
      // eslint-disable-next-line no-console
      console.log('Favorites inserted ');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error inserting favorites:', error);
    }
  },
};
    
export default dbHandler;
