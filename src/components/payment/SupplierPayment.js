import React, { useState, useEffect, useRef } from 'react';
import './CustomerPayments.css';
import { fetchCustomerSupplierPayment } from '../../api/client';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const SupplierPayment = ({ clients, token }) => {
  const [selectedClientId, setSelectedClientId] = useState('');
  const [clientPayments, setClientPayments] = useState([]);
  const [clientInfo, setClientInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const statementRef = useRef(null);

  const fetchData = async (clientId) => {
    try {
      setLoading(true);
      if (!clientId) {
        setClientPayments([]);
        setClientInfo(null);
        return;
      }

      const data = await fetchCustomerSupplierPayment(clientId, token);
      setClientPayments(data);

      // Extract basic info from the first record
      if (data.length > 0) {
        const { first_name, last_name, title, client_type } = data[0];
        setClientInfo({
          name: `${title ? title + ' ' : ''}${first_name} ${last_name}`,
          client_type,
        });
      } else {
        setClientInfo(null);
      }
    } catch (err) {
      console.error('Error fetching client payment data:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(selectedClientId);
  }, [selectedClientId]);

  const totalDebit = clientPayments
    .filter(p => p.amount > 0)
    .reduce((sum, p) => sum + p.amount, 0);

  const totalCredit = clientPayments
    .filter(p => p.amount < 0)
    .reduce((sum, p) => sum + p.amount, 0);

  const balance = totalDebit + totalCredit;

  const handleExportPDF = async () => {
    const input = statementRef.current;
    const canvas = await html2canvas(input, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Client_Statement_${clientInfo?.name || 'Client'}.pdf`);
  };

  return (
    <div className="customer-payments-container">
      <h2>🧾 Client Payment Statement</h2>

      <div className="filter-section">
        <label>Select Client: </label>
        <select
          value={selectedClientId}
          onChange={(e) => setSelectedClientId(e.target.value)}
        >
          <option value="">-- Select Client --</option>
          {clients.map((c) => (
            <option key={c.client_id} value={c.client_id}>
              {c.first_name} {c.last_name}
            </option>
          ))}
        </select>
      </div>

      {clientInfo && (
        <div className="customer-card">
          <h3>Client Info</h3>
          <p><strong>Name:</strong> {clientInfo.name}</p>
          <p><strong>Type:</strong> {clientInfo.client_type}</p>
        </div>
      )}

      <button onClick={handleExportPDF} className="export-btn">Export as PDF</button>

      <div ref={statementRef}>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table className="payment-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Method</th>
                <th>Debit</th>
                <th>Credit</th>
                <th>Balance</th>
              </tr>
            </thead>
            <tbody>
              {clientPayments.length > 0 ? (
                clientPayments.map((entry, index) => {
                  const debit = entry.amount > 0 ? entry.amount : 0;
                  const credit = entry.amount < 0 ? Math.abs(entry.amount) : 0;
                  const rowBalance = debit - credit;

                  return (
                    <tr key={index}>
                      <td>{new Date(entry.payment_date).toLocaleDateString()}</td>
                      <td>{entry.payment_method}</td>
                      <td className="amount-positive">
                        {debit ? `${debit.toLocaleString()} ৳` : ''}
                      </td>
                      <td className="amount-negative">
                        {credit ? `${credit.toLocaleString()} ৳` : ''}
                      </td>
                      <td>{rowBalance.toLocaleString()} ৳</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center' }}>No records found.</td>
                </tr>
              )}
            </tbody>
            <tfoot>
              <tr>
                <th colSpan="2">Total</th>
                <th>{totalDebit.toLocaleString()} ৳</th>
                <th>{Math.abs(totalCredit).toLocaleString()} ৳</th>
                <th>{balance.toLocaleString()} ৳</th>
              </tr>
            </tfoot>
          </table>
        )}
      </div>
    </div>
  );
};

export default SupplierPayment;
