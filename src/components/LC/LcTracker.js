import React, { useState } from 'react';
import axios from 'axios';
import './styles/LcTracker.css';

const statusOptions = [
  { label: 'All Statuses', value: 'ALL' },
  { label: 'Open', value: 'OPEN' },
  { label: 'Submitted', value: 'SUBMITTED' },
  { label: 'Approved', value: 'APPROVED' },
  { label: 'Issued', value: 'ISSUED' },
  { label: 'Goods Received', value: 'GOODS_RECEIVED' },
  { label: 'Paid (Closed)', value: 'CLOSED' },
];

const LcTracker = ({ lcRecords = [] }) => {
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [error, setError] = useState(null);

  const filteredRecords =
    statusFilter === 'ALL'
      ? lcRecords
      : lcRecords.filter((record) => record.status === statusFilter);

  const handleDownload = async () => {
    try {
      const res = await axios.get('/api/v1/lc-report/monthly', {
        responseType: 'blob',
      });
      const blob = new Blob([res.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = 'lc_monthly_report.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      setError('Failed to download the report.');
    }
  };

  return (
    <div className="lc-tracker-container">
      <header className="lc-header">
        <h2>📦 Letter of Credit (L/C) Tracker</h2>

        <div className="lc-controls">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="lc-select"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <button className="lc-download-btn" onClick={handleDownload}>
            📄 Download Monthly Report
          </button>
        </div>
      </header>

      <section className="chart-section">
        <img
          src="/lc_monthly_report_chart.png"
          alt="L/C Monthly Chart"
          className="lc-chart"
        />
      </section>

      <section className="lc-table-section">
        <table className="lc-table">
          <thead>
            <tr>
              <th>L/C No</th>
              <th>Supplier</th>
              <th>Issue Date</th>
              <th>Beneficiary</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecords.length > 0 ? (
              filteredRecords.map((lc) => (
                <tr key={lc.id}>
                  <td>{lc.lc_number}</td>
                  <td>{lc.supplier_name}</td>
                  <td>{new Date(lc.issue_date).toLocaleDateString()}</td>
                  <td>{lc.beneficiary}</td>
                  <td>৳ {lc.amount.toLocaleString()}</td>
                  <td>
                    <span className={`status-badge status-${lc.status.toLowerCase()}`}>
                      {lc.status.replace('_', ' ')}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="no-records">
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      {error && <p className="lc-error">{error}</p>}
    </div>
  );
};

export default LcTracker;
