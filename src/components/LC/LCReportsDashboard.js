import React, { useEffect, useState } from 'react';
import './LCReportsDashboard.css';

const LCReportsDashboard = ({ token }) => {
  const [reportData, setReportData] = useState([]);

  useEffect(() => {
    fetch('/api/lc/monthly-report', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setReportData(data))
      .catch(err => console.error('Error loading report:', err));
  }, [token]);

  return (
    <div className="lc-dashboard">
      <h2>L/C Monthly Financial Report</h2>
      <table>
        <thead>
          <tr>
            <th>Month</th>
            <th>Total Inventory</th>
            <th>L/C Commission</th>
            <th>Bank Payment</th>
            <th>Supplier Outstanding</th>
          </tr>
        </thead>
        <tbody>
          {reportData.map((row, index) => (
            <tr key={index}>
              <td>{row.month}</td>
              <td>৳ {row.total_inventory}</td>
              <td>৳ {row.total_lc_commission}</td>
              <td>৳ {row.total_bank_payment}</td>
              <td>৳ {row.supplier_outstanding}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LCReportsDashboard;
