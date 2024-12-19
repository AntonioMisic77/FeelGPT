import React, { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance"; // Import axiosInstance
import MoodCalendar from "./MoodCalendar"; // Import MoodCalendar
const MoodTracker = () => {
  // State variables for loading, error, and data
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState({});

  const emotions = [
    { name: "Anger", color: "#E74C3C" }, // Warm red
    { name: "Disgust", color: "#F39C12" }, // Muted yellow-orange
    { name: "Fear", color: "#8E44AD" }, // Deep purple
    { name: "Happiness", color: "#F1C40F" }, // Bright golden yellow
    { name: "Sadness", color: "#3498DB" }, // Soft blue
    { name: "Surprise", color: "#2ECC71" }, // Fresh green
    { name: "Neutral", color: "lightblue" }, // Soft gray
    { name: "No data", color: "lightgray" }, // Soft gray
  ];


  useEffect(() => {
    const fetchEmotionsData = async () => {
      try {
        setLoading(true);

        const today = new Date().toISOString().split("T")[0];

        // Uncomment when connecting to the backend
        const response = await axiosInstance.get("/conversation/chat/emotionsInAYear", {
          params: {
            date: today,
          },
        });
        const fetchedData = response.data.result;
        
        console.log("fetchedData:", fetchedData)

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


        // Dummy data for testing
        /* const formattedData = {
          "2024-12-17": [
            [0, 0, 0, 0, 0, 0, 2], // Emotion probabilities at a given time
            [0, 0, 0, 4, 0, 0, 0],
            [0, 0, 0, 0, 2, 0, 0],
            [1, 0, 0, 0, 1, 0, 0],
            [1, 0, 0, 0, 1, 0, 0],
            [0, 0, 0, 4, 2, 0, 0],
          ],
          "2024-12-18": [
            [0, 1, 0, 0, 0, 2, 0],
            [1, 0, 0, 1, 0, 0, 0],
            [0, 0, 2, 0, 0, 0, 1],
            [1, 1, 0, 0, 0, 0, 0],
            [0, 0, 0, 2, 2, 0, 0],
          ],
          "2024-12-19": [
            [0, 0, 0, 1, 0, 0, 2],
            [0, 0, 1, 0, 0, 0, 0],
            [0, 2, 0, 0, 1, 0, 0],
            [0, 0, 0, 0, 1, 1, 0],
            [0, 0, 1, 1, 0, 0, 0],
          ],
          "2024-11-17": [
            [0, 0, 0, 0, 0, 0, 2], // Emotion probabilities at a given time
            [0, 0, 0, 4, 0, 0, 0],
            [0, 0, 0, 0, 2, 0, 0],
            [1, 0, 0, 0, 1, 0, 0],
            [1, 0, 0, 0, 1, 0, 0],
            [0, 0, 0, 4, 2, 0, 0],
          ],
          "2024-11-18": [
            [0, 1, 0, 0, 0, 2, 0],
            [1, 0, 0, 1, 0, 0, 0],
            [0, 0, 2, 0, 0, 0, 1],
            [1, 1, 0, 0, 0, 0, 0],
            [0, 0, 0, 2, 2, 0, 0],
          ],
          "2024-12-20": [
            [0, 0, 0, 1, 0, 0, 2],
            [0, 0, 1, 0, 0, 0, 0],
            [0, 2, 0, 0, 1, 0, 0],
            [0, 0, 0, 0, 1, 1, 0],
            [0, 0, 1, 1, 0, 0, 0],
          ],

        }; */

        /* setData(formattedData);
        console.log("Formatted Data:", formattedData); */
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
    <div className="mood-container">
      <div>
      <MoodCalendar data={data} />
      </div>
      {/* Legend Section */}
      <div>
      <div style={{ margin: "20px" }}>
        <h3>Emotion Legend:</h3>
        <ul style={{ listStyle: "none", padding: 0, display: "flex", flexWrap: "wrap" , width: "10vw" }}>
          {emotions.map((emotion, index) => (
            <li
              key={index}
              style={{
                display: "flex",
                alignItems: "center",
                margin: "5px 10px",
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  width: "20px",
                  height: "20px",
                  backgroundColor: emotion.color,
                  marginRight: "10px",
                  borderRadius: "4px",
                }}
              ></span>
              {emotion.name}
            </li>
          ))}
        </ul>
      </div>

    </div>
    </div>
  );
};

export default MoodTracker;
