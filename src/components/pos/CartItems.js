import React from 'react';
import style from './styles/CartItems.module.css';

const CartItems = ({ items, cartTotal }) => {
  return (
    <div className={style.cartContainer}>
      <h2>Cart Items</h2>
      {items.length === 0 ? (
        <p className={style.emptyMessage}>Your cart is empty</p>
      ) : (
        <div className={style.cartList}>
          {items.map((cartItem, index) => {
            return (
              <div key={index} className={style.cartItem}>
                <div className={style.itemDetails}>
                  <span>{cartItem.product} - </span>
                  <span>Qty: {cartItem.qty}, </span>
                  <span>Unit Price: ${cartItem.unitPrice.toFixed(2)}, </span>
                  <span>Discount: {cartItem.discount}%, </span>
                  <span>Subtotal: ${(cartItem.qty * cartItem.unitPrice * (1 - cartItem.discount / 100)).toFixed(2)}</span>
                </div>
              </div>
            );
          })}
          <div className={style.cartTotal}>
            <h3>Total: ${cartTotal.toFixed(2)}</h3>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartItems;
