export const retryFetch = async (url, maxRetries = 3, retryDelay = 1000) => {
  let attempts = 0;
  while (attempts < maxRetries) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        const message = `An error has occurred: ${response.statusText}`;
        throw new Error(message);
      }
      const data = await response.json();
      return data;
    } catch(error) {
      attempts += 1;
      console.error(error.message);
      if (attempts < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, retryDelay));
      } else {
        console.error(`Max retries reached. Failed to fetch data from ${url}`);
        return;
      }
    }
  }
};