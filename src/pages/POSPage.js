import React from 'react';
import POS from '../components/pos/POS';

const POSPage = ({ products, onAddSale, onUpdateStock,setCurrentBalance, token }) => {
  return (
    <div>
      
      <POS products={products} onAddSale={onAddSale} onUpdateStock={onUpdateStock} setCurrentBalance={setCurrentBalance} token={token}/>
    </div>
  );
};

export default POSPage;
