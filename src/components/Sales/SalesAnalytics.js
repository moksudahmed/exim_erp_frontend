import React, { useState, useMemo } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "./styles/SalesAnalytics.css";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const SalesAnalytics = ({ sales }) => {
  const [timeFrame, setTimeFrame] = useState("daily");

  // Function to format date based on selected time frame
  const formatDate = (date) => {
    const d = new Date(date);
    if (timeFrame === "daily") return d.toLocaleDateString();
    if (timeFrame === "weekly") return `Week ${getWeekNumber(d)}`;
    if (timeFrame === "monthly") return d.toLocaleString("default", { month: "long", year: "numeric" });
  };

  // Function to get the week number
  const getWeekNumber = (date) => {
    const startOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDays = Math.floor((date - startOfYear) / (24 * 60 * 60 * 1000));
    return Math.ceil((pastDays + startOfYear.getDay() + 1) / 7);
  };

  // Memoized chart data
  const chartData = useMemo(() => {
    const aggregatedSales = sales.reduce((acc, sale) => {
      const label = formatDate(sale.created_at);
      acc[label] = (acc[label] || 0) + sale.total;
      return acc;
    }, {});

    return {
      labels: Object.keys(aggregatedSales),
      datasets: [
        {
          label: "Sales",
          data: Object.values(aggregatedSales),
          backgroundColor: "rgba(75,192,192,0.6)",
          borderRadius: 5,
        },
      ],
    };
  }, [sales, timeFrame]);

  return (
    <div className="sales-analytics-container">
      <h2>Sales Analytics</h2>
      <div className="time-frame-selector">
        <select onChange={(e) => setTimeFrame(e.target.value)} value={timeFrame}>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>
      <div className="chart-container">
        <Bar data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
      </div>
    </div>
  );
};

export default SalesAnalytics;
