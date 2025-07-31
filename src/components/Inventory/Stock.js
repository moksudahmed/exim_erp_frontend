import React, { useState } from 'react';
import style from './styles/Stock.module.css';


const Stock = ({ products, onUpdateStock, onDeductDamaged, onAddInventory }) => {
  const [stockLevels, setStockLevels] = useState(
    products.reduce((acc, product) => {
      acc[product.title] = { add: '', damage: '' };
      return acc;
    }, {})
  );

  const handleStockChange = (event, productTitle, type) => {
    setStockLevels((prevLevels) => ({
      ...prevLevels,
      [productTitle]: {
        ...prevLevels[productTitle],
        [type]: Number(event.target.value),
      }
    }));
  };

  const handleUpdateStock = (event) => {
    event.preventDefault();    
    Object.keys(stockLevels).forEach((productTitle) => {
      const stockToAdd = stockLevels[productTitle].add;
      const damagedStock = stockLevels[productTitle].damage;
      
      if (stockToAdd !== '') {
        onAddInventory(productTitle, stockToAdd);       
      }
      if (damagedStock !== '') {       
        onDeductDamaged(productTitle, damagedStock);
       
      }
    });

    // Reset form after updating stock
    setStockLevels(
      products.reduce((acc, product) => {
        acc[product.title] = { add: '', damage: '' };
        return acc;
      }, {})
    );
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
              <th>Stock to Add</th>
              <th>Damaged Stock</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.title}</td>
                <td>{product.stock}</td>
                <td>
                  <input
                    type="number"
                    value={stockLevels[product.title].add || ''}
                    onChange={(e) => handleStockChange(e, product.title, 'add')}
                    min="0"
                    className={style.input}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={stockLevels[product.title].damage || ''}
                    onChange={(e) => handleStockChange(e, product.title, 'damage')}
                    min="0"
                    className={style.input}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className={style.buttonContainer}>
          <button type="submit" className={style.btn}>Update Stock</button>
          <button type="reset" className={`${style.btn} ${style.cancelBtn}`}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default Stock;
