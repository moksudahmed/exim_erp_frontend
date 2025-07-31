import React, { useState, useEffect } from 'react';
import './styles/CashRegister.css';
import { fetchCashRegister, addCashRegister } from '../../api/cashregister';

const CashRegister = ({ openingBalance, setOpeningBalance, setCurrentBalance,currentBalance, setIsOpen, isOpen, token, isAuthenticated }) => {  
  const [cashInAmount, setCashInAmount] = useState(''); // Input for cash inflow
  const [cashOutAmount, setCashOutAmount] = useState(''); // Input for cash outflow 
  const [registerLog, setRegisterLog] = useState([]);
  
  useEffect(() => {
    const loadData = async () => {
      try {
        if (isAuthenticated && token) {     
         
          const fetchedCashRegister = await fetchCashRegister(token);
          //setUsers(fetchedUsers);         
          setRegisterLog(fetchedCashRegister);
         
        }
      } catch (error) {
        console.error('Failed to load data:', error.message);
      }
    };

    loadData();
  }, [isAuthenticated, token]);
  // Handle opening the register with a valid balance
  const handleOpenRegister = () => {
    if (openingBalance > 0) {
      const entry = {
        user_id: 1,
        action_type: 'OPEN',
        amount: parseFloat(openingBalance),
        description: 'Opening balance',
      };
      
      setIsOpen(true);
      setCurrentBalance(openingBalance);
      addCashRegister(entry, token);
    } else {
      alert('Please enter a valid opening balance.');
    }
  };

  // Handle closing the register and resetting the form
  const handleCloseRegister = () => {
    if (window.confirm('Are you sure you want to close the register?')) {
      //onCloseRegister(currentBalance);
      const entry = {
        user_id: 1,
        action_type: 'CLOSE',
        amount: parseFloat(currentBalance),
        description: 'Closing balance',
      };     
      addCashRegister(entry, token); 
      setIsOpen(false);
      resetForm();
    }
  };

  // Handle cash inflow
  const handleCashIn = () => {
    const amount = parseFloat(cashInAmount);
    if (amount > 0) {
      setCurrentBalance(prevBalance => prevBalance + amount);

      const entry = {
        user_id: 1,
        action_type: 'CASH_INFLOW',
        amount: parseFloat(amount),
        description: 'Cash in',
      };    
      //saveToDatabase('ADD', amount, 'Cash in');
      addCashRegister(entry, token); 
      //onCashIn(amount);
      setCashInAmount(''); // Clear input
    } else {
      alert('Please enter a valid cash in amount.');
    }
  };

  // Handle cash outflow
  const handleCashOut = () => {
    const amount = parseFloat(cashOutAmount);
    if (amount > 0 && amount <= currentBalance) {
      setCurrentBalance(prevBalance => prevBalance - amount);
     // onCashOut(amount);
      const entry = {
        user_id: 1,
        action_type: 'CASH_OUTFLOW',
        amount: parseFloat(amount),
        description: 'Cash out',
      };    
      //saveToDatabase('ADD', amount, 'Cash in');
      addCashRegister(entry, token); 
      setCashOutAmount(''); // Clear input
    } else if (amount > currentBalance) {
      alert('Insufficient funds for this cash out.');
    } else {
      alert('Please enter a valid cash out amount.');
    }
  };

  // Reset form fields
  const resetForm = () => {
    setOpeningBalance(0);
    setCashInAmount('');
    setCashOutAmount('');
    setCurrentBalance(0);
  };

  return (
    <div className="cash-register-container">
      <h1>Cash Register</h1>

      {!isOpen ? (
        <div className="open-register-section">
          <h2>Open Cash Register</h2>
          <div className="input-group">
            <input
              type="number"
              placeholder="Opening Balance"
              value={openingBalance}
              onChange={(e) => setOpeningBalance(parseFloat(e.target.value))}
            />
            <button onClick={handleOpenRegister}>Open Register</button>
          </div>
        </div>
      ) : (
        <div className="register-active-section">
          <h2>Register is Open</h2>
          <p className="current-balance">Current Balance: ${currentBalance.toFixed(2)}</p>

          <div className="cash-management">
            <div className="cash-in-section">
              <h3>Cash In</h3>
              <div className="input-group">
                <input
                  type="number"
                  placeholder="Cash In Amount"
                  value={cashInAmount}
                  onChange={(e) => setCashInAmount(e.target.value)}
                />
                <button onClick={handleCashIn}>Add Cash</button>
              </div>
            </div>

            <div className="cash-out-section">
              <h3>Cash Out</h3>
              <div className="input-group">
                <input
                  type="number"
                  placeholder="Cash Out Amount"
                  value={cashOutAmount}
                  onChange={(e) => setCashOutAmount(e.target.value)}
                />
                <button onClick={handleCashOut}>Withdraw Cash</button>
              </div>
            </div>
          </div>

          <button className="close-register-btn" onClick={handleCloseRegister}>
            Close Register
          </button>
        </div>
      )}

      <div className="register-log-section">
        <h2>Cash Register Log</h2>
        <table className="log-table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Amount</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {registerLog.length > 0 ? (
              registerLog.map((log, index) => (
                <tr key={index}>
                  <td>{log.action_type}</td>
                  <td>${log.amount.toFixed(2)}</td>
                  <td>{new Date(log.date).toLocaleString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3">No logs available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CashRegister;
