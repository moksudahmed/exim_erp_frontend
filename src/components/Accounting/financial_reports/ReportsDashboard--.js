import React, { useState } from 'react';
import './reports.css';
import BalanceSheet from './BalanceSheet';
import IncomeStatement from './IncomeStatement';
import CashFlowStatement from './CashFlowStatement';
import TrialBalance from './TrialBalance';
import GeneralLedger from './GeneralLedger';
import TaxReports from './TaxReports';

const ReportsDashboard = ({ token }) => {
  const [selectedReport, setSelectedReport] = useState('dashboard');
  
  const reports = [
    { key: 'balance-sheet', name: 'Balance Sheet', icon: '📊' },
    { key: 'income-statement', name: 'Income Statement', icon: '💰' },
    { key: 'cash-flow', name: 'Cash Flow Statement', icon: '💵' },
    { key: 'trial-balance', name: 'Trial Balance', icon: '⚖️' },
    { key: 'general-ledger', name: 'General Ledger', icon: '📚' },
    { key: 'tax-reports', name: 'Tax Reports', icon: '🧾' }
  ];

  const renderReport = () => {
    switch (selectedReport) {
      case 'balance-sheet':
        return <BalanceSheet token={token} />;
      case 'income-statement':
        return <IncomeStatement token={token} />;
      case 'cash-flow':
        return <CashFlowStatement token={token} />;
      case 'trial-balance':
        return <TrialBalance token={token} />;
      case 'general-ledger':
        return <GeneralLedger token={token} />;
      case 'tax-reports':
        return <TaxReports token={token} />;
      default:
        return (
          <div className="reports-grid">
            {reports.map(report => (
              <div 
                key={report.key}
                className="report-card"
                onClick={() => setSelectedReport(report.key)}
              >
                <div className="report-icon">{report.icon}</div>
                <h3>{report.name}</h3>
              </div>
            ))}
          </div>
        );
    }
  };

  return (
    <div className="reports-page-container">  
      <div className="reports-page-content">
        {/* Navigation Menu */}
        <nav className="reports-nav">
          <ul>
            <li
              className={selectedReport === 'dashboard' ? 'active' : ''}
              onClick={() => setSelectedReport('dashboard')}
            >
              Reports Dashboard
            </li>
            {reports.map(report => (
              <li
                key={report.key}
                className={selectedReport === report.key ? 'active' : ''}
                onClick={() => setSelectedReport(report.key)}
              >
                {report.name}
              </li>
            ))}
          </ul>
        </nav>        
        {/* Render Selected Report */}
        <section className="reports-section">
          {renderReport()}
        </section>
      </div>
    </div>
  );
};

export default ReportsDashboard;