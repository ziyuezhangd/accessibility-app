import db from 'connection.js';

const dbHandler = {
    db: db,

    /**
     * @param {string} modelName
     * @returns {Promise<Array<string>>} 
     */
    async getLatestModel(modelName) {

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

    }
};

export default dbHandler;