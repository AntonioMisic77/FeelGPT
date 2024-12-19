import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import "chart.js/auto"; // Import auto Chart.js registration

const Histogram = ({ data }) => {
  const [timeframe, setTimeframe] = useState("today");
  const [chartData, setChartData] = useState({});

  // Function to format the date as "YYYY-MM-DD"
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Get today's and yesterday's date dynamically
  const today = formatDate(new Date());
  const yesterday = formatDate(new Date(new Date().setDate(new Date().getDate() - 1)));

  // Helper function to combine data for a specific timeframe
  const processData = (timeframe) => {
    const combined = [0, 0, 0, 0, 0, 0, 0]; // 7 emotions initialized to 0

    if (timeframe === "today" && data[today]) {
      data[today].forEach((entry) => {
        entry.forEach((value, index) => (combined[index] += value));
      });
    } else if (timeframe === "yesterday" && data[yesterday]) {
      data[yesterday].forEach((entry) => {
        entry.forEach((value, index) => (combined[index] += value));
      });
    } else if (timeframe === "thisWeek") {
      // Combine data for the current week
      const currentDate = new Date();
      for (let i = 0; i < 7; i++) {
        const day = formatDate(new Date(currentDate.setDate(currentDate.getDate() - i)));
        if (data[day]) {
          data[day].forEach((entry) => {
            entry.forEach((value, index) => (combined[index] += value));
          });
        }
      }
    }

    return combined;
  };

  // Update chart data when timeframe changes
  useEffect(() => {
    const combinedData = processData(timeframe);
    setChartData({
      labels: [
        "Anger",
        "Disgust",
        "Fear",
        "Happines",
        "Sadness",
        "Surprise",
        "Neutral",
      ],
      datasets: [
        {
           label : `Emotion Data for ${timeframe.charAt(0).toUpperCase() + timeframe.slice(1)}`,          data: combinedData,
          backgroundColor: [
            "#E74C3C",
            "#F39C12",
            "#8E44AD",
            "#F1C40F",
            "#3498DB",
            "#2ECC71",
            "lightblue",
          ],
          borderWidth: 1,
        },
      ],
    }
  );
  
  }, [timeframe, data]);

  return (
    <div>
      <h2>Emotion Histogram</h2>

      {/* Buttons to switch timeframes */}
      <div>
        <button className="summary-button" onClick={() => setTimeframe("today")}>Today</button>
        <button className="summary-button" onClick={() => setTimeframe("yesterday")}>Yesterday</button>
        <button className="summary-button" onClick={() => setTimeframe("thisWeek")}>This Week</button>
      </div>

      {/* Bar chart */}
      <div style={{   margin: "auto" }}>
        {chartData.datasets && (
          <Bar data={chartData} options={{ responsive: true }}  style={{width: "40vw", height: "auto"}}/>
        )}
      </div>
    </div>
  );
};

export default Histogram;
