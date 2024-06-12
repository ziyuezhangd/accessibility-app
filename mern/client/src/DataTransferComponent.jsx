import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DataTransferComponent = () => {
  const [data, setData] = useState(null);
  const googleMapConfig = import.meta.env.VITE_GOOGLEMAP_KEY;

  useEffect(() => {
    // Step 1: Fetch data from the first API
    const fetchDataFromFirstAPI = async () => {
      try {
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data from first API:', error);
      }
    };

    fetchDataFromFirstAPI();
  }, []);

  useEffect(() => {
    // Step 3: Send data to the second API
    const sendDataToSecondAPI = async () => {
      if (data) {
        try {
          await axios.post('f6ef9708102622406d7635768d07ca6b', data);
        } catch (error) {
          console.error('Error sending data to second API:', error);
        }
      }
    };

    sendDataToSecondAPI();
  }, [data]);

  return (
    <div>
      <h1>Data Transfer Component</h1>
      {data ? <p>Data fetched and sent to the second API successfully.</p> : <p>Loading data...</p>}
    </div>
  );
};

export default DataTransferComponent;
