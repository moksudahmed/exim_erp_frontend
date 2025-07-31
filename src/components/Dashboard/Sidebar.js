import React from 'react';
import { FaHome, FaUser, FaTable, FaFont, FaIcons, FaMapMarkerAlt, FaBell } from 'react-icons/fa';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
import './styles/Sidebar.css';

const Sidebar = ({isAuthenticated}) => {
    return (
    <div className="sidebar">
      <div className="sidebar-brand">
        <h3>CREATIVE TIM</h3>
      </div>
      <ul className="sidebar-menu">
        <li className="active"><FaHome /><a href="/pos">POS</a></li>
        <li><FaHome /> <a href="/stock">Stock</a></li>
        <li><FaHome /><a href="/sales">Sales</a></li>
        <li><FaHome /><a href="/admin">Admin</a></li>

        {isAuthenticated ? (
            <li><FaUser /> <a href="/logout">Logout</a></li>
        ) : (
          <>
            <li><a href="/login">Login</a></li>
            <li><a href="/register">Register</a></li>
          </>
        )}
       
      </ul>
    </div>
  );
};

export default Sidebar;

