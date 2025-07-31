import React from 'react';
import style from './styles/POS.module.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Cart = ({ cart, handleRemoveItem, handleUpdateQuantity, handleUpdateDiscount }) => {
  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity > 0) {
      handleUpdateQuantity(productId, newQuantity);
    }
  };
  const handleDiscountChange = (productId, discount) => {
    //if (newQuantity > 0) {
      handleUpdateDiscount(productId, discount);
    //}
  };

  return (
    <div className={style.orderItems}>
      <table className={style.orderTable}>
        <thead className={style.scrollableTbody}>
          <tr>
            <th>Name</th>
            <th>Qty</th>
            <th>Each</th>
          {/*   <th>Discount</th>*/}
            <th>Total</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody className={style.scrollableTbody}>
          {cart.map((item) => (
            <tr key={item.product_id}>
              <td>{item.product}</td>
              <td>
                <div className={style.quantityContainer}>
                  <button
                    className={style.quantityButton}
                    onClick={() => handleQuantityChange(item.product_id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    −
                  </button>
                  <input
                    type="number"
                    value={item.quantity}
                    min="1"
                    className={style.quantityInput}
                    onChange={(e) => handleQuantityChange(item.product_id, parseInt(e.target.value))}
                  />
                  <button
                    className={style.quantityButton}
                    onClick={() => handleQuantityChange(item.product_id, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>
              </td>


              <td>${item.total_price ? item.total_price.toFixed(2) : '0.00'}</td>
             {/* <td>$
                  <input
                  type="number"
                  value={item.discount}
                  min="1"
                  className={style.quantityInput}
                  onChange={(e) => handleDiscountChange(item.product_id, parseInt(e.target.value))}
                />
              </td>*/}
              <td>${(item.price_per_unit * item.quantity).toFixed(2)}</td>
              <td className={style.actionCell}>
                <button
                  className={style.removeButton}
                  onClick={() => handleRemoveItem(item.product_id)}
                >
                  <i className="fas fa-trash-alt"></i>
                </button>
              </td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Cart;
