import React from 'react';
import style from './CartItems.module.css';

const CartItems = ({ items, cartTotal, onRemoveItem }) => {
  return (
    <div className={style.cartContainer}>
      <h2>Cart Items</h2>
      {items.length === 0 ? (
        <p className={style.emptyMessage}>Your cart is empty</p>
      ) : (
        <div className={style.cartList}>
          {items.map((cartItem) => {
            const { item } = cartItem;
            if (!item) return null;

            return (
              <div key={cartItem.id} className={style.cartItem}>
                <div className={style.itemDetails}>
                  <h3>{item.product}</h3>
                  <p>Quantity: {item.qty}</p>
                  <p>Unit Price: ${item.unitPrice.toFixed(2)}</p>
                  <p>Discount: {item.discount}%</p>
                  <p>Subtotal: ${(item.qty * item.unitPrice * (1 - item.discount / 100)).toFixed(2)}</p>
                </div>
                <button
                  className={style.removeButton}
                  onClick={() => onRemoveItem(cartItem.id)}
                >
                  Remove
                </button>
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
