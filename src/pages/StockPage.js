import React from 'react';
import Stock from '../components/Inventory/Stock';

const StockPage = ({ products, onUpdateStock, onDeductDamaged }) => {
  return (
    <div>
      <h1>Stock Page</h1>
      <Stock products={products} onUpdateStock={onUpdateStock} onDeductDamaged={onDeductDamaged}/>
    </div>
  );
};

export default StockPage;
