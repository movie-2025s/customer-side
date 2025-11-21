import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/north-star-logo.jpg';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <img src={logo} alt="North Star Logo" className="logo" />
          <span className="brand-name">North Star</span>
        </Link>
        <div className="nav-links">
          <Link to="/" className="nav-link">Home</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;