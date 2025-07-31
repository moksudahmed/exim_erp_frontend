import React, { useState } from 'react';
import styles from './styles/Inventory.module.css';

const Inventory = ({ products, onUpdateStock, onDeductDamaged, onAddProduct }) => {
  const [stockLevels, setStockLevels] = useState(
    products.reduce((acc, product) => {
      acc[product.title] = '';
      return acc;
    }, {})
  );
  const [damagedLevels, setDamagedLevels] = useState(
    products.reduce((acc, product) => {
      acc[product.title] = '';
      return acc;
    }, {})
  );
  const [newProduct, setNewProduct] = useState({ title: '', stock: 0, price: 0 });

  // Handle stock change
  const handleStockChange = (event, productTitle) => {
    setStockLevels((prevLevels) => ({
      ...prevLevels,
      [productTitle]: Number(event.target.value),
    }));
  };

  // Handle damaged stock change
  const handleDamagedChange = (event, productTitle) => {
    setDamagedLevels((prevLevels) => ({
      ...prevLevels,
      [productTitle]: Number(event.target.value),
    }));
  };

  // Add new product
  const handleNewProductChange = (e) => {
    setNewProduct({
      ...newProduct,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    onAddProduct(newProduct);
    setNewProduct({ title: '', stock: 0, price: 0 });
  };

  const handleUpdateStock = (event) => {
    event.preventDefault();
    Object.keys(stockLevels).forEach((productTitle) => {
      const stockToAdd = stockLevels[productTitle];
      if (stockToAdd !== '') {
        onUpdateStock(productTitle, stockToAdd);
      }
    });
    setStockLevels({});
  };

  const handleDeductDamaged = (event) => {
    event.preventDefault();
    Object.keys(damagedLevels).forEach((productTitle) => {
      const damagedStock = damagedLevels[productTitle];
      if (damagedStock !== '') {
        onDeductDamaged(productTitle, damagedStock);
      }
    });
    setDamagedLevels({});
  };

  return (
    <div className={styles.inventoryContainer}>
      <h2>Inventory Management</h2>

      {/* Stock Management */}
      <form onSubmit={handleUpdateStock} className={styles.stockForm}>
        <h3>Update Stock</h3>
        <table className={styles.inventoryTable}>
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
                    value={stockLevels[product.title] || ''}
                    onChange={(e) => handleStockChange(e, product.title)}
                    className={styles.stockInput}
                    min="0"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={damagedLevels[product.title] || ''}
                    onChange={(e) => handleDamagedChange(e, product.title)}
                    className={styles.damagedInput}
                    min="0"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button type="submit" className={styles.submitButton}>Update Stock</button>
        <button type="button" className={styles.deductButton} onClick={handleDeductDamaged}>
          Deduct Damaged Stock
        </button>
      </form>

      {/* Add New Product */}
      <div className={styles.newProductContainer}>
        <h3>Add New Product</h3>
        <form onSubmit={handleAddProduct}>
          <input
            type="text"
            name="title"
            value={newProduct.title}
            onChange={handleNewProductChange}
            placeholder="Product Name"
            required
          />
          <input
            type="number"
            name="stock"
            value={newProduct.stock}
            onChange={handleNewProductChange}
            placeholder="Stock Quantity"
            required
          />
          <input
            type="number"
            name="price"
            value={newProduct.price}
            onChange={handleNewProductChange}
            placeholder="Price"
            required
          />
          <button type="submit" className={styles.addProductButton}>
            Add Product
          </button>
        </form>
      </div>
    </div>
  );
};

export default Inventory;
