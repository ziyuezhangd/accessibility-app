import { API_HOST } from './utils';

const dummyFeedbacks = [
  {
    name: 'April',
    email: 'april.polubiec@ucdconnect.ie',
    comment: 'This place is no longer open.',
    coordinates: [-73.9712, 40.7831],
  },
  {
    name: 'Ellen',
    email: 'ellen.doherty2@ucdconnect.ie',
    comment: 'This place was not loud at all.',
    coordinates: [-73.9712, 40.7831],
  },
];

export const postFeedback = async (feedback) => {
  // Call the API here
  const response = await fetch(`${API_HOST}/feedback`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(feedback),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error);
  }
};
