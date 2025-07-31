import React, { useEffect, useState } from 'react';
import axios from "axios";
import "./styles/ReceiveStock.css";
import { getReceivedOrder, onCompletePurchaseOrders} from '../../api/purchase';

//const API_URL = "http://127.0.0.1:8000/api/v1/inventory/";

const apiUrl = process.env.REACT_APP_API_URL;
const API_URL = `${apiUrl}api/v1/inventory/`;
const ReceiveStock = ({ products, setProducts, receiveItems, isAuthenticated, token}) => {
  // Initialize state for selected items

    
  const [selectedItems, setSelectedItems] = useState(() => {
    const initialSelection = {};
    receiveItems.forEach((batch) => {
      batch.items.forEach((item) => {
        initialSelection[item.product_id] = true;
      });
    });
    return initialSelection;
  });
  
  
  // Handle checkbox toggle for product selection
  const handleCheckboxChange = (productId) => {
    setSelectedItems((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }));
  };

  // Update product stocks in bulk
  const handleBulkUpdate = async (event) => {
    event.preventDefault();

    // Prepare the list of updates
   

    const updates = receiveItems.flatMap((batch) =>
      batch.items
        .filter((item) => selectedItems[item.product_id]) // Include only selected items
        .map((item) => {
          const product = products.find((p) => p.id === item.product_id);
          return product
            ? {
                product_id: product.id,
                action_type: "ADD", // Assuming "ADD" as the action type for receiving stock
                quantity: item.quantity,
                user_id: 1, // Replace with the actual user ID
                id: batch.id,
              }
            : null;
        })
        .filter(Boolean)
    );

    if (updates.length === 0) {
      alert("No items selected for update.");
      return;
    }
    console.log("Hello");
    console.log(updates);
    try {
      // Send bulk updates to the backend
      await axios.post(`${API_URL}bulk-update`, updates, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      // Update local product state after successful API call
      setProducts((prevProducts) =>
        prevProducts.map((product) => {
          const updatedItem = updates.find((u) => u.product_id === product.id);
          return updatedItem
            ? { ...product, stock: product.stock + updatedItem.quantity }
            : product;
        })
      );
      
      //const savedStatus = await onCompletePurchaseOrders(token)
      alert("Stock updated successfully!");
    } catch (error) {
      console.error("Error updating stock:", error);
      alert("Failed to update stock. Please try again.");
    }
  };

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
            </tr>
          </thead>
          <tbody>
            {receiveItems.map((batch) =>
              batch.items.map((item) => {
                const product = products.find((p) => p.id === item.product_id);
                return (
                  <tr key={item.product_id}>
                    <td>{product ? product.title : "Unknown Product"}</td>
                    <td>{item.quantity}</td>
                    <td>{item.cost_per_unit}</td>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedItems[item.product_id]}
                        onChange={() => handleCheckboxChange(item.product_id)}
                      />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
        <button type="submit" className="accept-button">
          Update Stock for Selected Items
        </button>
      </form>
    </div>
  );
};

export default ReceiveStock;
