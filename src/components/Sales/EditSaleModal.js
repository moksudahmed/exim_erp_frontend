import React from "react";
import { FaTimes } from "react-icons/fa";
import styles from "./styles/Sales.module.css";

const EditSaleModal = ({ editingSale, products, handleItemChange, handleSaveClick, setEditingSale }) => {
  if (!editingSale) return null;

  // Function to handle quantity changes and update total_price
  const handleQuantityChange = (index, newQuantity) => {
    if (!editingSale || !editingSale.sale_products) return;

    setEditingSale((prev) => {
      if (!prev || !prev.sale_products) return prev;

      const updatedSaleProducts = prev.sale_products.map((item, i) =>
        i === index
          ? {
              ...item,
              quantity: Math.max(newQuantity, 1), // Ensure quantity is at least 1
              total_price: Math.max(newQuantity, 1) * item.price_per_unit, // Update total_price
            }
          : item
      );

      return { ...prev, sale_products: updatedSaleProducts };
    });
  };

  // Calculate total amount dynamically
  const totalAmount = editingSale.sale_products.reduce((sum, item) => sum + item.total_price, 0);

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modalContent}>
        <h3>Edit Sale #{editingSale.id}</h3>
        <table className={styles.editTable}>
          <thead>
            <tr>
              <th>Product</th>
              <th>Quantity</th>
              <th>Unit Price</th>
              <th>Total Price</th>
            </tr>
          </thead>
          <tbody>
            {editingSale.sale_products.map((item, index) => {
              const product = products.find((p) => p.id === item.product_id);

              return (
                <tr key={item.id}>
                  <td>{product ? product.title : "Unknown Product"}</td>
                  <td>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(index, Number(e.target.value))}
                      min="1"
                      className={styles.quantityInput}
                    />
                  </td>
                  <td>${item.price_per_unit.toFixed(2)}</td>
                  <td>${item.total_price.toFixed(2)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Total Amount Display */}
        <div className={styles.totalAmount}>
          <strong>Total Amount: </strong> ${totalAmount.toFixed(2)}
        </div>

        <div className={styles.modalActions}>
          <button className={styles.saveButton} onClick={handleSaveClick}>
            Save
          </button>
          <button className={styles.cancelButton} onClick={() => setEditingSale(null)}>
            <FaTimes /> Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditSaleModal;
