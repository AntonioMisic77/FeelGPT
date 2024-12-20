import React, { useState, useEffect } from "react";
import Histogram from "./Histogram";
import axiosInstance from "../api/axiosInstance";

const Graph = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState({});

  useEffect(() => {
    const fetchEmotionsData = async () => {
      try {
        setLoading(true);
        const today = new Date().toISOString().split("T")[0];

        // Fetch data for today
        const response = await axiosInstance.get("/conversation/chat/emotions", {
          params: { date: today },
        });

        const fetchedData = response.data.result;

        const formattedData = {};

        fetchedData.forEach((item) => {
          const date = item.timestamp.split("T")[0];

          if (!formattedData[date]) {
            formattedData[date] = [];
          }

          if (item.emotionsProbabilities?.length > 0) {
            formattedData[date].push(item.emotionsProbabilities);
          }
        });

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
      <Histogram data={data} />
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
    </div>
  );
};

export default Graph;
