import React, { useState } from 'react';
import style from './styles/POS.module.css';

const CashPayment = ({ setCashGiven, cashGiven, totalAmount, changeAmount, setChangeAmount }) => {
  const [inputValue, setInputValue] = useState(cashGiven.toString());

  // Handle changes in the input field
  const handleInputChange = (event) => {
    setInputValue(event.target.value);
    //console.log(Number(inputValue - totalAmount.toFixed(2) ) || 0);
    
  };

  // Handle clicks on the virtual number pad
  const handleNumberClick = (value) => {
    setInputValue((prev) => prev + value);
  };

  // Clear the input
  const handleClear = () => {
    setInputValue('');
    setChangeAmount(0);
  };

  // Apply the entered value
  const handleApply = () => {
    setCashGiven(Number(inputValue) || 0);
    setChangeAmount(totalAmount.toFixed(2) - (Number(inputValue) || 0));
  };

  return (    
    <div className={style.paymentDetails}>
          
        
    <div className={style.cashSection}>
        <table className={style.orderSummaryTable}>
        <thead>
          <tr>
            <th>Cash Receive</th>
            <th><input
                  type="text"
                  id="cashGiven"
                  value={inputValue}
                  onChange={handleInputChange}
                  className={style.cashInput}
                />
          </th>
          </tr>
          <tr>
            <th style={{ fontSize: '24px', fontWeight: 'bold', color: 'red' }}>Change: $</th>
            <th style={{ fontSize: '24px', fontWeight: 'bold', color: 'red' }}>{changeAmount.toFixed(2) || 0}</th>
          </tr>
        </thead>
        </table>
      {/* Virtual Number Keyboard */}
      <div className={style.numberKeyboard}>
        <div className={style.keyboardRow}>
          {[1, 2, 3].map((num) => (
            <button key={num} onClick={() => handleNumberClick(num.toString())}>
              {num}
            </button>
          ))}
        </div>
        <div className={style.keyboardRow}>
          {[4, 5, 6].map((num) => (
            <button key={num} onClick={() => handleNumberClick(num.toString())}>
              {num}
            </button>
          ))}
        </div>
        <div className={style.keyboardRow}>
          {[7, 8, 9].map((num) => (
            <button key={num} onClick={() => handleNumberClick(num.toString())}>
              {num}
            </button>
          ))}
        </div>
        
      </div>
    </div>
    <div className={style.cashSection}>
        <div className={style.keyboardRow}>
          <button onClick={handleClear}>C</button>
          <button onClick={() => handleNumberClick('0')}>0</button>
          <button onClick={handleApply} style={{ backgroundColor: '#ff4c4c', color: 'white' }}>=</button>
        </div>
    </div>
    </div>
  );
};

export default CashPayment;
