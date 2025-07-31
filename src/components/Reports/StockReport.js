import React from 'react';
import styles from '../Reports/styles/Reports.module.css';

const StockReport = ({ products }) => {
  const totalStockValue = products.reduce((acc, product) => acc + (product.unitPrice * product.stock), 0).toFixed(2);
  const formattedProducts = products.map(product => ({
    ...product,
    unitPrice: product.price_per_unit !== undefined && product.price_per_unit !== null ? product.price_per_unit : 0,
  }));
  return (
    <div className={styles.reportContainer}>
      <h3>Stock Report</h3>
      <p>Total Stock Value: ${totalStockValue}</p>
      <table className={styles.reportTable}>
        <thead>
          <tr>
            <th>Product</th>
            <th>Stock</th>
            <th>Unit Price</th>
            <th>Total Value</th>
          </tr>
        </thead>
        <tbody>
          {formattedProducts.map((product) => (
            <tr key={product.id}>
              <td>{product.title}</td>
              <td>{product.stock}</td>
              <td>
                {/* Ensure unitPrice is defined before calling toFixed */}
                {product.price_per_unit !== undefined && product.price_per_unit !== null
                  ? `$${product.price_per_unit.toFixed(2)}`
                  : 'N/A'}
              </td>
              <td>${(product.price_per_unit * product.stock).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StockReport;
