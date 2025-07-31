import React, { useState } from 'react';
import style from './styles/Inventory.module.css';

const Inventory = ({
  products = [],
  inventoryLogs = [],
  setInventoryLogs,
  onUpdateStock, 
  onDeductDamaged,
  onAddInventory,
}) => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [actionType, setActionType] = useState('');
  const [quantity, setQuantity] = useState(0);

  // Handle product change from the dropdown
  const handleProductChange = (e) => {
    const productId = e.target.value;
    const product = products.find((p) => p.title === productId);
    setSelectedProduct(product);
  };

  // Handle action type change from the dropdown
  const handleActionChange = (e) => {
    setActionType(e.target.value);
  };

  // Handle quantity input change
  const handleQuantityChange = (e) => {
    setQuantity(parseInt(e.target.value, 10));
  };

  // Handle submit action for adding inventory or marking as damaged
  const handleSubmit = async () => {
    if (!selectedProduct || !actionType || quantity <= 0) {
      alert('Please fill out all fields');
      return;
    }

    if (actionType === 'DAMAGED') {           
      handleDeductDamaged(selectedProduct.id, quantity);
    } else {
      try {
        const logData = {
          product_id: selectedProduct.id,
          action_type: actionType,
          quantity: quantity,
        };

        const response = await onAddInventory(logData);
        setInventoryLogs([...inventoryLogs, response]);
        alert('Inventory updated successfully');
      } catch (error) {
        console.error('Error updating inventory:', error);
        alert('Failed to update inventory');
      }
    }
  };

  // Deduct damaged quantity from stock and log the action
  const handleDeductDamaged = async (productId, quantity) => {
    if (!productId || quantity <= 0) {
      alert('Please select a valid product and enter a valid quantity.');
      return;
    }

    try {
      const product = products.find((p) => p.id === productId);
     
      if (!product) {
        alert('Product not found');
        return;
      }
      
      if (quantity > product.stock) {
        alert('Insufficient stock to deduct this quantity.');
        return;
      }

      const logData = {
        product_id: productId,
        action_type: 'DAMAGED',
        quantity: quantity,
      };

      const response = await onDeductDamaged(logData);

      if (response.status === 200) {
        const updatedProducts = products.map((p) =>
          p.id === productId ? { ...p, stock: p.stock - quantity } : p
        );

        setInventoryLogs([...inventoryLogs, response.data]);

        if (onUpdateStock) {
          onUpdateStock(updatedProducts);
        }

        alert(`Successfully deducted ${quantity} damaged items from ${product.title}`);
      }
    } catch (error) {
      console.error('Error deducting damaged stock:', error);
      alert('Failed to deduct damaged stock. Please try again.');
    }
  };

  return (
    <div className={style.inventory_container}>
      <h2 className={style.inventory_title}>Inventory Management</h2>

      <div className={style.product_list}>
        <h3 className={style.section_title}>Product List</h3>
        <table className={style.product_table}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Unit Price</th>
              <th>Stock</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map((product) => (
                <tr key={product.title}>
                  <td>{product.title}</td>
                  <td>${product.price_per_unit}</td>
                  <td>{product.stock}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className={style.no_products}>
                  No products available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className={style.inventory_actions}>
        <h3 className={style.section_title}>Inventory Actions</h3>
        <select className={style.dropdown} onChange={handleProductChange}>
          <option value="">Select Product</option>
          {products.length > 0 ? (
            products.map((product) => (
              <option key={product.title} value={product.title}>
                {product.title}
              </option>
            ))
          ) : (
            <option disabled>No products available</option>
          )}
        </select>

        <select className={style.dropdown} onChange={handleActionChange}>
          <option value="">Select Action</option>
          <option value="ADD">Add Stock</option>
          <option value="DEDUCT">Deduct Stock</option>
          <option value="DAMAGED">Mark as Damaged</option>
        </select>

        <input
          type="number"
          className={style.input_quantity}
          value={quantity}
          onChange={handleQuantityChange}
          placeholder="Quantity"
        />

        <button className={style.submit_btn} onClick={handleSubmit}>
          Submit
        </button>
      </div>

      <div className={style.inventory_logs}>
        <h3 className={style.section_title}>Inventory Logs</h3>
        <table className={style.log_table}>
          <thead>
            <tr>
              <th>Product</th>
              <th>Action</th>
              <th>Quantity</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {inventoryLogs.length > 0 ? (
              inventoryLogs.map((log) => (
                <tr key={log.id}>
                  <td>{products.find((p) => p.id === log.product_id)?.title}</td>
                  <td>{log.action_type}</td>
                  <td>{log.quantity}</td>
                  <td>{new Date(log.created_at).toLocaleString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className={style.no_logs}>
                  No logs available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Inventory;
