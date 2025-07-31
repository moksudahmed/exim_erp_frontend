import React, { useEffect, useState } from "react";
import axios from "axios";
import PaymentForm from "./PaymentForm";
import PaymentList from "./PaymentList";

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

  const addPayment = async (paymentData) => {
    try {
      const res = await axios.post("http://127.0.0.1:8000/api/v1/payments/", paymentData);
      setPayments([res.data, ...payments]);
    } catch (err) {
      console.error("Error adding payment:", err);
    }
  };

  const totalAmount = (method) =>
    payments
      .filter((p) => (method ? p.payment_method === method : true))
      .reduce((acc, curr) => acc + parseFloat(curr.amount), 0);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-indigo-700 mb-6">💰 Payment Dashboard</h1>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <SummaryCard title="Cash" amount={totalAmount("cash")} />
        <SummaryCard title="Bank" amount={totalAmount("bank")} />
        <SummaryCard title="Total" amount={totalAmount()} />
      </div>

      {/* Add Payment */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">➕ Add Payment</h2>
        <PaymentForm onSubmit={addPayment} />
      </div>

      {/* Payment List */}
      <div>
        <h2 className="text-xl font-semibold mb-2">📋 Payment List</h2>
        <PaymentList payments={payments} loading={loading} />
      </div>
    </div>
  );
};

const SummaryCard = ({ title, amount }) => (
  <div className="bg-white border rounded-lg shadow p-4">
    <h3 className="text-sm text-gray-500">{title}</h3>
    <p className="text-xl font-bold text-indigo-600">Tk {amount.toFixed(2)}</p>
  </div>
);

export default PaymentDashboard;
