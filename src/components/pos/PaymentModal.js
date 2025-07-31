import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import "./styles/PaymentModal.css"; // Make sure this file contains modal styles
import { addPayments } from "../../api/payment";

const PaymentModal = ({ sale, client, token, onClose }) => {
  const [clientType, setClientType] = useState("Customer");
  const [clients, setClients] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState(client?.client_id || "");
  const [form, setForm] = useState({
    business_id: 1,
    payment_date: new Date().toISOString().split("T")[0],
    amount: sale.total || "",
    payment_method: "CASH",
    reference_number: "",
    notes: "",
    sale_id: sale.id || null,
    purchase_id: null,
  });
  const [message, setMessage] = useState("");

  const paymentMethods = ["CASH", "BANK_TRANSFER", "CHEQUE", "MOBILE_PAYMENT"];

  useEffect(() => {
    if (!clientType) return;
    const fetchClients = async () => {
      try {
        const res = await axios.get(`/api/v1/client/by-type/${clientType}`);
        setClients(res.data);
      } catch (err) {
        console.error("Error loading clients:", err);
        setClients([]);
      }
    };
    fetchClients();
  }, [clientType]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      amount: parseFloat(form.amount),
      [`${clientType.toLowerCase()}_id`]: selectedClientId || null,
    };

    try {
     /* await axios.post("/api/v1/payments/", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });*/
      await addPayments(payload, token);
      setMessage("✅ Payment successfully recorded!");
      setTimeout(() => {
        onClose();
        setMessage("");
      }, 1500);
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to record payment.");
    }
  };

  if (!sale) return null;

  return ReactDOM.createPortal(
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>💳 Make a Payment</h2>

        {/* Client Type Selector */}
        <div className="form-group">
          <label>Client Type</label>
          <select value={clientType} onChange={(e) => setClientType(e.target.value)}>
            <option value="">Select Type</option>
            <option value="Customer">Customer</option>
            <option value="Supplier">Supplier</option>
            <option value="Agent">Agent</option>
          </select>
        </div>

        {/* Client Selector */}
        {clientType && (
          <div className="form-group">
            <label>Select {clientType}</label>
            <select value={selectedClientId} onChange={(e) => setSelectedClientId(e.target.value)}>
              <option value="">-- Select --</option>
              {clients.map((c) => (
                <option key={c.client_id} value={c.client_id}>
                  {c.first_name} {c.last_name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Payment Form */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Amount</label>
            <input
              type="number"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Payment Method</label>
            <select
              name="payment_method"
              value={form.payment_method}
              onChange={handleChange}
            >
              {paymentMethods.map((method) => (
                <option key={method} value={method}>
                  {method}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Reference Number</label>
            <input
              type="text"
              name="reference_number"
              value={form.reference_number}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Notes</label>
            <textarea name="notes" value={form.notes} onChange={handleChange} />
          </div>

          <div className="modal-buttons">
            <button type="submit">✅ Submit Payment</button>
            <button type="button" onClick={onClose} className="close-btn">
              ❌ Cancel
            </button>
          </div>

          {message && <div className="status-message">{message}</div>}
        </form>
      </div>
    </div>,
    document.body
  );
};

export default PaymentModal;
