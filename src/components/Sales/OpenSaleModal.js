import React from "react";
import styles from "./styles/OpenSaleModal.module.css";
import { FaTimes } from "react-icons/fa";

const OpenSaleModal = ({ sale, products, onClose }) => {
  if (!sale) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2>Sale Details - ID: {sale.id}</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className={styles.saleInfo}>
          <p><strong>Customer:</strong> {sale.customer_name || "N/A"}</p>
          <p><strong>Total Amount:</strong> ${sale.total.toFixed(2)}</p>
          <p><strong>Discount:</strong> ${sale.discount.toFixed(2)}</p>
          <p><strong>Date:</strong> {new Date(sale.created_at).toLocaleDateString()}</p>
        </div>

        <h3>Items</h3>
        <table className={styles.saleTable}>
          <thead>
            <tr>
              <th>Product</th>
              <th>Quantity</th>
              <th>Unit Price</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {sale.sale_products.map((item, index) => {
              const product = products.find((p) => p.id === item.product_id);
              return (
                <tr key={index}>
                  <td>{product ? product.title : "Unknown Product"}</td>
                  <td>{item.quantity}</td>
                  <td>${item.price_per_unit.toFixed(2)}</td>
                  <td>${(item.quantity * item.price_per_unit).toFixed(2)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OpenSaleModal;
