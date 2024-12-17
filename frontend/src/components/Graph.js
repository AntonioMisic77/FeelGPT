// src/components/Graph.js

import React, { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance"; // Import axiosInstance

const Graph = () => {
  // State variables for loading, error, and data
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState({});

  useEffect(() => {
    const fetchEmotionsData = async () => {
      try {
        setLoading(true);

        // Fetch data from the API
        const response = await axiosInstance.get("/conversation/chat/emotions", {
          params: {
            date: "2024-12-17",
          },
        });

        const fetchedData = response.data.result;

        // Initialize a dictionary to store formatted data
        const formattedData = {};

        // Process each item in the fetched data
        fetchedData.forEach((item) => {
          // Extract the date part from the timestamp
          const date = item.timestamp.split("T")[0];

          // Initialize the key in the dictionary if it doesn't exist
          if (!formattedData[date]) {
            formattedData[date] = [];
          }

          // Push non-empty `emotionsProbabilities` arrays into the corresponding date's list
          if (item.emotionsProbabilities?.length > 0) {
            formattedData[date].push(item.emotionsProbabilities);
          }
        });

        // Update the state with the formatted data
        setData(formattedData);
        console.log("Formatted Data:", formattedData);
      } catch (err) {
        console.error("Error fetching emotions data:", err);
        setError("Failed to load emotions data.");
      } finally {
        setLoading(false);
      }
    };

    fetchEmotionsData();
  }, []);

  return (
    <div>
      <h2>Graph (done after history)</h2>
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && (
        <div>
          <h3>Processed Emotions Data</h3>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default Graph;
