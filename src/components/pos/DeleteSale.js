import React, { useState } from "react";
import styles from "./styles/Sales.module.css";

const DeleteSale = ({ sales, onDeleteSale }) => {
  const [saleToDelete, setSaleToDelete] = useState(null);

  const handleDeleteClick = (saleId) => {
    setSaleToDelete(saleId);
  };

  const confirmDelete = () => {
    if (saleToDelete !== null) {
      console.log(`Deleting sale with ID: ${saleToDelete}`);
      alert(`Sale with ID ${saleToDelete} has been deleted.`);
      onDeleteSale(saleToDelete); // Call the actual delete function
      setSaleToDelete(null);
    }
  };

  return (
    <div>
      <table className={styles.salesTable}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Total</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sales.map((sale) => (
            <tr key={sale.id}>
              <td>{sale.id}</td>
              <td>${sale.total.toFixed(2)}</td>
              <td>
                <button className={styles.deleteBtn} onClick={() => handleDeleteClick(sale.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {saleToDelete !== null && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete this sale?</p>
            <div className={styles.modalActions}>
              <button className={styles.cancelBtn} onClick={() => setSaleToDelete(null)}>Cancel</button>
              <button className={styles.confirmDeleteBtn} onClick={confirmDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeleteSale;
