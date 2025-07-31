import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register required Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const CashFlowChart = () => {
  const data = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    datasets: [
      {
        label: 'Cash Inflow',
        data: [5000, 7000, 4000, 6000, 8000, 9000],
        borderColor: 'green',
        fill: false,
      },
      {
        label: 'Cash Outflow',
        data: [2000, 3000, 1000, 4000, 2000, 5000],
        borderColor: 'red',
        fill: false,
      },
    ],
  };

  return (
    <div>
      <Line data={data} />
    </div>
  );
};

export default CashFlowChart;
