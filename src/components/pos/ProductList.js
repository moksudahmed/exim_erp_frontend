import React from 'react';
import style from './styles/POS.module.css';

const ProductList = ({ products, cart, setCart, onUpdateStock, quantity, discount, handleUpdateQuantity }) => {

  const handleProductClick = (id) => {
    const product = products.find((p) => p.id === id);
    const cartItem = cart.find((p) => p.product_id === id);
    if (cartItem) {          
      handleUpdateQuantity(id, cartItem.quantity + 1); // Increase the quantity by 1
      onUpdateStock(product.title, -1); // Decrease the stock by 1      
    } else {
      if (product) {
        const total = product.price_per_unit * quantity;
        const newItem = {
          product_id: product.id,
          product: product.title,
          quantity,
          price_per_unit: product.price_per_unit,
          total_price: total,
         // discount,
        };
        setCart((prevCart) => [...prevCart, newItem]); // Add the new item to the cart
        onUpdateStock(product.title, -quantity); // Decrease the stock by the quantity selected
      }
    }
   
    
  };

  return (
    <div className={style.categorySection}>
      {products.map((product) => (
        <div
          key={product.id}
          className={style.categoryButton}
          onClick={() => handleProductClick(product.id)}
        >
          {product.title}
        </div>
      ))}
    </div>
  );
};

export default ProductList;
