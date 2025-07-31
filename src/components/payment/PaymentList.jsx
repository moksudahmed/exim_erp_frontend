import React, { useState } from "react";

const PaymentList = ({ payments, loading }) => {
  const [filter, setFilter] = useState("all");

  const filtered = filter === "all" ? payments : payments.filter(p => p.payment_method === filter);

  return (
    <div className="bg-white rounded shadow overflow-x-auto">
      <div className="p-3 flex items-center gap-3">
        <label className="text-sm font-medium">Filter:</label>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="input w-40">
          <option value="all">All</option>
          <option value="cash">Cash</option>
          <option value="bank">Bank</option>
        </select>
      </div>
      <table className="min-w-full text-sm">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="p-2">#</th>
            <th className="p-2">Amount</th>
            <th className="p-2">Method</th>
            <th className="p-2">Ref #</th>
            <th className="p-2">Notes</th>
            <th className="p-2">Date</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan="6" className="text-center p-4">Loading...</td></tr>
          ) : filtered.length === 0 ? (
            <tr><td colSpan="6" className="text-center p-4 text-gray-500">No payments found.</td></tr>
          ) : (
            filtered.map((p, i) => (
              <tr key={p.id} className="border-t hover:bg-gray-50">
                <td className="p-2">{i + 1}</td>
                <td className="p-2 text-green-600">Tk {parseFloat(p.amount).toFixed(2)}</td>
                <td className="p-2 capitalize">{p.payment_method}</td>
                <td className="p-2">{p.reference_number || "-"}</td>
                <td className="p-2">{p.notes || "-"}</td>
                <td className="p-2">{new Date(p.payment_date).toLocaleDateString()}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PaymentList;
