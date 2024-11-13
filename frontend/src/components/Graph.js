// src/components/Graph.js
import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement } from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

/* PROBLEMS and TASKS
  -> see what kind of data could be interesting to show
  -> emotions from last month??
  -> in what shape, maybe some kind of mood tracker
  -> if multiple, turn to scroll container*/
const Graph = () => {
  const data = {
    labels: ['Mon', 'Tue', 'Wed', 'Thr', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'User Activity',
        data: [1, 4, 3, 6, 0, 0],
        borderColor: '#0a6bff',
        backgroundColor: 'rgba(10, 107, 255, 0.2)',
        borderWidth: 2,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: { beginAtZero: true,
        min: 0,           // Minimum value for Y-axis
      max: 7,         // Maximum value for Y-axis
      ticks: {
        stepSize: 1,   // Set step size for ticks
      },
       },
    }
  };

  return (
    
    <div style={{ width: '500px', height: '300px', padding: '10px' }}>
      <h2>Graph (done after history)</h2>
      <Line data={data} options={options} />
    </div>
  );
};

export default Graph;
