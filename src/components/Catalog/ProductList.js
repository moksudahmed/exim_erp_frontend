import React from 'react';
import style from './Catalog.module.css';

const ProductList = ({ products, onSelectProduct }) => {
  return (
    <div className={style.productList}>
      {products.map(product => (
        <div key={product.id} className={style.product} onClick={() => onSelectProduct(product)}>
          <h3>{product.title}</h3>
          <p>Price: ${product.unitPrice.toFixed(2)}</p>
          <p>Categry: ${product.category}</p>
          <p>Sub Categry: ${product.sub_category}</p>
        </div>
      ))}
    </div>
  );
};

export default ProductList;
