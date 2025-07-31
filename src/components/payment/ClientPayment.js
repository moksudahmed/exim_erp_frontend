import React, { useState, useEffect, useRef } from 'react';
import './CustomerPayments.css';
import { fetchCustomerClientsPayment } from '../../api/client';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const ClientPayments = ({ clients, token }) => {
  const [selectedClientId, setSelectedClientId] = useState('');
  const [clientPayments, setClientPayments] = useState([]);
  const [clientInfo, setClientInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const statementRef = useRef(null);

  const fetchClientPaymentData = async (clientId) => {
    try {
      setIsLoading(true);
      
      if (!clientId) {
        setClientPayments([]);
        setClientInfo(null);
        return;
      }

      const paymentData = await fetchCustomerClientsPayment(clientId, token);
      setClientPayments(paymentData);

      if (paymentData.length > 0) {
        const { first_name, last_name, title, client_type } = paymentData[0];
        setClientInfo({
          name: `${title ? `${title} ` : ''}${first_name} ${last_name}`,
          clientType: client_type,
        });
      } else {
        setClientInfo(null);
      }
    } catch (error) {
      console.error('Failed to fetch payment data:', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedClientId) {
      fetchClientPaymentData(selectedClientId);
    }
  }, [selectedClientId]);

  // Calculate financial summaries
  const totalDebit = clientPayments
    .filter(payment => payment.amount > 0)
    .reduce((sum, payment) => sum + payment.amount, 0);

  const totalCredit = Math.abs(clientPayments
    .filter(payment => payment.amount < 0)
    .reduce((sum, payment) => sum + payment.amount, 0));

  const currentBalance = totalDebit - totalCredit;

  const exportToPDF = async () => {
    const statementElement = statementRef.current;
    const canvas = await html2canvas(statementElement, { scale: 2, useCORS: true });
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgData = canvas.toDataURL('image/png');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${clientInfo?.name.replace(/\s+/g, '_') || 'Client'}_Statement.pdf`);
  };

  const formatCurrency = (amount) => {
    return `${amount.toLocaleString('en-US')} ৳`;
  };

  return (
    <div className="payment-statement-container">
      <header className="statement-header">
        <h2 className="statement-title">Client Payment Statement</h2>
        <div className="controls-section">
          <div className="client-selector">
            <label htmlFor="clientSelect">Select Client:</label>
            <select
              id="clientSelect"
              value={selectedClientId}
              onChange={(e) => setSelectedClientId(e.target.value)}
              className="select-input"
            >
              <option value="">-- Select Client --</option>
              {clients.map(client => (
                <option key={client.client_id} value={client.client_id}>
                  {client.first_name} {client.last_name}
                </option>
              ))}
            </select>
          </div>

          <button 
            onClick={exportToPDF} 
            className="export-button"
            disabled={!clientInfo}
            title="Export to PDF"
          >
            <i className="icon-pdf"></i> Export PDF
          </button>
        </div>
      </header>

      {clientInfo && (
        <section className="client-info-card">
          <h3>Client Information</h3>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Name:</span>
              <span className="info-value">{clientInfo.name}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Client Type:</span>
              <span className="info-value">{clientInfo.clientType}</span>
            </div>
          </div>
        </section>
      )}

      <div ref={statementRef} className="statement-content">
        {isLoading ? (
          <div className="loading-indicator">
            <div className="spinner"></div>
            <p>Loading payment records...</p>
          </div>
        ) : (
          <table className="financial-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Payment Method</th>
                <th className="text-right">Debit</th>
                <th className="text-right">Credit</th>
                <th className="text-right">Balance</th>
              </tr>
            </thead>
            <tbody>
              {clientPayments.length > 0 ? (
                clientPayments.map((transaction, index) => {
                  const debit = transaction.amount > 0 ? transaction.amount : 0;
                  const credit = transaction.amount < 0 ? Math.abs(transaction.amount) : 0;
                  const balance = debit - credit;

                  return (
                    <tr key={`transaction-${index}`}>
                      <td>{new Date(transaction.payment_date).toLocaleDateString()}</td>
                      <td>{transaction.payment_method}</td>
                      <td className="text-right debit-amount">
                        {debit > 0 ? formatCurrency(debit) : '-'}
                      </td>
                      <td className="text-right credit-amount">
                        {credit > 0 ? formatCurrency(credit) : '-'}
                      </td>
                      <td className="text-right balance-amount">
                        {formatCurrency(balance)}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5" className="no-records">
                    {selectedClientId ? 'No payment records found' : 'Select a client to view payment history'}
                  </td>
                </tr>
              )}
            </tbody>
            <tfoot>
              <tr className="summary-row">
                <td colSpan="2">Totals</td>
                <td className="text-right total-debit">{formatCurrency(totalDebit)}</td>
                <td className="text-right total-credit">{formatCurrency(totalCredit)}</td>
                <td className="text-right net-balance">{formatCurrency(currentBalance)}</td>
              </tr>
            </tfoot>
          </table>
        )}
      </div>
    </div>
  );
};

export default ClientPayments;