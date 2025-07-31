// src/components/sales/PrintSales.js
import React from 'react';

const PrintSales = ({ sale }) => {
  if (!sale) return null;

  return (
    <div style={{ padding: '20px', background: '#fff' }}>
      <h2>Invoice</h2>
      <p><strong>Sale ID:</strong> {sale.id}</p>
      <p><strong>Date:</strong> {new Date(sale.date).toLocaleDateString()}</p>
      <p><strong>Total:</strong> ${sale.total.toFixed(2)}</p>
      {/* Add more sale details as needed */}
    </div>
  );
};

export default PrintSales;
