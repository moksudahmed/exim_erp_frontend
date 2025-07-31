import React from 'react';
import { Link } from 'react-router-dom';
import { FaBell, FaUserCircle } from 'react-icons/fa';
import './AppHeader.css';

const AppHeader = ({ isAuthenticated, role }) => {
  const renderNavItems = () => {
    switch (role) {
      case 'basic-user':
        return (
          <ul className="navList">
            <li className="navItem"><Link to="/">Home</Link></li>
            {isAuthenticated ? (
              <li className="navItem"><Link to="/logout">Logout</Link></li>
            ) : (
              <>
                <li className="navItem"><Link to="/login">Login</Link></li>
                <li className="navItem"><Link to="/register">Register</Link></li>
              </>
            )}
          </ul>
        );

      case 'super-admin':
        return (
          <ul className="navList">
            <li className="navItem"><Link to="/">Home</Link></li>
            <li className="navItem"><Link to="/business">Business</Link></li>
            <li className="navItem"><Link to="/pos">POS</Link></li>
            <li className="navItem"><Link to="/payment">Payment</Link></li>
            <li className="navItem"><Link to="/inventory">Inventory</Link></li>
            <li className="navItem"><Link to="/sales">Sales</Link></li>
            <li className="navItem"><Link to="/purchase">Purchase</Link></li>
            <li className="navItem"><Link to="/admin">Admin</Link></li>
            <li className="navItem"><Link to="/accounting">Accounting</Link></li>
            {isAuthenticated ? (
              <li className="navItem"><Link to="/logout">Logout</Link></li>
            ) : (
              <>
                <li className="navItem"><Link to="/login">Login</Link></li>
               
              </>
            )}
          </ul>
        );

      case 'sales-representative':
        return (
          <ul className="navList">
            <li className="navItem"><Link to="/">Home</Link></li>
            <li className="navItem"><Link to="/pos">POS</Link></li>
            <li className="navItem"><Link to="/business">Business</Link></li>
            {isAuthenticated ? (
              <li className="navItem"><Link to="/logout">Logout</Link></li>
            ) : (
              <>
                <li className="navItem"><Link to="/login">Login</Link></li>
             
              </>
            )}
          </ul>
        );

      default:
        return (
          <ul className="navList">
            <li className="navItem"><Link to="/">Home</Link></li>
            <li className="navItem"><Link to="/pos">POS</Link></li>
            {isAuthenticated ? (
              <li className="navItem"><Link to="/logout">Logout</Link></li>
            ) : (
              <>
                <li className="navItem"><Link to="/login">Login</Link></li>
            
              </>
            )}
          </ul>
        );
    }
  };

  return (
    <header className="appHeader">
      <nav className="navBar">
        {renderNavItems()}
        <div className="iconSection">
          <Link to="/notifications" title="Notifications">
            <FaBell className="icon bellIcon" />
          </Link>
          <Link to={isAuthenticated ? "/profile" : "/login"} title="Login/Profile">
            <FaUserCircle className="icon userIcon" />
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default AppHeader;
