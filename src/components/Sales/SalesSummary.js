// SalesSummary.js
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './styles/SalesSummary.css';

const SalesSummary = ({ sales }) => {
  const [totalSales, setTotalSales] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [avgTransactionValue, setAvgTransactionValue] = useState(0);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [filteredSales, setFilteredSales] = useState(sales);

  useEffect(() => {
    const filterSales = () => {
      let filtered = sales;
      if (startDate && endDate) {
        filtered = sales.filter(sale => {
          const saleDate = new Date(sale.created_at);
          return saleDate >= new Date(startDate) && saleDate <= new Date(endDate);
        });
      }
      setFilteredSales(filtered);
    };

    filterSales();
  }, [sales, startDate, endDate]);

  useEffect(() => {
    const calculateMetrics = () => {
      const totalRev = filteredSales.reduce((acc, sale) => acc + sale.total, 0);
      setTotalRevenue(totalRev);
      setTotalSales(filteredSales.length);
      setAvgTransactionValue(filteredSales.length ? (totalRev / filteredSales.length).toFixed(2) : 0);
    };

    calculateMetrics();
  }, [filteredSales]);

  return (
    <div className="sales-summary-container">
      <h2 className="section-title">Sales Summary</h2>
      <div className="filters">
        <label htmlFor="start-date">Start Date:</label>
        <input
          id="start-date"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <label htmlFor="end-date">End Date:</label>
        <input
          id="end-date"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>
      <div className="summary-metrics">
        <div className="metric">
          <h3>Total Sales</h3>
          <p>{totalSales}</p>
        </div>
        <div className="metric">
          <h3>Total Revenue</h3>
          <p>${totalRevenue.toFixed(2)}</p>
        </div>
        <div className="metric">
          <h3>Average Transaction Value</h3>
          <p>${avgTransactionValue}</p>
        </div>
      </div>
      <div className="sales-count">
        <p><strong>{filteredSales.length}</strong> sale(s) matched your filter criteria.</p>
      </div>
    </div>
  );
};

SalesSummary.propTypes = {
  sales: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.string.isRequired,
      amount: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default SalesSummary;
