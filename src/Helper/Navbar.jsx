import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import '../Helper/styles/Navbar.css';
import ChagnsLogo from '../../src/assets/chaganLogo.jpeg';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);


  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    handleNavClick();
    setIsMenuOpen(false);
  };
  
 const handleNavClick = () => {
  
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });    
  };
  return (
    <nav className="main-navbar">
      <div className="navbar-brand">
        <h1 className="navbar-logo">
          <img src={ChagnsLogo} alt="chagans" />
        </h1>
        <p className="navbar-tagline">Anything, Anywhere, Anytime</p>
      </div>
      
      {/* Hamburger Menu Button */}
      <button 
        className={`hamburger-menu ${isMenuOpen ? 'active' : ''}`}
        onClick={toggleMenu}
        aria-label="Toggle navigation menu"
      >
        <span className="hamburger-line"></span>
        <span className="hamburger-line"></span>
        <span className="hamburger-line"></span>
      </button>
      
      {/* Navigation Menu */}
      <ul className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
        <li className="nav-item">
          <NavLink 
            to="/" 
            className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} 
            onClick={closeMenu}
          >
            Home
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink 
            to="/services" 
            className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} 
            onClick={closeMenu}
          >
            Services
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink 
            to="/about" 
            className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} 
            onClick={closeMenu}
          >
            About
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink 
            to="/contact" 
            className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} 
            onClick={closeMenu}
          >
            Contact
          </NavLink>
        </li> 
        <li className="nav-item">
          <button className="login-btn">Login / Signup</button>
        </li>
      </ul>
      
      {/* Overlay for mobile menu */}
      {isMenuOpen && (
        <div className="menu-overlay" onClick={closeMenu}></div>
      )}
    </nav>
  );
};

export default Navbar;