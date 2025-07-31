import React, { useState } from 'react';
import style from './styles/POS.module.css';
import DropDownItem from './DropDownItem';

const SelectItem = ({ products, selectedProduct, quantity, setSelectedProduct, cart, setCart, onUpdateStock, setQuantity }) => {
  
  const handleAddToCart = (event) => {
    event.preventDefault(); 
    let id = parseInt(selectedProduct, 10);
    const product = products.find((p) => p.id === id);
    const cartItem = cart.find((item) => item.product_id === id);
    
    if (product) {
      if (cartItem) {
        // If the item is already in the cart, update the quantity
        const updatedCart = cart.map((item) =>
          item.product_id === id
            ? { ...item, quantity: item.quantity + quantity, total: item.total + product.price_per_unit * quantity }
            : item
        );
        console.log(updatedCart);
        setCart(updatedCart);
      } else {
        // If the item is not in the cart, add it as a new item
        const total = product.price_per_unit * quantity;
        const newItem = {
          product_id: product.id,
          product: product.title,
          quantity: quantity,
          price_per_unit: product.price_per_unit,
          total_price: total,
          //discount: 0, // Default discount for the item
        };
        setCart((prevCart) => [...prevCart, newItem]);
      }
      onUpdateStock(product.id, -quantity);
      setSelectedProduct('');
      setQuantity(1);
    }
  };

  const handleQuantityChange = (event) => {
    setQuantity(Number(event.target.value));
  };

  return (
    <form className={`${style.form} ${style.inlineForm}`} onSubmit={handleAddToCart} style={{ display: 'flex', alignItems: 'center' }}>
      <DropDownItem products={products} selectedProduct={selectedProduct} setSelectedProduct={setSelectedProduct} />
      <div className={`${style.formField} ${style.quantityField}`} style={{ marginLeft: '10px' }}>
        <label htmlFor="quantity" style={{ marginRight: '5px' }}>Quantity</label>
        <input
          type="number"
          id="quantity"
          value={quantity}
          onChange={handleQuantityChange}
          min="1"
          style={{ width: '60px' }}
        />
      </div>
      <div className={`${style.formField} ${style.buttonField}`} style={{ marginLeft: '10px' }}>
        <button type="submit" className={style.btn} style={{ padding: '20px 20px' }}>
          +
        </button>
      </div>
    </form>
  );
}

export default SelectItem;
