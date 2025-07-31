import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PaymentForm = () => {
  const [clientType, setClientType] = useState('');
  const [clients, setClients] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState('');
  const [form, setForm] = useState({
    business_id: 1,
    payment_date: new Date().toISOString().split('T')[0],
    amount: '',
    payment_method: 'CASH',
    reference_number: '',
    notes: '',
    sale_id: null,
    purchase_id: null
  });
  const [message, setMessage] = useState('');

  const paymentMethods = ['CASH', 'BANK_TRANSFER', 'CHEQUE', 'MOBILE_PAYMENT'];

  // Fetch clients based on selected type
  useEffect(() => {
    if (!clientType) return;
    const fetchClients = async () => {
      try {
        const res = await axios.get(`/api/v1/client/by-type/${clientType}`);
        setClients(res.data);
      } catch (err) {
        console.error('Error loading clients:', err);
        setClients([]);
      }
    };
    fetchClients();
  }, [clientType]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Add client relationship
    const payload = {
      ...form,
      [`${clientType.toLowerCase()}_id`]: selectedClientId || null,
      amount: parseFloat(form.amount)
    };

    try {
      await axios.post('/api/v1/payments/', payload);
      setMessage('✅ Payment successfully recorded!');
      setForm({
        business_id: 1,
        payment_date: new Date().toISOString().split('T')[0],
        amount: '',
        payment_method: 'CASH',
        reference_number: '',
        notes: '',
        sale_id: null,
        purchase_id: null
      });
      setSelectedClientId('');
    } catch (err) {
      console.error(err);
      setMessage('❌ Failed to record payment.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">💳 Make a Payment</h2>

      {/* Client Type */}
      <div className="mb-4">
        <label className="block font-semibold mb-1">Client Type</label>
        <select
          className="w-full border rounded p-2"
          value={clientType}
          onChange={(e) => setClientType(e.target.value)}
        >
          <option value="">Select Type</option>
          <option value="Customer">Customer</option>
          <option value="Supplier">Supplier</option>
          <option value="Agent">Agent</option>
        </select>
      </div>

      {/* Client Selection */}
      {clientType && (
        <div className="mb-4">
          <label className="block font-semibold mb-1">Select {clientType}</label>
          <select
            className="w-full border rounded p-2"
            value={selectedClientId}
            onChange={(e) => setSelectedClientId(e.target.value)}
          >
            <option value="">-- Select --</option>
            {clients.map((client) => (
              <option key={client.client_id} value={client.client_id}>
                {client.first_name} {client.last_name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Payment Form */}
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
        <div>
          <label className="block font-semibold mb-1">Amount</label>
          <input
            type="number"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Payment Method</label>
          <select
            name="payment_method"
            value={form.payment_method}
            onChange={handleChange}
            className="w-full border rounded p-2"
          >
            {paymentMethods.map(method => (
              <option key={method} value={method}>{method}</option>
            ))}
          </select>
        </div>

        <div className="col-span-2">
          <label className="block font-semibold mb-1">Reference Number</label>
          <input
            type="text"
            name="reference_number"
            value={form.reference_number}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>

        <div className="col-span-2">
          <label className="block font-semibold mb-1">Notes</label>
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>

        <button
          type="submit"
          className="col-span-2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Submit Payment
        </button>

        {message && (
          <div className="col-span-2 text-center text-green-600 mt-2">
            {message}
          </div>
        )}
      </form>
    </div>
  );
};

export default PaymentForm;
