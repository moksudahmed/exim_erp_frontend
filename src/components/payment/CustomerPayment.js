import React, { useState, useEffect, useRef } from 'react';
import './CustomerPayments.css';
import { fetchCustomerPaymentInfo, fetchCustomerRecord } from '../../api/customer';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const CustomerPayments = ({ customers, token }) => {
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [customerPayments, setCustomerPayments] = useState([]);
  const [customerRecord, setCustomerRecord] = useState(null);
  const [loading, setLoading] = useState(false);
  const statementRef = useRef(null);

  const fetchData = async (customerId = '') => {
    try {
      setLoading(true);
      if (customerId) {
        const [payments, record] = await Promise.all([
          fetchCustomerPaymentInfo(token, customerId),
          fetchCustomerRecord(token, customerId),
        ]);
        setCustomerPayments(payments);
        setCustomerRecord(record);
      } else {
        const payments = await fetchCustomerPaymentInfo(token, '');
        setCustomerPayments(payments);
        setCustomerRecord(null);
      }
    } catch (error) {
      console.error('Error loading data:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(selectedCustomerId);
  }, [selectedCustomerId]);

  const totalDebit = customerPayments
    .filter(entry => entry.amount > 0)
    .reduce((sum, entry) => sum + entry.amount, 0);

  const totalCredit = customerPayments
    .filter(entry => entry.amount < 0)
    .reduce((sum, entry) => sum + entry.amount, 0);

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
    pdf.save(`Customer_Statement_${customerRecord?.name || 'All'}.pdf`);
  };

  return (
    <div className="customer-payments-container">
      <h2>Customer Payment Statement</h2>

      <div className="filter-section">
        <label>Select Customer: </label>
        <select
          value={selectedCustomerId}
          onChange={(e) => setSelectedCustomerId(e.target.value)}
        >
          <option value="">-- All Customers --</option>
          {customers.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {customerRecord && (
        <div className="customer-card">
          <h3>Customer Info</h3>
          <p><strong>Name:</strong> {customerRecord.name}</p>
          <p><strong>Contact:</strong> {customerRecord.contact_info}</p>
          {customerRecord.address && (
            <p><strong>Address:</strong> {customerRecord.address}</p>
          )}
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
              {customerPayments.length > 0 ? (
                customerPayments.map((entry, index) => {
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

export default CustomerPayments;
