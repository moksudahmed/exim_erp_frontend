import React, { useState, useEffect } from "react";
import styles from "./Payments.module.css";
import { FaSort, FaDownload, FaEye, FaTrashAlt } from "react-icons/fa";
import { saveAs } from "file-saver";
import axios from "axios";

const PaymentDashboard = ({ payments = [], onDeletePayment, token }) => {
  const [filters, setFilters] = useState({ search: "", minAmount: "", maxAmount: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: "id", direction: "asc" });
  const paymentsPerPage = 20;

  useEffect(() => setCurrentPage(1), [filters]);

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const filteredPayments = payments
    .filter((payment) => {
      const matchesSearch = !filters.search || payment.id.toString().includes(filters.search);
      const matchesMin = !filters.minAmount || payment.amount >= parseFloat(filters.minAmount);
      const matchesMax = !filters.maxAmount || payment.amount <= parseFloat(filters.maxAmount);
      return matchesSearch && matchesMin && matchesMax;
    })
    .sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === "asc" ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

  const indexOfLastPayment = currentPage * paymentsPerPage;
  const indexOfFirstPayment = indexOfLastPayment - paymentsPerPage;
  const currentPayments = filteredPayments.slice(indexOfFirstPayment, indexOfLastPayment);

  const exportToCSV = () => {
    const csvContent = [
      ["Payment ID", "Payer", "Receiver", "Amount", "Method", "Date"].join(","),
      ...filteredPayments.map(
        (p) =>
          `${p.id},${p.payer || "N/A"},${p.receiver || "N/A"},${p.amount},${p.payment_method},${new Date(p.date).toLocaleDateString()}`
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "payments_data.csv");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this payment?")) return;

    try {
      const response = await axios.delete(`http://127.0.0.1:8000/api/v1/payments/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200 || response.status === 204) {
        alert("Payment deleted successfully!");
        onDeletePayment(id);
      } else {
        throw new Error(`Failed to delete payment. Status: ${response.status}`);
      }
    } catch (error) {
      alert(`Error: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div className={styles.paymentsContainer}>
      <h2 className={styles.title}>Payments Dashboard</h2>

      <div className={styles.filters}>
        <input
          type="text"
          placeholder="Search by ID"
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        />
        <input
          type="number"
          placeholder="Min Amount"
          value={filters.minAmount}
          onChange={(e) => setFilters({ ...filters, minAmount: e.target.value })}
        />
        <input
          type="number"
          placeholder="Max Amount"
          value={filters.maxAmount}
          onChange={(e) => setFilters({ ...filters, maxAmount: e.target.value })}
        />
        <button onClick={exportToCSV}>
          <FaDownload /> Export CSV
        </button>
      </div>

      <table className={styles.paymentsTable}>
        <thead>
          <tr>
            <th onClick={() => handleSort("id")}>ID <FaSort /></th>
            <th onClick={() => handleSort("payer")}>Payer <FaSort /></th>
            <th onClick={() => handleSort("receiver")}>Receiver <FaSort /></th>
            <th onClick={() => handleSort("amount")}>Amount <FaSort /></th>
            <th>Method</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentPayments.map((payment) => (
            <tr key={payment.id}>
              <td>{payment.id}</td>
              <td>{payment.payer}</td>
              <td>{payment.receiver}</td>
              <td>${payment.amount.toFixed(2)}</td>
              <td>{payment.payment_method}</td>
              <td>{new Date(payment.date).toLocaleDateString()}</td>
              <td>
                <button onClick={() => alert(JSON.stringify(payment, null, 2))}><FaEye /></button>
                <button onClick={() => handleDelete(payment.id)}><FaTrashAlt /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination can be added here if needed */}
    </div>
  );
};

export default PaymentDashboard;
