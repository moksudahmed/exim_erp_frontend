import React, { useState } from "react";
import style from "./Cart.module.css";

const Cart = ({ products, onAddToCart, onCompleteOrder }) => {
  const [item, setItem] = useState({
    product: '',
    qty: 1,
    unitPrice: 0.00,
    discount: 0
  });

  const { qty, unitPrice, discount } = item;
  const [selectedItem, setSelectedItem] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setItem((oldItem) => ({
      ...oldItem,
      [name]: value
    }));
  };

  const handleProductChange = (event) => {
    const product = event.target.value;
    const selectedProduct = products.find(p => p.title === product);
    const unitPrice = selectedProduct ? selectedProduct.unitPrice : 0.00;
    setSelectedItem(product);
    setItem((oldItem) => ({
      ...oldItem,
      product,
      unitPrice
    }));
  };

  const handleAddToCart = (event) => {
    event.preventDefault();
    onAddToCart((prevItems) => {
      const existingItem = prevItems.find(cartItem => cartItem.item.product === item.product);

      if (existingItem) {
        return prevItems.map(cartItem =>
          cartItem.item.product === item.product
            ? { ...cartItem, item: { ...cartItem.item, qty: cartItem.item.qty + item.qty } }
            : cartItem
        );
      }

      return [...prevItems, { id: prevItems.length + 1, item }];
    });

    setItem({ product: '', qty: 1, unitPrice: 0.00, discount: 0 });
    setSelectedItem('');
  };

  const handleCompleteOrder = (event) => {
    event.preventDefault();
    onCompleteOrder();
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleAddToCart(event);
    }
  };

  return (
    <form className={style.form} onSubmit={handleCompleteOrder} onKeyPress={handleKeyPress}>
      <div className={style["form-field"]}>
        <label htmlFor="product">Product: </label>
        <select value={selectedItem} onChange={handleProductChange}>
          <option value="" disabled>Select a product</option>
          {products.map((item) => (
            <option key={item.id} value={item.title}>{item.title}</option>
          ))}
        </select>
      </div>
      <div className={style["form-field"]}>
        <label htmlFor="qty">Quantity: </label>
        <input
          type="number"
          id="qty"
          name="qty"
          value={qty}
          onChange={handleChange}
        />
        <label htmlFor="unitPrice">Unit Price: </label>
        <input
          type="number"
          id="unitPrice"
          name="unitPrice"
          value={unitPrice}
          onChange={handleChange}
          disabled
        />
        <label htmlFor="discount">Discount (%): </label>
        <input
          type="number"
          id="discount"
          name="discount"
          value={discount}
          onChange={handleChange}
        />
        <button type="button" className={style.btn} onClick={handleAddToCart}>Add to Cart</button>
        <button type="submit" className={style.btn}>Complete Order</button>
      </div>
    </form>
  );
}

export default Cart;
