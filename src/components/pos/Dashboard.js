import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { FaBell, FaUserCircle } from 'react-icons/fa';
import style from './styles/Dashboard.module.css';
import { fetchProductsCategory } from '../../api/products';
import { fetchCustomerSummary } from '../../api/customer';
import { fetchPaymentsSummary } from '../../api/payment';

const Dashboard = ({ sales = [], inventory = [], recentTransactions = [], currentBalance, isOpen, token, isAuthenticated }) => {
  const [selectedMenu, setSelectedMenu] = useState('overview');
  const [productsCategory, setProductsCategory] = useState([]);
  const [customersSummary, setCustomersSummary] = useState([]);
  const [paymentSummary, setPaymentsSummary] = useState([]);
  useEffect(() => {
      const loadData = async () => {
        try {
          if (isAuthenticated && token) {
            const fetchedCategory = await fetchProductsCategory(token);         
            setProductsCategory(fetchedCategory);     
            
            const customersSummary = await fetchCustomerSummary(token);
            setCustomersSummary(customersSummary);

            const paymentSummary = await fetchPaymentsSummary(token);
            setPaymentsSummary(paymentSummary);
          }
        } catch (error) {
          console.error('Failed to load data:', error.message);
        }
      };
  
      loadData();
    }, [isAuthenticated , token]);
  const totalSales = sales.length > 0 ? sales.reduce((acc, sale) => acc + (sale.total || 0), 0).toFixed(2) : '0.00';

  const totalItemsSold = sales.length > 0
    ? sales.reduce((acc, sale) => 
        acc + (Array.isArray(sale.sale_products) ? sale.sale_products.reduce((sum, item) => sum + (item.quantity || 0), 0) : 0)
      , 0)
    : 0;

  const chartData = sales.map(sale => ({
    date: new Date(sale.date).toLocaleDateString(),
    total: sale.total || 0
  }));

  const salesByMonth = sales.reduce((acc, sale) => {
    const month = new Date(sale.date).toLocaleString('default', { month: 'short' });
    if (!acc[month]) {
      acc[month] = 0;
    }
    acc[month] += sale.total || 0;
    return acc;
  }, {});

  const salesByMonthData = Object.keys(salesByMonth).map(month => ({
    month,
    total: salesByMonth[month]
  }));

  const inventoryData = inventory.map(item => ({
    name: item.title,
    stock: item.stock
  }));

  if (!Array.isArray(paymentSummary)) {
    return <p>No valid payment summary data.</p>;
  }

  return (
    <div className={style.dashboardContainer}>
      <header className={style.header}>
        <div className={style.toolbar}>
          <h1 className={style.title}>Dashboard</h1>
          <nav className={style.menu}>
            <ul>
              <li className={selectedMenu === 'overview' ? style.activeMenuItem : ''} onClick={() => setSelectedMenu('overview')}>Overview</li>
              <li className={selectedMenu === 'transactions' ? style.activeMenuItem : ''} onClick={() => setSelectedMenu('transactions')}>Recent Transactions</li>
              <li className={selectedMenu === 'inventory' ? style.activeMenuItem : ''} onClick={() => setSelectedMenu('inventory')}>Inventory Status</li>
            </ul>
          </nav>
         
        </div>
      </header>

      {selectedMenu === 'overview' && (
        <>
          <section className={style.summarySection}>
            <div className={style.summaryCard}>
              <h3>Customer</h3>
              <p>{customersSummary}</p>
            </div>
            <div className={style.summaryCard}>
              <h3>Product Category</h3>
              <p>{productsCategory}</p>
            </div>
            <div className={style.summaryCard}>
              <h3>Total Sales</h3>
              <p>${totalSales}</p>
            </div>
            <div className={style.summaryCard}>
              <h3>Payment Summary</h3>
              <p> {paymentSummary.length > 0 ? (
                    <table className="summary-table">
                      <thead>
                        <tr>
                          <th>Payment Method</th>
                          <th>Total Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paymentSummary.map((entry, index) => (
                          <tr key={index}>
                            <td>{entry[1]}</td>
                            <td className={entry[0] < 0 ? 'amount-negative' : 'amount-positive'}>
                              {Number(entry[0]).toLocaleString(undefined, {
                                style: 'currency',
                                currency: 'BDT',
                                minimumFractionDigits: 0,
                              })}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p>No payment summary available.</p>
                  )}
               </p>
            </div>
            <div className={style.summaryCard}>
              <h3>Current Balance</h3>
              <p>${currentBalance.toFixed(2)}</p>
            </div>
            <div className={style.summaryCard}>
              <h3>Total Items Sold</h3>
              <p>{totalItemsSold}</p>
            </div>
            <div className={style.summaryCard}>
              <h3>Total Transactions</h3>
              <p>{sales.length}</p>
            </div>
            
            {/*<div className={style.summaryCard}>
              {!isOpen ? (
                <span className={`${style.badge} ${style.badge_close}`}>Close</span>
              ) : (
                <span className={`${style.badge} ${style.badge_open}`}>Open</span>
              )}
            </div>*/}
          </section>

          <section className={style.chartsSection}>
            <div className={style.chartContainer}>
              <h2>Sales Over Time</h2>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="total" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className={style.chartContainer}>
              <h2>Sales by Month</h2>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={salesByMonthData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="total" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className={style.chartContainer}>
              <h2>Inventory Stock Levels</h2>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie data={inventoryData} dataKey="stock" nameKey="name" outerRadius={150} fill="#8884d8" label>
                    {inventoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.stock > 50 ? "#82ca9d" : "#ff6347"} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </section>
        </>
      )}

      {selectedMenu === 'transactions' && (
        <section className={style.recentTransactions}>
          <h2>Recent Transactions</h2>
          <table className={style.transactionsTable}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Items</th>
                <th>Discount</th>
                <th>Total</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentTransactions.length > 0 ? (
                recentTransactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td>{transaction.id}</td>
                    <td>
                      {Array.isArray(transaction.items) ? transaction.items.map((item) => (
                        <div key={item.id} className={style.itemDetails}>
                          {item.product} x {item.quantity}
                        </div>
                      )) : 'No items available'}
                    </td>
                    <td>${transaction.discount}</td>
                    <td>${transaction.total.toFixed(2)}</td>
                    <td>{new Date(transaction.date).toLocaleString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className={style.noTransactions}>No recent transactions</td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
      )}

      {selectedMenu === 'inventory' && (
        <section className={style.inventoryStatus}>
          <h2>Inventory Status</h2>
          <table className={style.inventoryTable}>
            <thead>
              <tr>
                <th>Product</th>
                <th>Stock</th>
              </tr>
            </thead>
            <tbody>
              {inventory.length > 0 ? (
                inventory.map((item) => (
                  <tr key={item.id}>
                    <td>{item.title}</td>
                    <td>{item.stock}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2" className={style.noInventory}>No inventory data available</td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
      )}
    </div>
  );
};

Dashboard.propTypes = {
  sales: PropTypes.array,
  inventory: PropTypes.array,
  recentTransactions: PropTypes.array,
  currentBalance: PropTypes.number,
  isOpen: PropTypes.bool,
};

export default Dashboard;
