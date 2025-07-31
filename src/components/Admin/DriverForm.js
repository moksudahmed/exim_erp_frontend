import React, { useState, useEffect } from 'react';
import { fetchDrivers as fetchDriversAPI, addDriver } from '../../api/drivers';
import './styles/DriverForm.css';

const DriverForm = ({ token }) => {
  const [drivers, setDrivers] = useState([]);
  const [form, setForm] = useState({
    name: '',
    phone_no: '',
    truck_no: '',
    measurment: '',
    measurement_type: 'scale',
    length: '',
    width: '',
    height: '',
    user_id: 1,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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
    setForm((prev) => {
      const updated = { ...prev, [name]: value };

      if (
        updated.measurement_type === 'tape' &&
        name !== 'measurment' &&
        ['length', 'width', 'height'].includes(name)
      ) {
        const l = parseFloat(updated.length) || 0;
        const w = parseFloat(updated.width) || 0;
        const h = parseFloat(updated.height) || 0;
        updated.measurment = parseFloat(((l * w * h)/35).toFixed(3));
      }

      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await addDriver(form, token);
      setSuccess('Driver added successfully!');
      setForm({
        name: '',
        phone_no: '',
        truck_no: '',
        measurment: '',
        measurement_type: 'scale',
        length: '',
        width: '',
        height: '',
        user_id: 1,
      });

      const result = await fetchDriversAPI(token);
      setDrivers(result);
    } catch (err) {
      setError('Error saving driver. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="driver-form-container">
      <h2 className="form-title">Add New Driver</h2>
      <form className="driver-form" onSubmit={handleSubmit}>
        <label>
          Name
          <input name="name" value={form.name} onChange={handleChange} required />
        </label>

        <label>
          Phone Number
          <input name="phone_no" value={form.phone_no} onChange={handleChange} />
        </label>

        <label>
          Truck Number
          <input name="truck_no" value={form.truck_no} onChange={handleChange} />
        </label>

        <fieldset className="radio-group">
          <legend>Measurement Type</legend>
          <label>
            <input
              type="radio"
              name="measurement_type"
              value="scale"
              checked={form.measurement_type === 'scale'}
              onChange={handleChange}
            />
            Scale
          </label>
          <label>
            <input
              type="radio"
              name="measurement_type"
              value="tape"
              checked={form.measurement_type === 'tape'}
              onChange={handleChange}
            />
            Tape
          </label>
        </fieldset>

        {form.measurement_type === 'tape' ? (
          <div className="tape-inputs">
            <label>
              Length (ft)
              <input
                type="number"
                name="length"
                min="0"
                step="0.01"
                value={form.length}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Width (ft)
              <input
                type="number"
                name="width"
                min="0"
                step="0.01"
                value={form.width}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Height (ft)
              <input
                type="number"
                name="height"
                min="0"
                step="0.01"
                value={form.height}
                onChange={handleChange}
                required
              />
            </label>
            <p className="tape-result">
              Auto Calculated Tons: <strong>{form.measurment}</strong>
            </p>
          </div>
        ) : (
          <label>
            Measurement (tons)
            <input
              name="measurment"
              type="number"
              min="0"
              step="0.01"
              value={form.measurment}
              onChange={handleChange}
              required
            />
          </label>
        )}

        <input type="hidden" name="user_id" value={form.user_id} />

        <button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save Driver'}
        </button>

        {error && <div className="form-error">{error}</div>}
        {success && <div className="form-success">{success}</div>}
      </form>

      <h3 className="driver-list-title">Driver List</h3>
      <ul className="driver-list">
        {drivers.map((driver) => (
          <li key={driver.id}>
            <strong>{driver.name}</strong> - Truck: {driver.truck_no} - {driver.measurment} tons
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DriverForm;
