import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import POSPage from './pages/POSPage';
import SalesPage from './pages/SalesPage';
import StockPage from './pages/StockPage';
import AdminPage from './pages/AdminPage';
import Login from './components/Authentication/Login';
import Register from './components/Authentication/Register';
import ForgotPassword from './components/Authentication/ForgotPassword';
import './App.css';
import { fetchProducts, addProduct, updateProduct, deleteProduct } from './api/products';
import { fetchSales, addSale, updateSale, deleteSale } from './api/sales';
import { login, register, forgotPassword } from './api/auth';

const App = () => {
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [error, setError] = useState('');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        if (isAuthenticated && token) {
          const fetchedProducts = await fetchProducts(token);
          setProducts(fetchedProducts);

          const fetchedSales = await fetchSales(token);
          setSales(fetchedSales);
        }
      } catch (error) {
        console.error('Failed to load data:', error.message);
      }
    };

    loadData();
  }, [isAuthenticated, token]);

  const handleAddSale = async (sale) => {
    try {
      const savedSale = await addSale(sale, token);
      setSales((prevSales) => [...prevSales, savedSale]);
      setRecentTransactions((prevTransactions) => [savedSale, ...prevTransactions.slice(0, 4)]);
    } catch (error) {
      console.error('Failed to add sale:', error.message);
    }
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

  const handleLogin = async (credentials) => {
    try {
      const { access_token } = await login(credentials);
      localStorage.setItem('token', access_token);
      setToken(access_token);
      setIsAuthenticated(true);
      navigate('/');
    } catch (error) {
      setError(error.message);
    }
  };

  const handleRegister = async (userInfo) => {
    try {
      await register(userInfo);
      navigate('/login');
    } catch (error) {
      setError(error.message);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="appContainer">
      
    <header className="appHeader">
      <nav className="navBar">
        <ul className="navList">
          <li className="navItem"><Link to="/">Home</Link></li>
          <li className="navItem"><Link to="/pos">POS</Link></li>
          <li className="navItem"><Link to="/stock">Stock</Link></li>
          <li className="navItem"><Link to="/sales">Sales</Link></li>
          <li className="navItem"><Link to="/admin">Admin</Link></li>
          {isAuthenticated ? (
            <li className="navItem"><Link to="/logout">Logout</Link></li>
          ) : (
            <>
              <li className="navItem"><Link to="/login">Login</Link></li>
              <li className="navItem"><Link to="/register">Register</Link></li>
            </>
          )}
        </ul>
      </nav>
    </header>
    <main className="mainContent">
      <Routes>
      <Route path="/" element={<HomePage sales={sales} products={products} recentTransactions={recentTransactions} />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/pos" element={<POSPage products={products} onAddSale={handleAddSale} onUpdateStock={handleUpdateStock} />} />
            <Route path="/stock" element={<StockPage products={products} onUpdateStock={handleUpdateStock} />} />
            <Route path="/sales" element={<SalesPage sales={sales} products={products} onUpdateSale={updateSale} onDeleteSale={deleteSale} onPrintSale={() => {}} />} />
            <Route path="/admin" element={<AdminPage products={products} sales={sales} onAddProduct={addProduct} onUpdateProduct={updateProduct} onDeleteProduct={deleteProduct} />} />
            <Route path="/register" element={<Register onRegister={handleRegister} />} />
            <Route path="/forgot-password" element={<ForgotPassword onForgotPassword={forgotPassword} />} />
            <Route path="/logout" element={<Logout setIsAuthenticated={setIsAuthenticated} setToken={setToken} />} />
       
      </Routes>
    </main>
    <footer className="appFooter">
      <p>© 2024 POS System. All rights reserved.</p>
    </footer>
  </div>
  );
};

const Logout = ({ setIsAuthenticated, setToken }) => {
  const navigate = useNavigate();

  useEffect(() => {
    setIsAuthenticated(false);
    setToken(null);
    localStorage.removeItem('token');
    navigate('/login');
  }, [setIsAuthenticated, setToken, navigate]);

  return <div>Logging out...</div>;
};

export default App;
