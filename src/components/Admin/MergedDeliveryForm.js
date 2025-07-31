import React, { useEffect, useState, useRef } from 'react';
import { fetchDrivers as fetchDriversAPI, addDriver } from '../../api/drivers';
import { addDeliveries, fetchDeliveries } from '../../api/delivery';
import './styles/DeliveryForm.css';

const MergedDeliveryForm = ({ sales, token }) => {
  const [drivers, setDrivers] = useState([]);
  const [deliveries, setDeliveries] = useState([]);
  const [selectedDriverId, setSelectedDriverId] = useState('');
  const [form, setForm] = useState({
    sale_id: '',
    driver_id: '',
    name: '',
    phone_no: '',
    truck_no: '',
    measurment: '',
    measurement_type: 'scale',
    length: '',
    width: '',
    height: '',
    save_driver: false,
    fare: '',
    other_cost: '',
    delivery_date: '',
    note: '',
    total_cost: '',
    user_id: 1,
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

  const handleDriverSelect = (e) => {
    const driverId = e.target.value;
    setSelectedDriverId(driverId);
    const driver = drivers.find((d) => d.id.toString() === driverId);

    if (driver) {
      setForm((prev) => ({
        ...prev,
        driver_id: driver.id,
        name: driver.name,
        phone_no: driver.phone_no || '',
        truck_no: driver.truck_no || '',
        measurment: driver.measurment || '',
        measurement_type: driver.measurement_type || 'scale',
        length: '',
        width: '',
        height: '',
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => {
      const updated = {
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      };

      if (
        updated.measurement_type === 'tape' &&
        ['length', 'width', 'height'].includes(name)
      ) {
        const l = parseFloat(updated.length) || 0;
        const w = parseFloat(updated.width) || 0;
        const h = parseFloat(updated.height) || 0;
        updated.measurment = parseFloat(((l * w * h) / 35).toFixed(3));
      }

      // Auto-update total cost if fare or measurment or other_cost changes
      const fare = parseFloat(updated.fare) || 0;
      const measurment = parseFloat(updated.measurment) || 0;
      const other_cost = parseFloat(updated.other_cost) || 0;

      updated.total_cost = parseFloat((measurment * fare + other_cost).toFixed(2));

      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (form.save_driver) {
        const driver = await addDriver(form, token);
        const updatedDrivers = await fetchDriversAPI(token);
        setDrivers(updatedDrivers);
        setSelectedDriverId(driver.id)         
      }
      form.driver_id = selectedDriverId;
      console.log(form);
      await addDeliveries(form, token);
      alert('Delivery record added successfully!');
      if (form.sale_id) {
        const updatedDeliveries = await fetchDeliveries(token, form.sale_id);
        setDeliveries(updatedDeliveries);
      }
      setForm({
        sale_id: '',
        driver_id: '',
        name: '',
        phone_no: '',
        truck_no: '',
        measurment: '',
        measurement_type: 'scale',
        length: '',
        width: '',
        height: '',
        save_driver: false,
        fare: '',
        other_cost: '',
        delivery_date: '',
        note: '',
        total_cost: '',
        user_id: 1,
      });

      setSelectedDriverId('');
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
      <h2 className="section-title">Delivery Entry</h2>
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

        <h4>Driver Info</h4>
        <div className="form-group">
          <label>Select Existing Driver</label>
          <select value={selectedDriverId} onChange={handleDriverSelect}>
            <option value="">-- New Driver --</option>
            {drivers.map((d) => (
              <option key={d.id} value={d.id}>{d.name} ({d.truck_no})</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Name</label>
          <input name="name" value={form.name} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Phone No</label>
          <input name="phone_no" value={form.phone_no} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Truck No</label>
          <input name="truck_no" value={form.truck_no} onChange={handleChange} />
        </div>

        <fieldset className="radio-group">
          <legend>Measurement Type</legend>
          <label>
            <input type="radio" name="measurement_type" value="scale" checked={form.measurement_type === 'scale'} onChange={handleChange} /> Scale
          </label>
          <label>
            <input type="radio" name="measurement_type" value="tape" checked={form.measurement_type === 'tape'} onChange={handleChange} /> Tape
          </label>
        </fieldset>

        {form.measurement_type === 'tape' ? (
          <div className="tape-inputs">
            <label>Length (ft)<input type="number" name="length" value={form.length} onChange={handleChange} required /></label>
            <label>Width (ft)<input type="number" name="width" value={form.width} onChange={handleChange} required /></label>
            <label>Height (ft)<input type="number" name="height" value={form.height} onChange={handleChange} required /></label>
            <p><strong>Calculated Tons:</strong> {form.measurment}</p>
          </div>
        ) : (
          <label>Measurement (tons)<input name="measurment" type="number" value={form.measurment} onChange={handleChange} required /></label>
        )}

        <label>
          <input type="checkbox" name="save_driver" checked={form.save_driver} onChange={handleChange} />
          Save driver info for future use?
        </label>

        <div className="form-row">
          <label>Fare<input type="number" name="fare" value={form.fare} onChange={handleChange} required /></label>
          <label>Other Cost<input type="number" name="other_cost" value={form.other_cost} onChange={handleChange} /></label>
          <label>Delivery Date<input type="date" name="delivery_date" value={form.delivery_date} onChange={handleChange} /></label>
        </div>

        <label>Total Cost
          <input type="number" name="total_cost" value={form.total_cost} readOnly />
        </label>

        <label>Note<textarea name="note" value={form.note} onChange={handleChange}></textarea></label>

        <button type="submit">Save Delivery</button>
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
            <th>Total</th>
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
                <td>{d.total_cost} TK</td>
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

export default MergedDeliveryForm;
