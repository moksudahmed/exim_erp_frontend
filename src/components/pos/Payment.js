import React from 'react';
import style from './styles/POS.module.css';
import CardPayment from './CardPayment';
import CashPayment from './CashPayment';
import BankPayment from './BankPayment';
import BikashPayment from './BikashPayment';

const Payment = ({ paymentMethod, setPaymentMethod, setCashGiven, setCardNumber, cashGiven, cardNumber, totalAmount, changeAmount, 
  setChangeAmount, chequeNumber, setChequeNumber,bikashNumber, setBikasNumber}) => {

  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);    
  };

  return (
    <div className={style.paymentArea}>
      <div className={style.paymentMethodContainer}>
          <h3 className={style.paymentTitle}>Payment Area</h3>
      </div>
      

      {/* Payment Method Selection */}
      <div className={style.paymentMethodContainer}>
        <div className={style.paymentMethod}>
          <label htmlFor="paymentMethod" className={style.paymentLabel}>Payment Method</label>
          <select 
            id="paymentMethod" 
            value={paymentMethod} 
            onChange={handlePaymentMethodChange} 
            className={style.paymentSelect}
          >
            <option value="cash">Cash</option>
            <option value="credit">Credit</option>                               
            <option value="bank_transfer">Bank</option>
            <option value="bkash">Bkash</option>
           {/* <option value="bkash">Bkash</option>
            <option value="credit_card">Credit Card</option>      
            <option value="nagad">Nagad</option>
            <option value="online">Online</option>*/}
            <option value="other">Other</option>            
          </select>
        </div>

        {/* Payment Inputs Based on Selected Method */}
        
      </div>
      <div className={style.paymentDetails}>
          {paymentMethod === 'cash' && (
            <CashPayment setCashGiven={setCashGiven} cashGiven={cashGiven} totalAmount={totalAmount} changeAmount={changeAmount} setChangeAmount={setChangeAmount}/>
          )}
          {paymentMethod === 'credit_card' && (
            <CardPayment setCardNumber={setCardNumber} cardNumber={cardNumber} />
          )}
          {paymentMethod === 'bank_transfer' && (
            <BankPayment chequeNumber={chequeNumber} setChequeNumber={setChequeNumber} />
          )}
           {paymentMethod === 'bkash' && (
            <BikashPayment bikashNumber={bikashNumber} setBikasNumber={setBikasNumber}/>
          )}
          
        </div>
    </div>
  );
};

export default Payment;
