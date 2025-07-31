import React from 'react';

const InventoryLogs = ({ products, inventoryLogs }) => {
  console.log('inventoryLogs:', inventoryLogs);
  if (!Array.isArray(inventoryLogs)) {    
    return <div>Error: Inventory logs data is not an array.</div>;
  }

  return (
    <div>
      <h2>Inventory Logs</h2>
      <table className="log-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Action</th>
            <th>Quantity</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {inventoryLogs.map(log => {
            const product = products.find((p) => p.id === log.product_id);
            return (
              <tr key={log.id}>
                <td>{product ? product.title : 'Unknown Product'}</td>
                <td>{log.action_type}</td>
                <td>{log.quantity}</td>
                <td>{new Date(log.created_at).toLocaleString()}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryLogs;
