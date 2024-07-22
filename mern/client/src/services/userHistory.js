export const getUserHistories = async (email) => {
  try {
    const response = await fetch(`/api/user-history?email=${encodeURIComponent(email)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      const message = `error${response.statusText}`;
      console.error(message);
      return;
    }
    const userHistories = await response.json();
    return userHistories;
  } catch (error) {
    console.error('GET failed', error);
  }
};

/**
 * Send userHistory to be stored in our database
 * @param {userHistory} userHistory
 */
export const postUserHistory = async (userHistory) => {
  // Call the API here
  const userHistoryString = JSON.stringify(userHistory);
  
  console.log(userHistoryString);

  try {
    const response = await fetch('/api/user-history', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: userHistoryString,
    });

    if (!response) {
      throw new Error('No response received from the server');
    }

    console.log('Response status:', response.status, response.statusText);

    const data = await response.json();

    if (!response.ok) {
      console.error('Response not OK:', data);
      throw new Error(data.error || 'Something went wrong with the fetch request');
    }

    console.log('Response data:', data);
    return data;
  } catch (error) {
    console.error('Error in postUserHistory:', error);

    if (error.name === 'TypeError') {
      throw new Error('Network error or CORS issue');
    } else {
      throw error;
    }
  }
};

export class UserHistory {
  /**
   * @param {string} userHistory.name
   * @param {string} userHistory.email
   * @param {array} userHistory.favorites
   */
  constructor(name, email, favorites) {
    this.name = name;
    this.email = email;
    this.favorites = favorites;
  }
}
