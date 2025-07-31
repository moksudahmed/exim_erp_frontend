import React from 'react';
import './styles/LCListTable.css';

const StatusBadge = ({ status }) => {
  if (!status) return null;

  const formattedStatus = status.replace(/_/g, ' ');
  const statusLower = status.toLowerCase();

  const statusClassMap = {
    open: 'badge-open',
    realized: 'badge-realized',
    closed: 'badge-closed',
  };

  const badgeClass = `status-badge ${statusClassMap[statusLower] || 'badge-default'}`;

  return (
    <span className={badgeClass}>
      {formattedStatus.charAt(0).toUpperCase() + formattedStatus.slice(1).toLowerCase()}
    </span>
  );
};

const LCListTable = ({ data = [], isLoading = false }) => {
  return (
    <div className="lc-table-wrapper">
      <div className="lc-table-header">
        <div className="lc-header-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 
              10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
          </svg>
        </div>
        <h2 className="lc-title">Letter of Credit Records</h2>
      </div>

      <div className="lc-table-scroll">
        {isLoading && (
          <div className="lc-loading-bar">
            <div className="bar"></div>
          </div>
        )}

        <table className="lc-table">
          <thead>
            <tr>
              <th>#</th>
              <th>LC Number</th>
              <th>Applicant</th>
              <th>Beneficiary</th>
              <th>Issue Date</th>
              <th>Expiry Date</th>
              <th className="text-right">Amount</th>
              <th>Currency</th>
              <th className="text-center">Status</th>
            </tr>
          </thead>

          <tbody>
            {data.length > 0 ? (
              data.map((entry, index) => (
                <tr key={entry.id || index} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
                  <td>{index + 1}</td>
                  <td className="font-medium">{entry.lc_number || '—'}</td>
                  <td>{entry.applicant || '—'}</td>
                  <td>{entry.beneficiary || '—'}</td>
                  <td>{entry.issue_date ? new Date(entry.issue_date).toLocaleDateString() : '—'}</td>
                  <td>{entry.expiry_date ? new Date(entry.expiry_date).toLocaleDateString() : '—'}</td>
                  <td className="text-right font-semibold">
                    {entry.amount != null
                      ? `$${entry.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
                      : '—'}
                  </td>
                  <td>{entry.currency || '—'}</td>
                  <td className="text-center">
                    <StatusBadge status={entry.status || 'unknown'} />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="no-records">
                  {isLoading ? 'Loading L/C records...' : 'No L/C records found.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LCListTable;
