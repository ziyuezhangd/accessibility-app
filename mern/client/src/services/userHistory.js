export const getUserHistories = async () => {
  const response = await fetch('/api/userHistory');
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
  //right now this is only returning first and last name
  console.log(userHistory);
  const response = await fetch('/api/userHistory', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userHistory),
    
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error);
  }
  return data; 
};

export class UserHistory {
  /**
   * @param {string} userHistory.name
   * @param {string} userHistory.email
   * @param {array} userHistory.favorites
   * @param {array} userHistory.searchHistory
   */
  constructor(name, email, favorites, searchHistory) {
    this.name = name;
    this.email = email;
    this.favorites = favorites;
    this.searchHistory = searchHistory;
  }
}
