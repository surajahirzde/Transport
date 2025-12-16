import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './styles/Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserLogin, setIsUserLogin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('current_user'));
    if (currentUser) {
      setIsUserLogin(currentUser);
    }
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('current_user');
    setIsUserLogin(false);
    closeMenu();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <div className="navbar-logo" onClick={() => navigate('/')}>
          <div className="logo-icon">🚚</div>
          <div className="logo-text">
            <span className="logo-name">TransportOnWeb</span>
            <span className="logo-tag">Fast & Reliable</span>
          </div>
        </div>

        {/* Desktop Menu */}
        <div className="navbar-menu">
          <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            Home
          </NavLink>
          <NavLink to="/services" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            Services
          </NavLink>
          <NavLink to="/track" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            Track Shipment
          </NavLink>
          <NavLink to="/about" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            About
          </NavLink>
          <NavLink to="/contact" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            Contact
          </NavLink>
        </div>

        {/* User Section */}
        <div className="user-section">
          {isUserLogin ? (
            <div className="user-profile">
              <div className="user-info">
                <span className="user-phone">📱 {isUserLogin.phone}</span>
              </div>
              <NavLink 
                to={isUserLogin.phone === "9971230022" ? "/dashboard" : "/orders"} 
                className="dashboard-btn"
              >
                {isUserLogin.phone === "9971230022" ? "Dashboard" : "My Orders"}
              </NavLink>
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </div>
          ) : (
            <NavLink to="/login" className="login-btn">
              Login
            </NavLink>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="mobile-toggle" onClick={toggleMenu}>
          {isMenuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isMenuOpen ? 'show' : ''}`}>
        <NavLink to="/" className="mobile-link" onClick={closeMenu}>
          Home
        </NavLink>
        <NavLink to="/services" className="mobile-link" onClick={closeMenu}>
          Services
        </NavLink>
        <NavLink to="/track" className="mobile-link" onClick={closeMenu}>
          Track Shipment
        </NavLink>
        <NavLink to="/about" className="mobile-link" onClick={closeMenu}>
          About
        </NavLink>
        <NavLink to="/contact" className="mobile-link" onClick={closeMenu}>
          Contact
        </NavLink>
        
        <div className="mobile-user">
          {isUserLogin ? (
            <>
              <div className="mobile-user-info">
                <span>Logged in as: {isUserLogin.phone}</span>
              </div>
              <NavLink 
                to={isUserLogin.phone === "9971230022" ? "/dashboard" : "/orders"} 
                className="mobile-dashboard-btn"
                onClick={closeMenu}
              >
                {isUserLogin.phone === "9971230022" ? "Dashboard" : "My Orders"}
              </NavLink>
              <button className="mobile-logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <NavLink to="/login" className="mobile-login-btn" onClick={closeMenu}>
              Login / Register
            </NavLink>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;