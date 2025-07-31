import React, { useState } from 'react';
import style from './styles/OrderSummary.module.css';

const OrderSummary = ({ cart, discount, onCompleteOrder }) => {
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [cashGiven, setCashGiven] = useState(0);
  const [cardNumber, setCardNumber] = useState('');

  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  const handleCashGivenChange = (event) => {
    setCashGiven(Number(event.target.value));
  };

  const handleCardNumberChange = (event) => {
    setCardNumber(event.target.value);
  };

  const handleCompleteOrder = (event) => {
    event.preventDefault();
    const totalAmount = cart.reduce((sum, item) => sum + item.total, 0);
    const discountedTotal = totalAmount * (1 - discount / 100);
    const paymentDetails = paymentMethod === 'cash' ? cashGiven : cardNumber;
    onCompleteOrder(paymentMethod, paymentDetails, discountedTotal);
  };

  return (
    <div className={style.orderSummaryContainer}>
      <h3>Payment</h3>
      <form onSubmit={handleCompleteOrder}>
        <div className={style.formField}>
          <label htmlFor="paymentMethod">Payment Method</label>
          <select id="paymentMethod" value={paymentMethod} onChange={handlePaymentMethodChange}>
            <option value="cash">Cash</option>
            <option value="card">Card</option>
          </select>
        </div>
        {paymentMethod === 'cash' && (
          <div className={style.formField}>
            <label htmlFor="cashGiven">Cash Given</label>
            <input
              type="number"
              id="cashGiven"
              value={cashGiven}
              onChange={handleCashGivenChange}
              min="0"
            />
          </div>
        )}
        {paymentMethod === 'card' && (
          <div className={style.formField}>
            <label htmlFor="cardNumber">Card Number</label>
            <input
              type="text"
              id="cardNumber"
              value={cardNumber}
              onChange={handleCardNumberChange}
            />
          </div>
        )}
        <button type="submit" className={style.btn}>Complete Order</button>
      </form>
    </div>
  );
};

export default OrderSummary;
