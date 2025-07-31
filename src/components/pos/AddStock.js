import React, { useState } from 'react';
import style from './styles/Stock.module.css';

const AddStock = ({ products, onUpdateStock }) => {
  const [stockLevels, setStockLevels] = useState(
    products.reduce((acc, product) => {
      acc[product.title] = product.stockLevel;
      return acc;
    }, {})
  );

  const handleStockChange = (event, productTitle) => {
    setStockLevels((prevLevels) => ({
      ...prevLevels,
      [productTitle]: Number(event.target.value)
    }));
  };

  const handleUpdateStock = (event) => {
    event.preventDefault();
    Object.keys(stockLevels).forEach((productTitle) => {
      const stockToAdd = stockLevels[productTitle];
      if (stockToAdd !== undefined) {
        onUpdateStock(productTitle, stockToAdd - products.find(p => p.title === productTitle).stockLevel);
      }
    });
  };

  return (
    <div className={style.stockContainer}>
      <h1>Stock Management</h1>
      <form className={style.form} onSubmit={handleUpdateStock}>
        <table className={style.stockTable}>
          <thead>
            <tr>
              <th>Product</th>
              <th>Current Stock</th>
              <th>New Stock Level</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.title}</td>
                <td>{product.stockLevel}</td>
                <td>
                  <input
                    type="number"
                    value={stockLevels[product.title] || ''}
                    onChange={(e) => handleStockChange(e, product.title)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button type="submit" className={style.btn}>Update Stock</button>
      </form>
    </div>
  );
};

export default AddStock;
