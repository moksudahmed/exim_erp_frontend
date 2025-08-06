// src/components/customers/EditCustomer.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaSave, FaTimes, FaUser } from 'react-icons/fa';
import * as clientAPI from '../../api/client';
import './styles/ManageCustomers.css';

const EditCustomer = ({ token }) => {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    first_name: '',
    last_name: '',
    gender: '',
    account_name: '',
    account_no: '',
    contact_no: '',
    address: '',
    branch: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const data = await clientAPI.fetchClientById(clientId, token);
        setCustomer(data);
        setFormData({
          title: data.title || '',
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          gender: data.gender || '',
          account_name: data.account_name || '',
          account_no: data.account_no || '',
          contact_no: data.contact_no || '',
          address: data.address || '',
          branch: data.branch || ''
        });
      } catch (error) {
        console.error('Error fetching customer:', error);
        setMessage({ text: 'Failed to load customer data.', type: 'error' });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCustomer();
  }, [clientId, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await clientAPI.updateClient(clientId, formData, token);
      setMessage({ text: 'Customer updated successfully!', type: 'success' });
      setTimeout(() => navigate('/customers'), 1500);
    } catch (error) {
      console.error('Error updating customer:', error);
      setMessage({ text: 'Failed to update customer.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !customer) {
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
          <h1 className="customer-management__title">Edit Customer</h1>
          <p className="customer-management__subtitle">
            Update customer information
          </p>
        </div>
      </div>

      {message.text && (
        <div className={`customer-management__message customer-management__message--${message.type}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="customer-form">
        <div className="customer-form__header">
          <div className="customer-form__avatar">
            <FaUser size={24} />
          </div>
          <h3>Editing: {customer.first_name} {customer.last_name}</h3>
        </div>

        <div className="customer-form__grid">
          <div className="customer-form__group">
            <label>Title</label>
            <select
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="customer-form__input"
            >
              <option value="">Select Title</option>
              <option value="Mr">Mr</option>
              <option value="Mrs">Mrs</option>
              <option value="Miss">Miss</option>
              <option value="Dr">Dr</option>
              <option value="Prof">Prof</option>
            </select>
          </div>

          <div className="customer-form__group">
            <label>First Name</label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              className="customer-form__input"
              required
            />
          </div>

          <div className="customer-form__group">
            <label>Last Name</label>
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              className="customer-form__input"
              required
            />
          </div>

          <div className="customer-form__group">
            <label>Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="customer-form__input"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="customer-form__group">
            <label>Account Name</label>
            <input
              type="text"
              name="account_name"
              value={formData.account_name}
              onChange={handleChange}
              className="customer-form__input"
              required
            />
          </div>

          <div className="customer-form__group">
            <label>Account Number</label>
            <input
              type="text"
              name="account_no"
              value={formData.account_no}
              onChange={handleChange}
              className="customer-form__input"
              required
            />
          </div>

          <div className="customer-form__group">
            <label>Contact Number</label>
            <input
              type="tel"
              name="contact_no"
              value={formData.contact_no}
              onChange={handleChange}
              className="customer-form__input"
              required
            />
          </div>

          <div className="customer-form__group">
            <label>Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="customer-form__input customer-form__textarea"
              rows="3"
            />
          </div>

          <div className="customer-form__group">
            <label>Branch</label>
            <input
              type="text"
              name="branch"
              value={formData.branch}
              onChange={handleChange}
              className="customer-form__input"
            />
          </div>
        </div>

        <div className="customer-form__actions">
          <button
            type="button"
            onClick={() => navigate('/customers')}
            className="customer-form__button customer-form__button--cancel"
            disabled={isLoading}
          >
            <FaTimes /> Cancel
          </button>
          <button
            type="submit"
            className="customer-form__button customer-form__button--save"
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : (<><FaSave /> Save Changes</>)}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditCustomer;