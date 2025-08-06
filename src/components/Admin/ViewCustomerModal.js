import React from 'react';
import { FaUser } from 'react-icons/fa';

const ViewCustomerModal = ({ customer, isOpen, onClose }) => {
  if (!isOpen || !customer) return null;

  const getFullName = (customer) =>
    `${customer.title || ''} ${customer.first_name || ''} ${customer.last_name || ''}`.trim();

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <button className="modal-close-btn" onClick={onClose}>
          ✕
        </button>
        <h2 className="modal-title">Customer Details</h2>
        <div className="modal-content">
          <div className="customer-profile-header">
            <div className="customer-avatar">
              <FaUser size={24} />
            </div>
            <div>
              <h3>{getFullName(customer)}</h3>
              <p className="customer-type">{customer.client_type}</p>
            </div>
          </div>
          
          <div className="customer-details-grid">
            <div className="detail-item">
              <span className="detail-label">Customer ID:</span>
              <span className="detail-value">{customer.client_id}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Gender:</span>
              <span className="detail-value">{customer.gender || '-'}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Registered:</span>
              <span className="detail-value">{formatDate(customer.registration_date)}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Account Name:</span>
              <span className="detail-value">{customer.account_name || '-'}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Account No:</span>
              <span className="detail-value">{customer.account_no || '-'}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Contact:</span>
              <span className="detail-value">{customer.contact_no || '-'}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Address:</span>
              <span className="detail-value">{customer.address || '-'}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Branch:</span>
              <span className="detail-value">{customer.branch || '-'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewCustomerModal;