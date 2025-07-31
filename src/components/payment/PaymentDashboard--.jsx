import React, { useEffect, useState } from "react";
import axios from "axios";
import './PaymentDashboard.css'; // optional if using CSS module

const PaymentDashboard = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://127.0.0.1:8000/api/v1/payments/");
      setPayments(res.data);
    } catch (err) {
      console.error("Error loading payments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const getTotalAmount = (method = null) =>
    payments
      .filter((p) => (method ? p.payment_method === method : true))
      .reduce((acc, curr) => acc + parseFloat(curr.amount), 0);

  return (
    <div className="payment-dashboard">
      <h2 className="dashboard-title">Payment Overview</h2>
      <p className="dashboard-subtitle">Track and summarize all received payments</p>

      <div className="summary-cards">
        <SummaryCard title="Total Payments" amount={getTotalAmount()} />
        <SummaryCard title="Cash Payments" amount={getTotalAmount("Cash")} />
        <SummaryCard title="Bank Payments" amount={getTotalAmount("Bank")} />
        <SummaryCard title="Others" amount={getTotalAmount("Other")} />
      </div>

      <div className="table-container">
        <h3 className="table-heading">Recent Payments</h3>
        {loading ? (
          <p>Loading payments...</p>
        ) : (
          <table className="payment-table">
            <thead>
              <tr>
                <th>Reference</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment.id}>
                  <td>{payment.reference_number}</td>
                  <td>৳ {parseFloat(payment.amount).toFixed(2)}</td>
                  <td>{payment.payment_method}</td>
                  <td>{new Date(payment.payment_date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

const SummaryCard = ({ title, amount }) => (
  <div className="summary-card">
    <h4>{title}</h4>
    <p>৳ {amount.toFixed(2)}</p>
  </div>
);

export default PaymentDashboard;
