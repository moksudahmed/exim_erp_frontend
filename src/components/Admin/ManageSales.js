import React from 'react';
import styles from './styles/ManageSales.module.css';

const ManageSales = ({ sales }) => {
  return (
    <div className={styles.manageSales}>
      <h2>Manage Sales</h2>
      <table className={styles.salesTable}>
        <thead>
          <tr>
            <th>ID</th>
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
                  <div key={item.id} className={styles.itemDetails}>
                    {item.product} x {item.quantity}
                  </div>
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

export default ManageSales;
