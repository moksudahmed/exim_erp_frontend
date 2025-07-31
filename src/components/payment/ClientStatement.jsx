import React, { useState, useRef } from 'react';
import { fetchClientsStatement } from '../../api/client';
import { jsPDF } from 'jspdf';
import './ClientStatement.css';
import html2canvas from 'html2canvas';

const ClientStatement = ({ clients, token }) => {
  const [selectedClientId, setSelectedClientId] = useState('');
  const [statementData, setStatementData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const statementRef = useRef(null);

  const fetchStatement = async () => {
    if (!selectedClientId) return;
    
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchClientsStatement(selectedClientId, token);
      setStatementData(data);
    } catch (err) {
      console.error('Failed to fetch statement:', err);
      setError('Failed to load statement. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const exportToPDF = async () => {
    const input = statementRef.current;
    const canvas = await html2canvas(input, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${statementData.client_name.replace(/\s+/g, '_')}_Statement.pdf`);
  };

  const formatCurrency = (amount) => {
    return `৳ ${parseFloat(amount).toLocaleString('en-BD', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };

  const formatDate = (dateString) => {
    if (!dateString || dateString === "None") return '—';
    return new Date(dateString).toLocaleDateString('en-BD', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="statement-container">
      <div className="statement-header">
        <h2 className="statement-title">Client Financial Statement</h2>
        <div className="controls-section">
          <div className="client-selector">
            <label htmlFor="clientSelect">Select Client:</label>
            <select
              id="clientSelect"
              value={selectedClientId}
              onChange={(e) => setSelectedClientId(e.target.value)}
              className="select-input"
              disabled={isLoading}
            >
              <option value="">— Select Client —</option>
              {clients.map((client) => (
                <option key={client.client_id} value={client.client_id}>
                  {client.account_name}
                </option>
              ))}
            </select>
          </div>

          <div className="action-buttons">
            <button
              className="generate-btn"
              onClick={fetchStatement}
              disabled={!selectedClientId || isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner"></span> Generating...
                </>
              ) : (
                'Generate Statement'
              )}
            </button>

            {statementData && (
              <button className="export-btn" onClick={exportToPDF}>
                Export as PDF
              </button>
            )}
          </div>
        </div>
      </div>

      {error && <div className="error-alert">{error}</div>}

      {statementData && (
        <div ref={statementRef} className="statement-content">
          <div className="statement-summary">
            <div className="client-header">
              <h3>{statementData.client_name}</h3>
              <div className="statement-date">
                Generated: {new Date().toLocaleDateString()}
              </div>
            </div>
            
            <div className="financial-overview">
              <div className="financial-metric">
                <span className="metric-label">Total Due:</span>
                <span className="metric-value due">
                  {formatCurrency(statementData.total_due)}
                </span>
              </div>
              <div className="financial-metric">
                <span className="metric-label">Total Paid:</span>
                <span className="metric-value paid">
                  {formatCurrency(statementData.total_paid)}
                </span>
              </div>
              <div className="financial-metric">
                <span className="metric-label">Outstanding Due:</span>
                <span className="metric-value outstanding">
                  {formatCurrency(statementData.outstanding_due)}
                </span>
              </div>
            </div>
          </div>

          <div className="statement-table-container">
            <table className="financial-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Account</th>
                  <th>Type</th>
                  <th className="text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {statementData.entries.map((entry, idx) => (
                  <tr key={`entry-${idx}`}>
                    <td>{formatDate(entry.date)}</td>
                    <td>{entry.account}</td>
                    <td>
                      <span className={`type-badge ${entry.debit_credit.toLowerCase()}`}>
                        {entry.debit_credit}
                      </span>
                    </td>
                    <td className="text-right">
                      {formatCurrency(entry.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientStatement;