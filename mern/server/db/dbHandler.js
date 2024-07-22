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
      const { clinicalRecords, bloodPressureOverTime, heartRateOverTime, audioLevelOverTime } = existingUser;
      updatedUser['clinicalRecords'] = clinicalRecords ? userData.clinicalRecords.concat(clinicalRecords) : userData.clinicalRecords;
      updatedUser['bloodPressureOverTime'] = bloodPressureOverTime ? userData.bloodPressure.concat(bloodPressureOverTime) : userData.bloodPressure;
      updatedUser['heartRateOverTime'] = heartRateOverTime ? userData.heartRate.concat(heartRateOverTime) : userData.heartRate;
      updatedUser['audioLevelOverTime'] = audioLevelOverTime ? userData.audioLevel.concat(audioLevelOverTime) : userData.audioLevel;
    } else {
      updatedUser = {};
      updatedUser['clinicalRecords'] = userData.clinicalRecords;
      updatedUser['bloodPressureOverTime'] = userData.bloodPressure;
      updatedUser['heartRateOverTime'] = userData.heartRate;
      updatedUser['audioLevelOverTime'] = userData.audioLevel;
    }
    updatedUser['lastUpdated'] = new Date();
    const db = await getDB();
    const collection = db.collection('users');
    // await collection.find({ userId }).upsert().updateOne({ $set: updatedUser });
    await collection.updateOne({ userId }, { $set: updatedUser }, { upsert: true });
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

  async getPlaceInfos() {
    const db = await getDB();
    const collection = db.collection('placeInfos');
    const results = await collection.find({}).toArray();

    return results;
  }
};

export default dbHandler;
