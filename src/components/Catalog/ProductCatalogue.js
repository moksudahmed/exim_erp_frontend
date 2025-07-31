import React, { useState } from 'react';
import ProductForm from './ProductForm';
import axios from 'axios';
import styles from './styles/ProductCatalogue.module.css';

const ProductCatalogue = ({ products, onAddProduct }) => {
  const [isAdding, setIsAdding] = useState(false);

  const apiUrl = process.env.REACT_APP_API_URL;
  const API_URL = `${apiUrl}api/v1/products/`;

  const handleAddProduct = async (product) => {
    try{
      const response = onAddProduct(product);
       
      setIsAdding(false);
    } catch (error) {
      console.error("Failed to save product:", error.response ? error.response.data : error.message);
    }
    /*try {
      const response = await axios.post(API_URL, {
        title: product.title,
        price_per_unit: product.price_per_unit,
        stock: product.stock,
        category: product.category,
        sub_category: product.sub_category,
        product_type: product.product_type || 'tangible',
        unit_of_measurement: product.unit_of_measurement || null,
        quantity_per_unit: product.quantity_per_unit || null,
        is_stock_tracked: product.is_stock_tracked !== undefined ? product.is_stock_tracked : true,
        tax_rate: product.tax_rate || null,
        description: product.description || '',
      });

      if (onAddProduct) {
        //onAddProduct(response.data);
      }
      setIsAdding(false);
    } catch (error) {
     // console.error("Failed to save product:", error.response ? error.response.data : error.message);
    }*/
  };

  return (
    <div className={styles.catalogueContainer}>
      <h2 className={styles.title}>Product Catalogue</h2>
      <button className={styles.addButton} onClick={() => setIsAdding(!isAdding)}>
        {isAdding ? 'Cancel' : 'Add New Product'}
      </button>

      {isAdding && <ProductForm onAddProduct={handleAddProduct} />}

      <div className={styles.productList}>
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product.id} className={styles.productItem}>
              <h3>{product.title}</h3>
              <p>Price: ${parseFloat(product.price_per_unit).toFixed(2)}</p>
              <p>Stock: {product.stock}</p>
              <p>Category: {product.category || 'Uncategorized'}</p>
              <p>Sub Category: {product.sub_category || '-'}</p>
              <p>Type: {product.product_type}</p>
              {product.unit_of_measurement && <p>UOM: {product.unit_of_measurement}</p>}
              {product.quantity_per_unit && <p>Qty/Unit: {product.quantity_per_unit}</p>}
              {product.tax_rate && <p>Tax Rate: {product.tax_rate}%</p>}
              {product.description && <p>Description: {product.description}</p>}
            </div>
          ))
        ) : (
          <p>No products available</p>
        )}
      </div>
    </div>
  );
};

export default ProductCatalogue;
