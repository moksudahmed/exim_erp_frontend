import Stock from '../Inventory/Stock';

import React, { useEffect, useState } from 'react';


const StockUpdate = ({ products, onUpdateStock, onDeductDamaged, onAddInventory, setProducts, isAuthenticated, token }) => {
  
    
   
  return (
    <div>
      <h2>Stock Update</h2>
      <p>Update stock levels and mark items as damaged here.</p>
      <Stock products={products} onUpdateStock={onUpdateStock} onDeductDamaged={onDeductDamaged} onAddInventory={onAddInventory}/>
      {/* You can add UI for selecting products, adding stock, or marking damaged */}
    </div>
  );
};

export default StockUpdate;


