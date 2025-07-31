import React from 'react';
import styles from '../Reports/styles/Reports.module.css';

const SalesReport = ({ sales }) => {
  const totalRevenue = sales.reduce((acc, sale) => acc + sale.total, 0).toFixed(2);
  const totalItemsSold = sales.reduce((acc, sale) => acc + sale.sale_products.reduce((sum, item) => sum + item.quantity, 0), 0);

  return (
    <div className={styles.reportContainer}>
      <h3>Sales Report</h3>
      <p>Total Revenue: ${totalRevenue}</p>
      <p>Total Items Sold: {totalItemsSold}</p>
      <table className={styles.reportTable}>
        <thead>
          <tr>
            <th>Sale ID</th>
            <th>Items</th>
            <th>Total</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {sales.map((sale) => (
            <tr key={sale.id}>
              <td>{sale.id}</td>
              <td>
                {sale.sale_products.map((item) => (
                  <div key={item.id}>{item.product} x {item.quantity}</div>
                ))}
              </td>
              <td>${sale.total.toFixed(2)}</td>
              <td>{new Date(sale.date).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SalesReport;
