import React, { useEffect, useState } from 'react';
import { fetchAllClientsStatement } from '../../api/client';
import './AllClientStatements.css';

const AllClientStatements = ({ token }) => {
  const [statements, setStatements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchStatement();
  }, []);

  const fetchStatement = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetchAllClientsStatement(token);
      setStatements(response || []);
    } catch (error) {
      console.error('Failed to fetch statements:', error);
      setError('Failed to load client statements. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return `৳ ${Number(amount).toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`;
  };

  const getSummary = () => {
    let totalDue = 0;
    let totalPaid = 0;
    let totalOutstanding = 0;

    statements.forEach(({ total_due, total_paid, outstanding_due }) => {
      totalDue += parseFloat(total_due);
      totalPaid += parseFloat(total_paid);
      totalOutstanding += parseFloat(outstanding_due);
    });

    return { totalDue, totalPaid, totalOutstanding };
  };

  const { totalDue, totalPaid, totalOutstanding } = getSummary();

  const filteredStatements = statements.filter(statement => 
    statement.client_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="financial-dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Client Financial Statements</h1>
          <p>Comprehensive overview of client balances and transactions</p>
        </div>
        
        <div className="dashboard-controls">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search clients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <i className="search-icon">🔍</i>
          </div>
          
          <button onClick={fetchStatement} className="refresh-button">
            <i className="refresh-icon">🔄</i> Refresh Data
          </button>
        </div>
      </div>

      {error && (
        <div className="error-alert">
          <i className="error-icon">⚠️</i> {error}
        </div>
      )}

      <div className="financial-summary-cards">
        <div className="summary-card">
          <div className="card-content">
            <div className="card-icon total-due">₹</div>
            <div>
              <div className="card-label">Total Due</div>
              <div className="card-value">{formatCurrency(totalDue)}</div>
            </div>
          </div>
        </div>
        
        <div className="summary-card">
          <div className="card-content">
            <div className="card-icon total-paid">✓</div>
            <div>
              <div className="card-label">Total Paid</div>
              <div className="card-value">{formatCurrency(totalPaid)}</div>
            </div>
          </div>
        </div>
        
        <div className="summary-card">
          <div className="card-content">
            <div className="card-icon outstanding">!</div>
            <div>
              <div className="card-label">Outstanding</div>
              <div className="card-value">{formatCurrency(totalOutstanding)}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="statement-container">
        {isLoading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading client statements...</p>
          </div>
        ) : filteredStatements.length === 0 ? (
          <div className="no-results">
            <i className="no-data-icon">📭</i>
            <h3>No client statements found</h3>
            <p>Try adjusting your search or refresh the data</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="financial-table">
              <thead>
                <tr>
                  <th className="client-column">Client</th>
                  <th>Total Due</th>
                  <th>Total Paid</th>
                  <th>Outstanding Due</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredStatements.map((statement, index) => (
                  <tr key={index}>
                    <td className="client-cell">
                      <div className="client-name">{statement.client_name}</div>
                    </td>
                    <td className={statement.total_due > 0 ? 'amount due' : 'amount'}>
                      {formatCurrency(statement.total_due)}
                    </td>
                    <td className="amount paid">{formatCurrency(statement.total_paid)}</td>
                    <td className={statement.outstanding_due > 0 ? 'amount outstanding' : 'amount'}>
                      {formatCurrency(statement.outstanding_due)}
                    </td>
                    <td>
                      <span className={`status-badge ${
                        parseFloat(statement.outstanding_due) === 0 
                          ? 'paid' 
                          : parseFloat(statement.outstanding_due) > 0 
                            ? 'pending' 
                            : 'credit'
                      }`}>
                        {parseFloat(statement.outstanding_due) === 0 
                          ? 'Paid' 
                          : parseFloat(statement.outstanding_due) > 0 
                            ? 'Pending' 
                            : 'Credit'
                        }
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!isLoading && filteredStatements.length > 0 && (
          <div className="table-footer">
            <div className="summary-row">
              <div className="summary-label">TOTAL</div>
              <div className="summary-value">{formatCurrency(totalDue)}</div>
              <div className="summary-value">{formatCurrency(totalPaid)}</div>
              <div className="summary-value">{formatCurrency(totalOutstanding)}</div>
              <div className="summary-value">
                <span className="status-badge summary">
                  {filteredStatements.length} clients
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllClientStatements;