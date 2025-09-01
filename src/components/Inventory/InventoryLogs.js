import React, { useState, useMemo } from 'react';

const InventoryLogs = ({ products, inventoryLogs, isLoading = false }) => {
  // State for search and sorting
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'created_at', direction: 'desc' });
  const [selectedAction, setSelectedAction] = useState('all');

  // Create product map for faster lookup
  const productMap = useMemo(() => {
    const map = {};
    if (Array.isArray(products)) {
      products.forEach(product => {
        map[product.id] = product;
      });
    }
    return map;
  }, [products]);

  // Get unique action types for filter
  const actionTypes = useMemo(() => {
    if (!Array.isArray(inventoryLogs)) return ['all'];
    const types = new Set(inventoryLogs.map(log => log.action_type));
    return ['all', ...Array.from(types)];
  }, [inventoryLogs]);

  // Filter and sort logs
  const filteredAndSortedLogs = useMemo(() => {
    if (!Array.isArray(inventoryLogs)) return [];
    
    let filteredLogs = inventoryLogs.filter(log => {
      const product = productMap[log.product_id];
      const matchesSearch = product && product.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesAction = selectedAction === 'all' || log.action_type === selectedAction;
      
      return matchesSearch && matchesAction;
    });

    // Sorting
    if (sortConfig.key) {
      filteredLogs.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];
        
        // Handle product title sorting
        if (sortConfig.key === 'product_id') {
          aValue = productMap[a.product_id]?.title || '';
          bValue = productMap[b.product_id]?.title || '';
        }
        
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return filteredLogs;
  }, [inventoryLogs, productMap, searchTerm, selectedAction, sortConfig]);

  // Handle sort request
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Handle loading state
  if (isLoading) {
    return (
      <div className="inventory-logs">
        <div className="logs-header">
          <h2>Inventory Logs</h2>
        </div>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading inventory data...</p>
        </div>
      </div>
    );
  }

  // Handle error state
  if (!Array.isArray(inventoryLogs)) {
    return (
      <div className="inventory-logs">
        <div className="logs-header">
          <h2>Inventory Logs</h2>
        </div>
        <div className="error-state">
          <div className="error-icon">⚠️</div>
          <h3>Data Format Issue</h3>
          <p>Inventory logs data is not in the expected format. Please check your data source.</p>
        </div>
      </div>
    );
  }

  // Handle empty state
  if (inventoryLogs.length === 0) {
    return (
      <div className="inventory-logs">
        <div className="logs-header">
          <h2>Inventory Logs</h2>
        </div>
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h3>No Inventory Logs Found</h3>
          <p>There are no inventory logs to display at this time.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="inventory-logs">
      <div className="logs-header">
        <h2>Inventory Logs</h2>
        <div className="controls">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-select">
            <select
              value={selectedAction}
              onChange={(e) => setSelectedAction(e.target.value)}
            >
              {actionTypes.map(action => (
                <option key={action} value={action}>
                  {action === 'all' ? 'All Actions' : action}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="table-container">
        <table className="logs-table">
          <thead>
            <tr>
              <th 
                className={sortConfig.key === 'product_id' ? `sort-${sortConfig.direction}` : ''}
                onClick={() => requestSort('product_id')}
              >
                Product
              </th>
              <th 
                className={sortConfig.key === 'action_type' ? `sort-${sortConfig.direction}` : ''}
                onClick={() => requestSort('action_type')}
              >
                Action
              </th>
              <th 
                className={sortConfig.key === 'quantity' ? `sort-${sortConfig.direction}` : ''}
                onClick={() => requestSort('quantity')}
              >
                Quantity
              </th>
              <th 
                className={sortConfig.key === 'created_at' ? `sort-${sortConfig.direction}` : ''}
                onClick={() => requestSort('created_at')}
              >
                Date
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedLogs.map(log => {
              const product = productMap[log.product_id];
              return (
                <tr key={log.id}>
                  <td>
                    <div className="product-info">
                      {product ? product.title : 'Unknown Product'}
                    </div>
                  </td>
                  <td>
                    <span className={`action-tag action-${log.action_type.toLowerCase()}`}>
                      {log.action_type}
                    </span>
                  </td>
                  <td className="quantity-cell">{log.quantity}</td>
                  <td className="date-cell">
                    {new Date(log.created_at).toLocaleDateString()}
                    <span className="time">
                      {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        
        {filteredAndSortedLogs.length === 0 && (
          <div className="no-results">
            <p>No logs match your search criteria.</p>
          </div>
        )}
      </div>
      
      <div className="table-footer">
        <p>Showing {filteredAndSortedLogs.length} of {inventoryLogs.length} logs</p>
      </div>
    </div>
  );
};

export default InventoryLogs;