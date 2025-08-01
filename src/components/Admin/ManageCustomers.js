import React, { useEffect, useState, useCallback } from 'react';
import { FaEye, FaEdit, FaTrash, FaUser, FaSearch, FaPlus } from 'react-icons/fa';
import { FiFilter } from 'react-icons/fi';
import * as clientAPI from '../../api/client';
import './styles/ManageCustomers.css'; // Import the CSS file

const ManageCustomers = ({ token }) => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'client_id', direction: 'ascending' });

  const loadCustomers = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await clientAPI.fetchClientsByType('CUSTOMER', token);
      const sortedData = Array.isArray(response) ? response : [];
      setCustomers(sortedData);
      setFilteredCustomers(sortedData);
      setMessage({ text: '', type: '' });
    } catch (error) {
      console.error('Error fetching customers:', error);
      setMessage({ text: 'Failed to load customers.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  const handleDelete = async (clientId) => {
    const confirmed = window.confirm('Are you sure you want to delete this customer?');
    if (!confirmed) return;

    try {
      await clientAPI.deleteClient(clientId, token);
      setMessage({ text: 'Customer deleted successfully.', type: 'success' });
      await loadCustomers();
    } catch (error) {
      console.error('Delete error:', error);
      setMessage({ text: 'Failed to delete customer.', type: 'error' });
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = customers.filter(customer => 
      getFullName(customer).toLowerCase().includes(term) ||
      customer.account_name.toLowerCase().includes(term) ||
      customer.contact_no?.toLowerCase().includes(term) ||
      customer.account_no?.toLowerCase().includes(term)
    );
    setFilteredCustomers(filtered);
  };

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
    
    const sortedData = [...filteredCustomers].sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === 'ascending' ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
    setFilteredCustomers(sortedData);
  };

  const getFullName = (customer) => {
    return `${customer.title || ''} ${customer.first_name || ''} ${customer.last_name || ''}`.trim();
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  useEffect(() => {
    loadCustomers();
  }, [loadCustomers]);

  if (isLoading) {
    return (
      <div className="customer-management__loading">
        <div className="customer-management__spinner"></div>
        <p className="customer-management__loading-text">Loading customer data...</p>
      </div>
    );
  }

  return (
    <div className="customer-management">
      <div className="customer-management__header">
        <div>
          <h1 className="customer-management__title">Customer Management</h1>
          <p className="customer-management__subtitle">Manage all your customer accounts and information</p>
        </div>
        <div className="customer-management__count-badge">
          {filteredCustomers.length} {filteredCustomers.length === 1 ? 'Customer' : 'Customers'}
        </div>
      </div>

      {message.text && (
        <div className={`customer-management__message customer-management__message--${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="customer-management__search-container">
        <div className="customer-management__search-wrapper">
          <div className="customer-management__search-icon">
            <FaSearch />
          </div>
          <input
            type="text"
            placeholder="Search customers by name, account or phone..."
            className="customer-management__search-input"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <button className="customer-management__filter-btn">
          <FiFilter className="mr-2" />
          Filters
        </button>
      </div>

      <div className="customer-management__table-container">
        <div className="overflow-x-auto">
          <table className="customer-management__table">
            <thead className="customer-management__table-header">
              <tr>
                <th 
                  className="customer-management__sortable"
                  onClick={() => requestSort('client_id')}
                >
                  <div className="flex items-center">
                    ID
                    {sortConfig.key === 'client_id' && (
                      <span className="ml-1">
                        {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th 
                  className="customer-management__sortable"
                  onClick={() => requestSort('first_name')}
                >
                  <div className="flex items-center">
                    Customer
                    {sortConfig.key === 'first_name' && (
                      <span className="ml-1">
                        {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th>Account Details</th>
                <th>Contact</th>
                <th>Location</th>
                <th 
                  className="customer-management__sortable"
                  onClick={() => requestSort('registration_date')}
                >
                  <div className="flex items-center">
                    Registered
                    {sortConfig.key === 'registration_date' && (
                      <span className="ml-1">
                        {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer) => (
                  <tr key={customer.client_id} className="customer-management__table-row">
                    <td className="customer-management__table-cell customer-management__table-cell--dark">
                      {customer.client_id}
                    </td>
                    <td className="customer-management__table-cell">
                      <div className="flex items-center">
                        <div className="customer-management__avatar">
                          <FaUser />
                        </div>
                        <div>
                          <div className="customer-management__table-cell--dark">
                            {getFullName(customer)}
                          </div>
                          <div className="text-xs text-gray-500">{customer.account_holder}</div>
                        </div>
                      </div>
                    </td>
                    <td className="customer-management__table-cell">
                      <div className="customer-management__table-cell--dark">
                        {customer.account_name}
                      </div>
                      <div className="text-xs text-gray-500">A/C No: {customer.account_no}</div>
                    </td>
                    <td className="customer-management__table-cell">
                      {customer.contact_no || '-'}
                    </td>
                    <td className="customer-management__table-cell">
                      <div>{customer.address || '-'}</div>
                      {customer.branch && (
                        <div className="text-xs text-gray-500">Branch: {customer.branch}</div>
                      )}
                    </td>
                    <td className="customer-management__table-cell">
                      {formatDate(customer.registration_date)}
                    </td>
                    <td className="customer-management__table-cell">
                      <div className="flex justify-center space-x-3">
                        <button 
                          title="View Details" 
                          className="customer-management__action-btn customer-management__action-btn--view"
                        >
                          <FaEye />
                        </button>
                        <button 
                          title="Edit Customer" 
                          className="customer-management__action-btn customer-management__action-btn--edit"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(customer.client_id)}
                          title="Delete Customer"
                          className="customer-management__action-btn customer-management__action-btn--delete"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="customer-management__empty-state">
                    <div className="flex flex-col items-center justify-center">
                      <FaUser className="customer-management__empty-icon" />
                      <h3 className="customer-management__empty-title">No customers found</h3>
                      <p className="customer-management__empty-description">
                        {searchTerm ? 
                          'No customers match your search criteria. Try different keywords.' : 
                          'Add your first customer to get started.'}
                      </p>
                      {!searchTerm && (
                        <button className="customer-management__primary-btn">
                          <FaPlus className="mr-2" />
                          Add Customer
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {filteredCustomers.length > 0 && (
        <div className="customer-management__pagination">
          <div>Showing {filteredCustomers.length} of {customers.length} customers</div>
          <div className="flex space-x-2">
            <button className="customer-management__pagination-btn">Previous</button>
            <button className="customer-management__pagination-btn customer-management__pagination-btn--active">1</button>
            <button className="customer-management__pagination-btn">Next</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(ManageCustomers);