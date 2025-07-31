import React from 'react';
import style from './styles/Cart.module.css';

const Cart = ({ cart, discount, setDiscount }) => {
  const handleDiscountChange = (event) => {
    setDiscount(Number(event.target.value));
  };

  return (
    <div className={style.cartContainer}>
      <h2>Cart Items</h2>
      <table className={style.cartTable}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Qty</th>
            <th>Each</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {cart.map((item) => (
            <tr key={item.id}>
              <td>{item.title}</td>
              <td>{item.quantity}</td>
              <td>${item.unitPrice.toFixed(2)}</td>
              <td>${item.total.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className={style.summarySection}>
        <div className={style.summaryItem}>
          <span>Credits:</span> <span>$0.00</span>
        </div>
        <div className={style.summaryItem}>
          <span>Discounts:</span>
          <input type="number" value={discount} onChange={handleDiscountChange} min="0" max="100" className={style.discountInput} />
        </div>
        <div className={style.summaryItem}>
          <span>Tips (0%):</span> <span>$0.00</span>
        </div>
        <div className={style.summaryItem}>
          <span>Subtotal:</span> <span>${cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0).toFixed(2)}</span>
        </div>
        <div className={style.summaryItem}>
          <span>Tax:</span> <span>$0.00</span>
        </div>
        <div className={style.summaryItem}>
          <span>Balance Due:</span> <span>${(cart.reduce((sum, item) => sum + item.total, 0) * (1 - discount / 100)).toFixed(2)}</span>
        </div>
        <div className={style.summaryTotal}>
          <span>Total:</span> <span>${(cart.reduce((sum, item) => sum + item.total, 0) * (1 - discount / 100)).toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default Cart;
