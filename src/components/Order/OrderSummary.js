import React from 'react';
import style from './OrderSummary.module.css';

const OrderSummary = ({ items, total }) => {
  return (
    <div className={style.summaryContainer}>
      <h2>Order Summary</h2>
      {items.length === 0 ? (
        <p className={style.emptyMessage}>No items in the cart</p>
      ) : (
        <div className={style.summaryList}>
          {items.map((cartItem) => {
            // Ensure that cartItem.item is defined
            const { item } = cartItem;
            if (!item) return null; // Skip if item is not defined

            return (
              <div key={cartItem.id} className={style.summaryItem}>
                <div className={style.itemDetails}>
                  <h3>{item.product}</h3>
                  <p>Quantity: {item.qty}</p>
                  <p>Unit Price: ${item.unitPrice.toFixed(2)}</p>
                  <p>Discount: {item.discount}%</p>
                  <p>Subtotal: ${(item.qty * item.unitPrice * (1 - item.discount / 100)).toFixed(2)}</p>
                </div>
              </div>
            );
          })}
          <div className={style.summaryTotal}>
            <h3>Total Amount Due: ${total.toFixed(2)}</h3>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderSummary;
