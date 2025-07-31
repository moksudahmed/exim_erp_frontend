import React, { useState } from 'react';
import AsyncCreatableSelect from 'react-select/async-creatable';
import style from './styles/POS.module.css';

const DropDownItem = ({ products, selectedProduct, setSelectedProduct }) => {
  const [inputValue, setInputValue] = useState('');

  // Map the products to the format expected by react-select
  const formattedProducts = products.map((product) => ({
    label: product.title,
    value: product.id,
  }));

  const filterProducts = (inputValue) => {
    if (inputValue.trim() === '') return [];
    return formattedProducts.filter((product) =>
      product.label.toLowerCase().includes(inputValue.toLowerCase())
    );
  };

  const promiseOptions = (inputValue) =>
    new Promise((resolve) => {
      setTimeout(() => {
        resolve(filterProducts(inputValue));
      }, 1000);
    });

  const handleProductChange = (selectedOption) => {
    setSelectedProduct(selectedOption ? selectedOption.value : null);
  };

  return (
    <div className={`${style.formField} ${style.productField}`}>
    <label htmlFor="product">Product</label>
    <AsyncCreatableSelect
      cacheOptions
      defaultOptions={formattedProducts}
      loadOptions={promiseOptions}
      onInputChange={(value) => setInputValue(value)}
      onChange={handleProductChange}
      isClearable
      value={formattedProducts.find(product => product.value === selectedProduct) || null}
    />
  </div>
    
  );
};

export default DropDownItem;
