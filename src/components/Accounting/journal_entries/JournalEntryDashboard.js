import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import '../styles/JournalEntryDashboard.css';

// Register necessary components for Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const JournalEntryDashboard = ({ token }) => {
  const [summary, setSummary] = useState({
    ASSET: 0,
    LIABILITY: 0,
    EQUITY: 0,
    REVENUE: 0,
    EXPENSE: 0,
  });
  const apiUrl = process.env.REACT_APP_API_URL;
  const API_URL = `${apiUrl}api/v1/general-ledger`;

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await axios.get(`${API_URL}/ledger-summary/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Initialize a new summary object
        const newSummary = {
          ASSET: 0,
          LIABILITY: 0,
          EQUITY: 0,
          REVENUE: 0,
          EXPENSE: 0,
        };

        // Populate the newSummary with data from the API response
        response.data.ledger_entries.forEach((entry) => {
          const { account_type, sum } = entry;
          if (newSummary.hasOwnProperty(account_type)) {
            newSummary[account_type] = sum;
          }
        });

        setSummary(newSummary);
      } catch (error) {
        console.error('Error fetching summary:', error);
      }
    };

    fetchSummary();
  }, [token]);

  const data = {
    labels: ['Assets', 'Liabilities', 'Equity', 'Revenue', 'Expenses'],
    datasets: [
      {
        label: 'Account Summary',
        data: [summary.ASSET, summary.LIABILITY, summary.EQUITY, summary.REVENUE, summary.EXPENSE],
        backgroundColor: [
          'rgba(75, 192, 192, 0.2)',
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(153, 102, 255, 0.2)',
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'General Ledger Account Summary',
      },
    },
  };

  return (
    <div className="ledger-dashboard-container">
      <h2>General Ledger Summary</h2>
      <div className="ledger-dashboard-summary">
        {Object.entries(summary).map(([key, value]) => (
          <div key={key} className="summary-item">
            <h3>{key.charAt(0).toUpperCase() + key.slice(1).toLowerCase()}</h3>
            <p>{value}</p>
          </div>
        ))}
      </div>
      <div className="ledger-chart">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default JournalEntryDashboard;
