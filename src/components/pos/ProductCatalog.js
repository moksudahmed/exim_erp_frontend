import React from 'react';
import style from '../styles/ProductCatalog.module.css';

const ProductCatalog = ({ products }) => {
  return (
    <div className={style.productCatalogContainer}>
      <h2>Product Catalog</h2>
      <div className={style.productList}>
        {products.map(product => (
          <div key={product.id} className={style.productItem}>
            <h3>{product.title}</h3>
            <p>Price: ${product.unitPrice.toFixed(2)}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductCatalog;
