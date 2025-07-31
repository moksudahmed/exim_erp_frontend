import React from 'react';
import { FaBell, FaSearch } from 'react-icons/fa';
import './styles/TopNavbar.css';

const TopNavbar = () => {
  return (
    <div className="top-navbar">
      <div className="navbar-left">
        <h2>Dashboard</h2>
      </div>
      <div className="navbar-right">
        <FaSearch />
        <FaBell />
        <span>5</span>
        <div className="dropdown">
          <button className="dropbtn">Account</button>
          <div className="dropdown-content">
            <a href="#">Profile</a>
            <a href="#">Settings</a>
            <a href="#">Logout</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopNavbar;
