import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createClient } from '../../api/client';

const AddCustomer = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    client_type: '',
    first_name: '',
    last_name: '',
    gender: '',
    registration_date: '',
    account_name: '',
    account_no: '',
  });

  const [message, setMessage] = useState({ text: '', type: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createClient(formData);
      setMessage({ text: 'Customer added successfully!', type: 'success' });
      setTimeout(() => navigate('/customers'), 1500);
    } catch (error) {
      setMessage({ text: 'Failed to add customer.', type: 'error' });
      console.error(error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Add New Customer</h2>

      {message.text && (
        <div
          className={`mb-4 p-3 rounded text-sm ${
            message.type === 'success'
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <input name="client_type" placeholder="Client Type" value={formData.client_type} onChange={handleChange} className="input" required />
          <input name="gender" placeholder="Gender" value={formData.gender} onChange={handleChange} className="input" required />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <input name="first_name" placeholder="First Name" value={formData.first_name} onChange={handleChange} className="input" required />
          <input name="last_name" placeholder="Last Name" value={formData.last_name} onChange={handleChange} className="input" required />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <input type="date" name="registration_date" value={formData.registration_date} onChange={handleChange} className="input" required />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <input name="account_name" placeholder="Account Name" value={formData.account_name} onChange={handleChange} className="input" />
          <input name="account_no" placeholder="Account Number" value={formData.account_no} onChange={handleChange} className="input" />
        </div>

        <button type="submit" className="btn btn-primary w-full">Add Customer</button>
      </form>
    </div>
  );
};

export default AddCustomer;
