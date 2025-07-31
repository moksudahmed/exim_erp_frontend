import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import POS from './components/pos/POS';
import Stock from './components/pos/Stock';
import Sales from './components/pos/Sales';
import Dashboard from './components/pos/Dashboard';
import Categories from './components/pos/Categories';
import './App.css';

const App = () => {
  const [products, setProducts] = useState([
    { id: 1, title: 'Food', unitPrice: 10.00, stock: 100 },
    { id: 2, title: 'Speed Bar', unitPrice: 12.00, stock: 100 },
    { id: 3, title: 'Beverage', unitPrice: 5.00, stock: 100 },
    { id: 4, title: 'Pizza', unitPrice: 8.00, stock: 100 },
    { id: 5, title: 'Gift Cards', unitPrice: 20.00, stock: 100 },
    { id: 6, title: 'Specials', unitPrice: 15.00, stock: 100 },
    { id: 7, title: 'Apps', unitPrice: 7.00, stock: 100 },
    { id: 8, title: 'Entrees', unitPrice: 18.00, stock: 100 },
    { id: 9, title: 'Sides', unitPrice: 4.00, stock: 100 },
    { id: 10, title: 'Extras', unitPrice: 3.00, stock: 100 },
    { id: 11, title: 'Daily Specials', unitPrice: 11.00, stock: 100 },
    { id: 12, title: 'Desserts', unitPrice: 6.00, stock: 100 },
    { id: 13, title: 'Combo', unitPrice: 13.00, stock: 100 },
    { id: 14, title: 'Fried Food', unitPrice: 9.00, stock: 100 },
    { id: 15, title: 'Wings', unitPrice: 10.00, stock: 100 },
    { id: 16, title: 'Burgers', unitPrice: 12.00, stock: 100 },
    { id: 17, title: 'Kids Menu', unitPrice: 6.00, stock: 100 },
  ]);

  const [sales, setSales] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);

  const handleAddSale = (sale) => {
    setSales((prevSales) => [...prevSales, sale]);
    setRecentTransactions((prevTransactions) => [sale, ...prevTransactions.slice(0, 4)]);
  };

  const handleUpdateStock = (productTitle, quantityChange) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.title === productTitle
          ? { ...product, stock: product.stock + quantityChange }
          : product
      )
    );
  };

  const handleUpdateSale = (updatedSale) => {
    setSales((prevSales) =>
      prevSales.map((sale) =>
        sale.id === updatedSale.id ? updatedSale : sale
      )
    );
  };

  const handleDeleteSale = (saleId) => {
    setSales((prevSales) =>
      prevSales.filter((sale) => sale.id !== saleId)
    );
    setRecentTransactions((prevTransactions) =>
      prevTransactions.filter((transaction) => transaction.id !== saleId)
    );
  };

  const handlePrintSale = (sale) => {
    console.log("Printing sale:", sale);
    // Implement print logic here
  };

  return (
    <Router>
      <div className="appContainer">
        <nav className="navBar">
          <ul className="navList">
            <li className="navItem"><Link to="/">Dashboard</Link></li>
            <li className="navItem"><Link to="/pos">POS</Link></li>
            <li className="navItem"><Link to="/stock">Stock</Link></li>
            <li className="navItem"><Link to="/sales">Sales</Link></li>
          </ul>
        </nav>
        <main className="mainContent">
          <Routes>
            <Route path="/" element={<Dashboard sales={sales} inventory={products} recentTransactions={recentTransactions} />} />
            <Route path="/pos" element={<POS products={products} onAddSale={handleAddSale} onUpdateStock={handleUpdateStock} />} />
            <Route path="/stock" element={<Stock products={products} onUpdateStock={handleUpdateStock} />} />
            <Route path="/sales" element={<Sales sales={sales} onUpdateSale={handleUpdateSale} onDeleteSale={handleDeleteSale} onPrintSale={handlePrintSale} />} />
            <Route path="/categories" element={<Categories sales={sales} products={products} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
