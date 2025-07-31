import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DeliveryForm = ({ sale, onSuccess }) => {
  const [stones, setStones] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    stone_id: '',
    total_weight: '',
    delivery_date: '',
    delivery_address: sale.customers?.address || '',
    contact_phone: sale.customers?.phone || '',
    notes: '',
    drivers: []
  });
  const [currentDriver, setCurrentDriver] = useState({
    driver_id: '',
    assigned_weight: '',
    base_fare: '',
    additional_costs: 0,
    notes: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [stonesRes, driversRes] = await Promise.all([
          axios.get('/api/stones'),
          axios.get('/api/drivers?status=available')
        ]);
        setStones(stonesRes.data);
        setDrivers(driversRes.data);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDriverInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentDriver(prev => ({ ...prev, [name]: value }));
  };

  const handleAddDriver = () => {
    if (!currentDriver.driver_id || !currentDriver.assigned_weight || !currentDriver.base_fare) {
      setError('Please fill all required fields for driver assignment');
      return;
    }

    setFormData(prev => ({
      ...prev,
      drivers: [...prev.drivers, currentDriver],
      total_weight: (parseFloat(prev.total_weight) || 0) + parseFloat(currentDriver.assigned_weight)
    }));

    setCurrentDriver({
      driver_id: '',
      assigned_weight: '',
      base_fare: '',
      additional_costs: 0,
      notes: ''
    });
  };

  const handleRemoveDriver = (index) => {
    const removedWeight = formData.drivers[index].assigned_weight;
    setFormData(prev => ({
      ...prev,
      drivers: prev.drivers.filter((_, i) => i !== index),
      total_weight: (parseFloat(prev.total_weight) || 0) - parseFloat(removedWeight)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      const payload = {
        ...formData,
        drivers: formData.drivers.map(driver => ({
          ...driver,
          assigned_weight: parseFloat(driver.assigned_weight),
          base_fare: parseFloat(driver.base_fare),
          additional_costs: parseFloat(driver.additional_costs || 0)
        }))
      };

      const response = await axios.post(`/api/sales/${sale.id}/delivery`, payload);
      onSuccess(response.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="delivery-form">
      <h3>Create Delivery for Sale #{sale.id}</h3>
      {error && <div className="error">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Stone:</label>
          <select 
            name="stone_id" 
            value={formData.stone_id} 
            onChange={handleInputChange}
            required
          >
            <option value="">Select Stone</option>
            {stones.map(stone => (
              <option key={stone.id} value={stone.id}>
                {stone.name} (Available: {stone.available_quantity} tons)
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Total Weight (tons):</label>
          <input
            type="number"
            step="0.01"
            min="0.01"
            name="total_weight"
            value={formData.total_weight}
            onChange={handleInputChange}
            required
            readOnly
          />
        </div>

        <div className="form-group">
          <label>Delivery Date:</label>
          <input
            type="datetime-local"
            name="delivery_date"
            value={formData.delivery_date}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Delivery Address:</label>
          <textarea
            name="delivery_address"
            value={formData.delivery_address}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Contact Phone:</label>
          <input
            type="tel"
            name="contact_phone"
            value={formData.contact_phone}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Notes:</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
          />
        </div>

        <h4>Assign Drivers</h4>
        
        <div className="driver-assignment">
          <div className="form-group">
            <label>Driver:</label>
            <select
              name="driver_id"
              value={currentDriver.driver_id}
              onChange={handleDriverInputChange}
            >
              <option value="">Select Driver</option>
              {drivers.map(driver => (
                <option key={driver.id} value={driver.id}>
                  {driver.name} (Truck: {driver.truck_no}, Capacity: {driver.capacity || 'N/A'} tons)
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Weight to Assign (tons):</label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              name="assigned_weight"
              value={currentDriver.assigned_weight}
              onChange={handleDriverInputChange}
            />
          </div>

          <div className="form-group">
            <label>Base Fare:</label>
            <input
              type="number"
              step="0.01"
              min="0"
              name="base_fare"
              value={currentDriver.base_fare}
              onChange={handleDriverInputChange}
            />
          </div>

          <div className="form-group">
            <label>Additional Costs:</label>
            <input
              type="number"
              step="0.01"
              min="0"
              name="additional_costs"
              value={currentDriver.additional_costs}
              onChange={handleDriverInputChange}
            />
          </div>

          <div className="form-group">
            <label>Notes:</label>
            <textarea
              name="notes"
              value={currentDriver.notes}
              onChange={handleDriverInputChange}
            />
          </div>

          <button 
            type="button" 
            onClick={handleAddDriver}
            disabled={!currentDriver.driver_id || !currentDriver.assigned_weight || !currentDriver.base_fare}
          >
            Add Driver
          </button>
        </div>

        <h5>Assigned Drivers</h5>
        {formData.drivers.length === 0 ? (
          <p>No drivers assigned yet</p>
        ) : (
          <ul className="driver-list">
            {formData.drivers.map((driver, index) => {
              const driverInfo = drivers.find(d => d.id === parseInt(driver.driver_id));
              return (
                <li key={index}>
                  <div>
                    <strong>{driverInfo?.name || 'Unknown Driver'}</strong>
                    <div>Assigned Weight: {driver.assigned_weight} tons</div>
                    <div>Fare: ₹{driver.base_fare} (Base) + ₹{driver.additional_costs} (Extra)</div>
                    {driver.notes && <div>Notes: {driver.notes}</div>}
                  </div>
                  <button 
                    type="button" 
                    onClick={() => handleRemoveDriver(index)}
                    className="remove-btn"
                  >
                    Remove
                  </button>
                </li>
              );
            })}
          </ul>
        )}

        <button 
          type="submit" 
          disabled={!formData.stone_id || formData.drivers.length === 0}
          className="submit-btn"
        >
          Create Delivery
        </button>
      </form>
    </div>
  );
};

export default DeliveryForm;