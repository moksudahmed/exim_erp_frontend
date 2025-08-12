import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchClientById, updateClient } from '../../api/client';


const EditSupplier = ({token}) => {
  const { clientId: id } = useParams();
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
  
  useEffect(() => {
    const fetchClient = async () => {
      try {
        const data = await fetchClientById(id);
        setFormData(data);
        console.log(data);
      } catch (error) {
        setMessage({ text: 'Failed to load supplier.', type: 'error' });
      }
    };
    fetchClient();
  }, [id]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      
      const payload = {
              person: {
                title: formData.title,
                first_name: formData.first_name,
                last_name: formData.last_name,
                contact_no: formData.contact_no,
                gender: formData.gender
              },
              
              account: {
                //account_id: formData.account_id,
                account_name: formData.account_name,
                account_no: formData.account_no,
                address: formData.address,
                branch: formData.branch,
                account_holder: formData.account_holder,
                type: formData.account_type
              }
            };
            console.log(payload);
          await updateClient(id, payload, token)
      //await updateClient(id, formData);
      setMessage({ text: 'Supplier updated successfully!', type: 'success' });
      setTimeout(() => navigate('/admin'), 1500);
    } catch (error) {
      console.error(error);
      setMessage({ text: 'Failed to update supplier.', type: 'error' });
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Edit Supplier</h2>

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

        <button type="submit" className="btn btn-primary w-full">Update Supplier</button>
      </form>
    </div>
  );
};

export default EditSupplier;
