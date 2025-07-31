import React, { useState } from 'react';
import axios from 'axios';
import styles from './styles/ManageProducts.module.css';

const ManageProducts = ({ products, onUpdateProduct, onDeleteProduct }) => {
  const [editingProduct, setEditingProduct] = useState(null);
  const [productDetails, setProductDetails] = useState({ title: '', unitPrice: 0, stock: 0 });

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setProductDetails({
      title: product.title,
      unitPrice: product.unitPrice,
      stock: product.stock,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductDetails({ ...productDetails, [name]: value });
  };

  const handleSaveClick = async () => {
    try {
      const response = await axios({
        method: editingProduct ? 'put' : 'post',
        url: editingProduct ? `http://127.0.0.1:8000/api/v1/products/${editingProduct.id}` : 'http://127.0.0.1:8000/api/v1/products/',
        data: {
          title: productDetails.title,
          price_per_unit: productDetails.unitPrice,
          stock: productDetails.stock,
        },
      });

      onUpdateProduct(response.data);
      setEditingProduct(null);
      setProductDetails({ title: '', unitPrice: 0, stock: 0 });
    } catch (error) {
      console.error("Failed to save product:", error.response ? error.response.data : error.message);
    }
  };

  const handleDeleteClick = async (productId) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/v1/products/${productId}`);
      onDeleteProduct(productId);
    } catch (error) {
      console.error("Failed to delete product:", error.response ? error.response.data : error.message);
    }
  };

  return (
    <div className={styles.manageProducts}>
      <h2>Manage Products</h2>
      <table className={styles.productsTable}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Unit Price</th>
            <th>Stock</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.title}</td>
              <td>{product.unitPrice ? `$${product.unitPrice.toFixed(2)}` : 'N/A'}</td>
              <td>{product.stock}</td>
              <td>
                <button className={styles.editButton} onClick={() => handleEditClick(product)}>Edit</button>
                <button className={styles.deleteButton} onClick={() => handleDeleteClick(product.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editingProduct && (
        <div className={styles.editModal}>
          <h3>Edit Product #{editingProduct.id}</h3>
          <input
            type="text"
            name="title"
            value={productDetails.title}
            onChange={handleInputChange}
            placeholder="Title"
          />
          <input
            type="number"
            name="unitPrice"
            value={productDetails.unitPrice}
            onChange={handleInputChange}
            placeholder="Unit Price"
            min="0"
            step="0.01"
          />
          <input
            type="number"
            name="stock"
            value={productDetails.stock}
            onChange={handleInputChange}
            placeholder="Stock"
            min="0"
          />
          <div className={styles.modalActions}>
            <button className={styles.saveButton} onClick={handleSaveClick}>Save</button>
            <button className={styles.cancelButton} onClick={() => setEditingProduct(null)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageProducts;
