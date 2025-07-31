import React, { useState } from 'react';
import Sales from './Sales';

const ParentComponent = () => {
  const [sales, setSales] = useState([
    {
      id: 1,
      items: [
        { id: 1, product: 'Product 1', quantity: 2, unitPrice: 10 },
        { id: 2, product: 'Product 2', quantity: 1, unitPrice: 20 },
      ],
      total: 40,
    },
    // Add more sales data as needed
  ]);

  const handleUpdateSale = (updatedSale) => {
    const updatedSales = sales.map((sale) =>
      sale.id === updatedSale.id ? updatedSale : sale
    );
    setSales(updatedSales);
  };

  return <Sales sales={sales} onUpdateSale={handleUpdateSale} />;
};

export default ParentComponent;
