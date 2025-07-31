import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DeliveryForm from './DeliveryForm';

// Define DeliveryStatus enum if not already available from another module
const DeliveryStatus = {
  pending: 'pending',
  scheduled: 'scheduled',
  in_progress: 'in_progress',
  delivered: 'delivered',
  cancelled: 'cancelled'
};

const SalesWithDelivery = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showDeliveryForm, setShowDeliveryForm] = useState(null);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/sales?include=delivery');
        setSales(response.data);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSales();
  }, []);

  const handleDeliveryCreated = (saleId, delivery) => {
    setSales(prev => prev.map(sale => 
      sale.id === saleId ? { ...sale, delivery } : sale
    ));
    setShowDeliveryForm(null);
  };

  const updateDeliveryStatus = async (saleId, status) => {
    try {
      setLoading(true);
      const sale = sales.find(s => s.id === saleId);
      if (!sale.delivery) return;
      
      await axios.put(`/api/deliveries/${sale.delivery.id}/status`, { status });
      const updatedSales = sales.map(s => 
        s.id === saleId ? { ...s, delivery: { ...s.delivery, status } } : s
      );
      setSales(updatedSales);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="sales-delivery-container">
      <h2>Sales with Delivery Information</h2>
      
      <table className="sales-table">
        <thead>
          <tr>
            <th>Sale ID</th>
            <th>Customer</th>
            <th>Total</th>
            <th>Payment Status</th>
            <th>Delivery Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sales.map(sale => (
            <React.Fragment key={sale.id}>
              <tr>
                <td>{sale.id}</td>
                <td>{sale.customers?.name}</td>
                <td>₹{sale.total}</td>
                <td>{sale.payment_status}</td>
                <td>
                  {sale.delivery ? (
                    <select
                      value={sale.delivery.status}
                      onChange={(e) => updateDeliveryStatus(sale.id, e.target.value)}
                    >
                      {Object.values(DeliveryStatus).map(status => (
                        <option key={status} value={status}>
                          {status.replace('_', ' ')}
                        </option>
                      ))}
                    </select>
                  ) : (
                    'Not scheduled'
                  )}
                </td>
                <td>
                  {!sale.delivery ? (
                    <button onClick={() => setShowDeliveryForm(sale.id)}>
                      Schedule Delivery
                    </button>
                  ) : (
                    <button onClick={() => setShowDeliveryForm(sale.id)}>
                      View Delivery
                    </button>
                  )}
                </td>
              </tr>
              {showDeliveryForm === sale.id && (
                <tr>
                  <td colSpan="6">
                    {sale.delivery ? (
                      <div className="delivery-details">
                        <h4>Delivery Details</h4>
                        <p>Stone: {sale.delivery.stone.name}</p>
                        <p>Total Weight: {sale.delivery.total_weight} tons</p>
                        <p>Delivery Address: {sale.delivery.delivery_address}</p>
                        <p>Contact Phone: {sale.delivery.contact_phone}</p>
                        
                        <h5>Assigned Drivers</h5>
                        <ul>
                          {sale.delivery.drivers.map(driver => (
                            <li key={driver.id}>
                              {driver.driver.name}: {driver.assigned_weight} tons
                              (₹{driver.base_fare} + ₹{driver.additional_costs})
                              - Status: {driver.status}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <DeliveryForm 
                        sale={sale} 
                        onSuccess={(delivery) => handleDeliveryCreated(sale.id, delivery)}
                        onCancel={() => setShowDeliveryForm(null)}
                      />
                    )}
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SalesWithDelivery;