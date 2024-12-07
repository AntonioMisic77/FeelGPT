// src/components/Graph.js
import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import axiosInstance from "../api/axiosInstance"; // Ensure this is correctly configured
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';

// Register necessary Chart.js components
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

// Emotion-to-Color Mapping
const emotionColorMap = {
  happy: '#4CAF50',     // Green
  sad: '#2196F3',       // Blue
  neutral: '#9E9E9E',   // Grey
  excited: '#FF9800',   // Orange
  anxious: '#F44336',   // Red
  joyful: '#FFEB3B',    // Yellow
  tired: '#795548',     // Brown
  // Add more emotions and colors as needed
};

// Toggle Flag: Set to true to use sample data, false to fetch live data
const USE_SAMPLE_DATA = true;

const Graph = () => {
  // State to hold chart data
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [{
      label: 'User Emotions This Week',
      data: [],
      backgroundColor: [],
      borderColor: [],
      borderWidth: 1,
    }],
  });

  // State to manage loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State to hold emotions data for tooltip access
  const [emotionsDataState, setEmotionsDataState] = useState([]);

  // Sample Data for Testing Without Backend
  const sampleData = [
    { day: "Mon", emotion: "happy" },
    { day: "Tue", emotion: "sad" },
    { day: "Wed", emotion: "joyful" },
    { day: "Thu", emotion: "happy" },
    { day: "Fri", emotion: "anxious" },
    { day: "Sat", emotion: "joyful" },
    { day: "Sun", emotion: "tired" }
  ];

  // useEffect to fetch or set data on component mount
  useEffect(() => {
    const fetchEmotionData = async () => {
      if (USE_SAMPLE_DATA) {
        // Use sample data for testing
        // Simulate asynchronous behavior with setTimeout
        setTimeout(() => {
          processEmotionData(sampleData);
        }, 1000); // 1-second delay to simulate loading
      } else {
        // Fetch live data from backend
        try {
          const response = await axiosInstance.get('/api/emotions/week');
          const emotionsData = response.data.data; // Adjust based on your actual response structure
          processEmotionData(emotionsData);
        } catch (err) {
          console.error('Error fetching emotion data:', err);
          setError('Failed to load emotion data.');
          setLoading(false);
        }
      }
    };

    fetchEmotionData();
  }, []);

  // Function to process and set chart data
  const processEmotionData = (emotionsData) => {
    setEmotionsDataState(emotionsData); // Store emotionsData for tooltip access

    const labels = emotionsData.map(item => item.day);

    // Set a fixed value for all data points to ensure uniform bar heights
    const fixedValue = 5; // You can choose any number that fits your y-axis scale
    const data = emotionsData.map(() => fixedValue);

    const backgroundColors = emotionsData.map(item => emotionColorMap[item.emotion.toLowerCase()] || '#000000');
    const borderColors = backgroundColors.map(color => color);

    setChartData({
      labels,
      datasets: [{
        label: 'User Emotions This Week',
        data,
        backgroundColor: backgroundColors,
        borderColor: borderColors,
        borderWidth: 1,
      }],
    });

    setLoading(false);
  };

  // Chart configuration options
  const options = {
    responsive: true, // Disable responsiveness to maintain fixed size
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // Hide legend if not needed
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const index = context.dataIndex;
            const emotion = emotionsDataState[index].emotion;
            return `Emotion: ${emotion.charAt(0).toUpperCase() + emotion.slice(1)}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        min: 0,
        max: 5, // Adjust max to accommodate the fixed value and provide visual space
        ticks: {
          stepSize: 2,
          display: false, // Hide y-axis labels as height is uniform
        },
        grid: {
          display: false, // Hide grid lines for a cleaner look
        },
        title: {
          display: false, // Hide y-axis title
        },
      },
      x: {
        title: {
          display: true,
          text: 'Days of the Week',
        },
        grid: {
          display: false, // Hide grid lines for a cleaner look
        },
      },
    },
  };

  // Conditional rendering based on loading and error states
  if (loading) {
    return (
      <div style={{ width: '600px', height: '400px', padding: '10px' }}>
        <h2>User Emotions This Week</h2>
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ width: '600px', height: '400px', padding: '10px' }}>
        <h2>User Emotions This Week</h2>
        <p>{error}</p>
      </div>
    );
  }

  // Render the Bar chart with the processed data
  return (
    <div style={{ width: '600px', height: '400px', padding: '10px' }}>
      <h2>User Emotions This Week</h2>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default Graph;
