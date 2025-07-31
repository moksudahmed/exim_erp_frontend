import React, { useEffect, useState, useRef } from 'react';
import { fetchDrivers as fetchDriversAPI } from '../../api/drivers';
import { addDeliveries, fetchDeliveries } from '../../api/delivery';
import './styles/DeliveryForm.css';

const DeliveryForm = ({ sales, token }) => {
  const [deliveries, setDeliveries] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [form, setForm] = useState({
    sale_id: '',
    driver_id: '',
    fare: '',
    other_cost: '',
    delivery_date: '',
    note: ''
  });

  const printableRefs = useRef({});

  useEffect(() => {
    const loadDrivers = async () => {
      try {
        const result = await fetchDriversAPI(token);
        setDrivers(result);
      } catch (err) {
        console.error('Failed to fetch drivers:', err);
      }
    };
    loadDrivers();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDeliveries(form, token);
      alert('Delivery record added successfully!');
      setForm({
        sale_id: '',
        driver_id: '',
        fare: '',
        other_cost: '',
        delivery_date: '',
        note: ''
      });
      if (form.sale_id) {
        const updatedDeliveries = await fetchDeliveries(token, form.sale_id);
        setDeliveries(updatedDeliveries);
      }
    } catch (err) {
      console.error('Error submitting delivery:', err);
      alert(err.message || 'Failed to add delivery');
    }
  };
const handlePrint = (id) => {
  const content = printableRefs.current[id];
  if (!content) return;

  const printWindow = window.open('', '_blank');
  printWindow.document.write(`
    <html>
      <head>
        <title>Delivery Invoice</title>
        <style>
          body {
            font-family: 'SutonnyMJ', Arial, sans-serif;
            padding: 40px;
            font-size: 14px;
            line-height: 1.6;
          }

          .invoice-header {
            text-align: center;
            border-bottom: 2px solid black;
            margin-bottom: 20px;
          }

          .invoice-header h2 {
            margin: 0;
            font-size: 22px;
          }

          .contact-info {
            font-size: 12px;
          }

          .meta-info {
            margin: 20px 0;
            border: 1px solid black;
            padding: 10px;
          }

          .meta-info p {
            margin: 4px 0;
          }

          .invoice-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }

          .invoice-table th, .invoice-table td {
            border: 1px solid black;
            padding: 6px;
            text-align: center;
          }

          .totals {
            margin-top: 10px;
            font-weight: bold;
          }

          .footer {
            margin-top: 50px;
            display: flex;
            justify-content: space-between;
            font-size: 14px;
          }

          .footer div {
            border-top: 1px solid black;
            padding-top: 4px;
            width: 40%;
            text-align: center;
          }

          .center {
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="invoice-header">
          <h2>মেসার্স হক ব্রাদার্স</h2>
          <p class="contact-info">
            কসবাম, পান্না আলমনগরীরকান্দি, সুনামগঞ্জ<br/>
            হেড অফিস: ২৪৫, পৌরসভা সড়ক (২য় তলা), সুনামগঞ্জ<br/>
            মোবাইল: 017XXXXXXXX, ই-মেইল: example@email.com
          </p>
        </div>

        <div class="meta-info">
          <p><strong>ড্রাইভার নাম:</strong> RAFIK</p>
          <p><strong>ক্রেতার নাম:</strong> মোঃ রাশেদুল ইসলাম</p>
          <p><strong>ঠিকানা:</strong> শহরবন্দি, সুনামগঞ্জ</p>
          <p><strong>গাড়ি নাম্বার:</strong> DM-TA-1B-1207</p>
          <p><strong>মোবাইল:</strong> 017XXXXXXXX</p>
          <p><strong>তারিখ:</strong> ${new Date().toLocaleDateString()}</p>
        </div>

        <table class="invoice-table">
          <thead>
            <tr>
              <th>পণ্যের বিবরণ</th>
              <th>পরিমাপ</th>
              <th>দৈর্ঘ্য</th>
              <th>প্রস্থ</th>
              <th>উচ্চতা</th>
              <th>পরিমাণ</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>ইটের পরিমাণ</td>
              <td>ফিট</td>
              <td>19.10</td>
              <td>7.73</td>
              <td>4.67</td>
              <td>19.790</td>
            </tr>
          </tbody>
        </table>

        <div class="totals">
          <p>ইটের দাম: 460.00</p>
          <p>গাড়ি ভাড়া: 0.00</p>
          <p>মোট টাকাঃ 12220.00</p>
          <p>ছাড়: 0.00</p>
          <p>সর্বমোট: 12220.00</p>
        </div>

        <p><strong>কথায়:</strong> মোট বার হাজার দুই শত বিশ টাকা</p>

        <div class="footer">
          <div>ড্রাইভারের স্বাক্ষর: RAFIK</div>
          <div>পক্ষে: মেসার্স হক ব্রাদার্স</div>
        </div>
      </body>
    </html>
  `);

  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
  printWindow.close();
};


  return (
    <div className="delivery-container">
      <h2 className="section-title">Add Delivery</h2>
      <form onSubmit={handleSubmit} className="delivery-form">
        <div className="form-group">
          <label>Sale</label>
          <select name="sale_id" value={form.sale_id} onChange={handleChange} required>
            <option value="">Select Sale</option>
            {sales.map((s) => (
              <option key={s.id} value={s.id}>Sale #{s.id}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Driver</label>
          <select name="driver_id" value={form.driver_id} onChange={handleChange} required>
            <option value="">Select Driver</option>
            {drivers.map((d) => (
              <option key={d.id} value={d.id}>{d.name} ({d.truck_no})</option>
            ))}
          </select>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Fare</label>
            <input type="number" name="fare" value={form.fare} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Other Cost</label>
            <input type="number" name="other_cost" value={form.other_cost} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Delivery Date</label>
            <input type="date" name="delivery_date" value={form.delivery_date} onChange={handleChange} />
          </div>
        </div>

        <div className="form-group">
          <label>Note</label>
          <textarea name="note" value={form.note} onChange={handleChange}></textarea>
        </div>

        <button type="submit" className="submit-button">Save Delivery</button>
      </form>

      <h3 className="section-title">Existing Deliveries</h3>
      <table className="delivery-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Sale ID</th>
            <th>Driver</th>
            <th>Fare</th>
            <th>Other Cost</th>
            <th>Delivery Date</th>
            <th>Note</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {deliveries.length > 0 ? (
            deliveries.map((d) => (
              <tr key={d.id}>
                <td>{d.id}</td>
                <td>{d.sale_id}</td>
                <td>{drivers.find((dr) => dr.id === d.driver_id)?.name || 'Unknown'}</td>
                <td>{d.fare}</td>
                <td>{d.other_cost}</td>
                <td>{new Date(d.delivery_date).toLocaleDateString()}</td>
                <td>{d.note}</td>
                <td>
                  <button onClick={() => handlePrint(d.id)} className="print-button">Print Invoice</button>
                  <div
                    ref={(el) => (printableRefs.current[d.id] = el)}
                    style={{ display: 'none' }}
                  >
                    <h2>Delivery Invoice</h2>
                    <p><strong>Sale ID:</strong> {d.sale_id}</p>
                    <p><strong>Driver:</strong> {drivers.find((dr) => dr.id === d.driver_id)?.name || 'Unknown'}</p>
                    <p><strong>Truck No:</strong> {drivers.find((dr) => dr.id === d.driver_id)?.truck_no || 'N/A'}</p>
                    <p><strong>Fare:</strong> {d.fare}</p>
                    <p><strong>Other Cost:</strong> {d.other_cost}</p>
                    <p><strong>Date:</strong> {new Date(d.delivery_date).toLocaleDateString()}</p>
                    <p><strong>Note:</strong> {d.note}</p>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" style={{ textAlign: 'center' }}>No deliveries found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DeliveryForm;
