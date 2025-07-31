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
import InventoryPage from './pages/InventoryPage';
import { fetchInventory, addInventory, onDeductDamaged, onUpdateInventory } from './api/inventory';
import CashRegister from './components/Admin/CashRegister';
import AppHeader from './components/AppHeader';
import TransactionManagement from './pages/TransactionManagement';
import AccountingDashboard from './components/Accounting/AccountingDashboard';
import './components/Accounting/styles/dashboard.css';
import { addTransaction } from './api/transaction';
import { saveJournalItems } from './api/journal_entries';
import PurchasePage from './pages/PurchasePage';
import { plugins } from 'chart.js';
import BusinessDashboard from './pages/BusinessDashboard';
import PaymentPage from './pages/PaymentPage';
import { fetchCustomers} from './api/customer';
import { fetchBranches } from './api/business';
import { fetchClients } from "./api/client";
//import { fetchTransactions } from './api/transaction';
import { fetchClientsByType } from './api/client';
const App = () => {
  const [products, setProducts] = useState([]);
  const [stockLevels, setStockLevels] = useState({});
  const [inventoryLogs, setInventoryLogs] = useState([]);  
  const [sales, setSales] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [clients, setClients] = useState([]);
  const [registerLog, setRegisterLog] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [role, setRole] = useState(localStorage.getItem('role'));
  const [error, setError] = useState('');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const navigate = useNavigate();
  const [currentBalance, setCurrentBalance] = useState(0); // Current balance in the register
  const [isOpen, setIsOpen] = useState(false); // Tracks if the register is open
  const [openingBalance, setOpeningBalance] = useState(0); // Opening balance for the day
  const [transactions, setTransactions] = useState([]);
  const [transactionLogs, setTransactionLogs] = useState([]);
  const [currentDate, setCurrentDate] = useState('');  
  const [branches, setBranches] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  const apiUrl = process.env.REACT_APP_API_URL;
  
  
  useEffect(() => {
    const loadData = async () => {
      try {
        if (isAuthenticated && token) {
          const fetchedBranches = await fetchBranches(token);         
          setBranches(fetchedBranches);
          
          const fetchedProducts = await fetchProducts(token);
          setProducts(fetchedProducts);
          
          const fetchedSales = await fetchSales(token);
          setSales(fetchedSales);
          //console.log(fetchedSales);

          const fetchedCustomers = fetchClientsByType('CUSTOMER', token); 
          setCustomers(fetchedCustomers);

          const fetchedSuppliers = fetchClientsByType('SUPPLIER', token); 
          setSuppliers(fetchedSuppliers);

          
          const fetchedInventoryLogs = await fetchInventory(token);
          setInventoryLogs(fetchedInventoryLogs);   
          
          const now = new Date();
          // Format the date to "YYYY-MM-DDTHH:MM:SS"
          const formattedDate = now.toISOString().slice(0, 19);
          // Set the formatted date in the state
          setCurrentDate(formattedDate); 
          
          const fetchedClients = await fetchClients(token);
          setClients(fetchedClients);
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
      return savedSale; // ✅ This was missing     
      //console.log(currentDate);
     /* const transaction = await addTransaction({
      // transaction_type: 'SALE',
        account_id: 1,
        amount: sale.total,
        transaction_date: currentDate,
        description: `Sale of products - ${sale.sale_products.length} items`,
        user_id: 1, // Assuming user_id is 1, can be updated dynamically for logged-in users
        business_id: 1,
        reference_type: 'sale',
        type: "DEBIT",
        reference_id: savedSale.id

      }, token);
      
      const journalItems = [
              {
                  "narration": "Cash",
                  "debitcredit": "DEBIT",
                  "amount": sale.total,
                  "account_id": 4
              },
              {
                  "narration": "To Sale",
                  "debitcredit": "CREDIT",
                  "amount": sale.total,
                  "account_id": 2
              }
          ];
     
      const payload = {
        ref_no:`Order No- ${savedSale.id}`,
        account_type: 'revenue',      
        company: `Customer No- ${sale.customer_id}`,
        transaction_date: currentDate,
        user_id: 1,
        journal_items: journalItems,
      };

      const journal = await saveJournalItems(token, payload);*/
    } catch (error) {
    console.error('Failed to add sale:', error.message);
    throw error; // Also good to rethrow if you want to catch it higher
  }
  };
  const handleUpdateSale = async (updatedSale) => {       
    setSales(updatedSale);    
  };  

  const handleDeleteSale = (saleId) => {
    setSales((prevSales) => prevSales.filter((sale) => sale.id !== saleId));
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

  const handleDeductDamaged = (productTitle, quantityChange) => {             
    try {     
    const product = products.find((p)=> p.title === productTitle);
    const payload = {
        product_id:product.id,
        action_type: "DAMAGED",
        quantity: quantityChange,
        user_id: 1
      };
      
    onUpdateInventory(payload, token);    
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.title === productTitle
          ? { ...product, stock: product.stock - quantityChange }
          : product
      )
    );
    } catch (error) {
      setError(error.message);
    }
  };

  const handleAddInventory = (productTitle, quantityChange) => {             
    try {     
    const product = products.find((p)=> p.title === productTitle);
    const payload = {
        product_id:product.id,
        action_type: "ADD",
        quantity: quantityChange,
        user_id: 1
      };
    onUpdateInventory(payload, token); 
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.title === productTitle
          ? { ...product, stock: product.stock + quantityChange }
          : product
      )
    );
    } catch (error) {
      setError(error.message);
    }
  };

  const handleLogin = async (credentials) => {
    try {
      const { access_token, role } = await login(credentials);
      localStorage.setItem('token', access_token);
      localStorage.setItem('role', role);
      setRole(role);
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
  
  const handleCashIn = (amount) => {
    const newLog = {
      type: 'Cash In',
      amount,
      date: new Date()
    };
    setRegisterLog([...registerLog, newLog]);
  };

  const handleCashOut = (amount) => {
    const newLog = {
      type: 'Cash Out',
      amount,
      date: new Date()
    };
    setRegisterLog([...registerLog, newLog]);
  };

  const handleCloseRegister = (balance) => {
    alert(`Register closed with balance: $${balance}`);
    setRegisterLog([]);
  };
  
  
  
  return (
    <div className="appContainer">
      
      
    <AppHeader isAuthenticated={isAuthenticated} role={role}/>
    <main className="mainContent">
      <Routes>
            <Route path="/" element={<HomePage sales={sales} 
                                               products={products} 
                                               recentTransactions={recentTransactions} 
                                               currentBalance={currentBalance} 
                                               isOpen={isOpen}                                              
                                               isAuthenticated={isAuthenticated}
                                               token={token}/>} 
            />
            <Route path="/business" element={<BusinessDashboard 
                                              branches={branches} 
                                              token={token}/>} 
            />
            
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/pos" element={<POSPage products={products} 
                                                 onAddSale={handleAddSale} 
                                                 onUpdateStock={handleUpdateStock} 
                                                 setCurrentBalance={setCurrentBalance} 
                                                 token={token}/>} 
            />
            <Route path="/payment" element={<PaymentPage products={products} 
                                                    customers={customers}
                                                    inventoryLogs={inventoryLogs || []} 
                                                    setInventoryLogs={setInventoryLogs} 
                                                    onUpdateStock={handleUpdateStock} 
                                                    onDeductDamaged={handleDeductDamaged} 
                                                    onAddInventory={handleAddInventory}
                                                    setProducts={setProducts}
                                                    isAuthenticated={isAuthenticated}
                                                    token={token}/>} />
            
            {/*<Route path="/stock" element={<StockPage products={products} 
                                                     onUpdateStock={handleUpdateStock} 
                                                     onDeductDamaged={handleDeductDamaged} />} 
            />*/}
            <Route path="/inventory" element={<InventoryPage products={products} 
                                                    inventoryLogs={inventoryLogs || []} 
                                                    setInventoryLogs={setInventoryLogs} 
                                                    onUpdateStock={handleUpdateStock} 
                                                    onDeductDamaged={handleDeductDamaged} 
                                                    onAddInventory={handleAddInventory}
                                                    setProducts={setProducts}
                                                    isAuthenticated={isAuthenticated}
                                                    token={token}/>} 
            />
            <Route path="/sales" element={<SalesPage products={products} 
                                                     onUpdateSale={handleUpdateSale} 
                                                     onDeleteSale={handleDeleteSale }                                                      
                                                     isAuthenticated={isAuthenticated}
                                                     token={token} />} 
            />
          
            
            <Route path="/purchase" element={<PurchasePage token={token}                                                     
                                                     products={products} />} 
            />
            
            <Route path="/admin" element={<AdminPage branches={branches} 
                                                     products={products} 
                                                     sales={sales} 
                                                     customers={customers}
                                                     suppliers={suppliers}
                                                     onAddProduct={addProduct} 
                                                     onUpdateProduct={updateProduct} 
                                                     onDeleteProduct={deleteProduct} 
                                                     token={token} 
                                                     isAuthenticated={isAuthenticated}/>} 
            />
           {/* <Route path="/cashregister" element={ <CashRegister openingBalance={openingBalance} 
                                                      setOpeningBalance={setOpeningBalance} 
                                                      setCurrentBalance={setCurrentBalance} 
                                                      currentBalance={currentBalance} 
                                                      setIsOpen={setIsOpen} 
                                                      isOpen={isOpen} 
                                                      token={token} 
                                                      isAuthenticated={isAuthenticated}/>} 
            />*/}
         
            <Route path="/accounting" element={ <AccountingDashboard                                                                                                              
                                                       token={token} 
                                                       isAuthenticated={isAuthenticated}
                                                      />} 
           
           
            />
            {/* <Route path="/transaction" element={ <TransactionManagement                                                                                                              
                                                       token={token} 
                                                       isAuthenticated={isAuthenticated}
                                                      />} 
            /> */}          
           {/* <Route path="/register" element={<Register onRegister={handleRegister} />} />*/}
            <Route path="/forgot-password" element={<ForgotPassword onForgotPassword={forgotPassword} />} />
            <Route path="/logout" element={<Logout setIsAuthenticated={setIsAuthenticated} 
                                                   setToken={setToken} 
                                                   setIsOpen={setIsOpen} />} />
       
      </Routes>
    </main>
    <footer className="appFooter">
      <p>© 2025 POS System. All rights reserved.</p>
    </footer>
  </div>
  );
};

const Logout = ({ setIsAuthenticated, setToken, setIsOpen }) => {
  const navigate = useNavigate();

  useEffect(() => {
    setIsAuthenticated(false);
    setToken(null);
    setIsOpen(false);
    localStorage.removeItem('token');
    navigate('/login');
  }, [setIsAuthenticated, setToken, navigate]);

  return <div>Logging out...</div>;
};


export default App;
