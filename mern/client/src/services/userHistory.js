export const getUserHistories = async () => {
  const response = await fetch('/api/user-history');
  if (!response.ok) {
    const message = `An error has occurred: ${response.statusText}`;
    console.error(message);
    return;
  }
  const userHistories = await response.json();
  return userHistories;
};

/**
 * Send userHistory to be stored in our database
 * @param {userHistory} userHistory
 */
export const postUserHistory = async (userHistory) => {
  // Call the API here
  console.log(userHistory, 'here is the userhistory');
  //now returning  Id: 108434384124793200000 favorites: [Object] (1)
  const userHistoryString = JSON.stringify(userHistory);
  console.log('here is the stringified version', userHistoryString);
  const response = await fetch('/api/user-history', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: userHistoryString,
  });
  if (!response) {
    throw new Error('No response received ');
  }
  const data = await response.json();
  console.log('here is the response', data);
  if (!response.ok) {
    throw new Error(data.error);
  }
  return data; 
};

export class UserHistory {
  /**
   * @param {int} userHistory.userId
   * @param {array} userHistory.favorites
   * @param {array} userHistory.searchHistory
   */
  constructor(userId, favorites, searchHistory) {
    this.userId = userId;
    this.favorites = favorites;
    this.searchHistory = searchHistory;
  }
}
