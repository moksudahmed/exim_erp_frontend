import React, { useState } from 'react'; 
import axios from "axios";
import "./styles/ReceiveStock.css";
import { Select } from 'antd';

const { Option } = Select;

const apiUrl = process.env.REACT_APP_API_URL;
const API_URL = `${apiUrl}api/v1/inventory/`;

const ReceiveStock = ({ products, setProducts, receiveItems, warehouse, isAuthenticated, token }) => {
  // Track selection + warehouse per product_id
  const [rowState, setRowState] = useState(() => {
    const initial = {};
    receiveItems.forEach(batch => {
      batch.items.forEach(item => {
        initial[item.product_id] = {
          checked: true,
          warehouse_id: null, // start with no warehouse selected
        };
      });
    });
    return initial;
  });

  // Toggle checkbox per row
  const handleCheckboxChange = (productId) => {
    setRowState(prev => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        checked: !prev[productId].checked,
      }
    }));
  };

  // Select warehouse per row
  const handleWarehouseChange = (productId, warehouseId) => {
    setRowState(prev => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        warehouse_id: warehouseId,
      }
    }));
  };

  // Submit updates
  const handleBulkUpdate = async (event) => {
    event.preventDefault();

    const updates = receiveItems.flatMap(batch =>
      batch.items
        .filter(item => rowState[item.product_id]?.checked)
        .map(item => {
          const product = products.find(p => p.id === item.product_id);
          const whId = rowState[item.product_id]?.warehouse_id;

          if (!product || !whId) return null;

          return {
            product_id: product.id,
            action_type: "ADD",
            quantity: item.quantity,
            warehouse_id: whId, // ✅ per-row warehouse
            user_id: 1, // TODO: replace with real user
            id: batch.id,
          };
        })
        .filter(Boolean)
    );

    if (updates.length === 0) {
      alert("No items selected or warehouses missing.");
      return;
    }

    try {
      await axios.post(`${API_URL}bulk-update`, updates, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Update local state
      setProducts(prevProducts =>
        prevProducts.map(product => {
          const updatedItem = updates.find(u => u.product_id === product.id);
          return updatedItem
            ? { ...product, stock: product.stock + updatedItem.quantity }
            : product;
        })
      );

      alert("Stock updated successfully!");
    } catch (error) {
      console.error("Error updating stock:", error);
      alert("Failed to update stock. Please try again.");
    }
  };

  // Disable submit if any checked row has no warehouse selected
  const isSubmitDisabled = receiveItems.some(batch =>
    batch.items.some(item => {
      const state = rowState[item.product_id];
      return state?.checked && state?.warehouse_id === null;
    })
  );

  return (
    <div className="receive-stock-container">
      <form onSubmit={handleBulkUpdate}>
        <table className="receive-stock-table">
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Quantity</th>
              <th>Cost Per Unit</th>
              <th>Select</th>
              <th>Warehouse</th>
            </tr>
          </thead>
          <tbody>
            {receiveItems.map(batch =>
              batch.items.map(item => {
                const product = products.find(p => p.id === item.product_id);
                const state = rowState[item.product_id] || { checked: false, warehouse_id: null };

                return (
                  <tr key={item.product_id}>
                    <td>{product ? product.title : "Unknown Product"}</td>
                    <td>{item.quantity}</td>
                    <td>{item.cost_per_unit}</td>
                    <td>
                      <input
                        type="checkbox"
                        checked={state.checked}
                        onChange={() => handleCheckboxChange(item.product_id)}
                      />
                    </td>
                    <td>
                      <Select
                        placeholder="Select Warehouse"
                        size="large"
                        allowClear
                        value={state.warehouse_id === null ? undefined : state.warehouse_id} // ✅ strict null check
                        onChange={value => handleWarehouseChange(item.product_id, value)}
                        style={{ width: "100%" }}
                      >
                        {warehouse.map(wh => (
                          <Option key={wh.id} value={wh.id}>
                            {wh.warehouse_name}
                          </Option>
                        ))}
                      </Select>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
        <button
          type="submit"
          className="accept-button"
          disabled={isSubmitDisabled} // ✅ Prevent submit if warehouse missing
        >
          Update Stock for Selected Items
        </button>
      </form>
    </div>
  );
};

export default ReceiveStock;
