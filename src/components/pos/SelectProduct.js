import React, { useState } from 'react';
import style from './styles/POS.module.css';

const SelectProduct = ({products, setSelectedProduct, selectedProduct}) =>{
    const handleProductChange = (event) => {
        setSelectedProduct(event.target.value);
      };

    return(
        <div className={`${style.formField} ${style.productField}`}>
            <label htmlFor="product">Product</label>
          
            <select id="product" value={selectedProduct} onChange={handleProductChange}>
              <option value="" disabled>
                Select a product
              </option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.title}
                </option>
              ))}
            </select>
          </div>
    )
}

export default SelectProduct;