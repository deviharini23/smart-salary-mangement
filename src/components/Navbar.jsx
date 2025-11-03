import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { path: "/login", label: "🔐 Login", icon: "🔐" },
    { path: "/register", label: "👤 Register", icon: "👤" },
     { path: "/HomePage", label: "👤 Home", icon: "👤" },
    { path: "/setbudget", label: "💰 Budget", icon: "💰" },
    { path: "/expenses", label: "📝 Expenses", icon: "📝" },
    { path: "/reports", label: "📊 Reports", icon: "📊" },
    { path: "/goal", label: "🎯 Goals", icon: "🎯" },
    { path: "/history", label: "📈 History", icon: "📈" }
  ];

  const isActiveLink = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      <style>{`
        .navbar {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 0;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          position: sticky;
          top: 0;
          z-index: 1000;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .nav-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .nav-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 70px;
        }

        .nav-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
        }

        .brand-icon {
          width: 36px;
          height: 36px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          backdrop-filter: blur(10px);
        }

        .brand-text {
          color: white;
          font-size: 20px;
          font-weight: 700;
          font-family: 'Inter', sans-serif;
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 8px;
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .nav-link {
          text-decoration: none;
          color: rgba(255, 255, 255, 0.8);
          padding: 12px 20px;
          border-radius: 12px;
          font-weight: 500;
          font-size: 14px;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 8px;
          position: relative;
          overflow: hidden;
        }

        .nav-link::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
          transition: left 0.5s ease;
        }

        .nav-link:hover::before {
          left: 100%;
        }

        .nav-link:hover {
          color: white;
          background: rgba(255, 255, 255, 0.1);
          transform: translateY(-1px);
        }

        .nav-link.active {
          color: white;
          background: rgba(255, 255, 255, 0.15);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .nav-link.active::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 30px;
          height: 3px;
          background: white;
          border-radius: 2px;
        }

        .link-icon {
          font-size: 16px;
        }

        .link-text {
          white-space: nowrap;
        }

        .mobile-menu-button {
          display: none;
          background: none;
          border: none;
          color: white;
          font-size: 24px;
          cursor: pointer;
          padding: 8px;
          border-radius: 8px;
          transition: background 0.3s ease;
        }

        .mobile-menu-button:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .mobile-menu {
          display: none;
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }

        .mobile-menu.open {
          display: block;
          animation: slideDown 0.3s ease;
        }

        .mobile-nav-links {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
        }

        .mobile-nav-link {
          text-decoration: none;
          color: rgba(255, 255, 255, 0.8);
          padding: 16px 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 12px;
          transition: all 0.3s ease;
        }

        .mobile-nav-link:hover {
          color: white;
          background: rgba(255, 255, 255, 0.1);
        }

        .mobile-nav-link.active {
          color: white;
          background: rgba(255, 255, 255, 0.15);
          border-left: 4px solid white;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Responsive Design */
        @media (max-width: 968px) {
          .nav-links {
            gap: 4px;
          }
          
          .nav-link {
            padding: 10px 16px;
            font-size: 13px;
          }
          
          .link-text {
            display: none;
          }
          
          .nav-link {
            padding: 12px;
          }
        }

        @media (max-width: 768px) {
          .nav-links {
            display: none;
          }
          
          .mobile-menu-button {
            display: block;
          }
          
          .brand-text {
            font-size: 18px;
          }
          
          .brand-icon {
            width: 32px;
            height: 32px;
            font-size: 16px;
          }
        }

        @media (max-width: 480px) {
          .nav-container {
            padding: 0 16px;
          }
          
          .nav-content {
            height: 60px;
          }
          
          .brand-text {
            font-size: 16px;
          }
        }

        /* Animation for page transitions */
        .nav-link {
          position: relative;
          overflow: hidden;
        }

        .nav-link::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          width: 0;
          height: 2px;
          background: white;
          transition: all 0.3s ease;
          transform: translateX(-50%);
        }

        .nav-link:hover::after {
          width: 80%;
        }

        .nav-link.active::after {
          width: 80%;
        }
      `}</style>

      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-content">
            {/* Brand Logo */}
            <Link to="/" className="nav-brand">
              <div className="brand-icon">💎</div>
              <div className="brand-text">SmartExpense</div>
            </Link>

            {/* Desktop Navigation */}
            <ul className="nav-links">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`nav-link ${isActiveLink(item.path) ? 'active' : ''}`}
                  >
                    <span className="link-icon">{item.icon}</span>
                    <span className="link-text">{item.label.replace(/[🔐👤💰📝📊🎯📈]/g, '').trim()}</span>
                  </Link>
                </li>
              ))}
            </ul>

            {/* Mobile Menu Button */}
            <button 
              className="mobile-menu-button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>

          {/* Mobile Navigation */}
          <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
            <ul className="mobile-nav-links">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`mobile-nav-link ${isActiveLink(item.path) ? 'active' : ''}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="link-icon">{item.icon}</span>
                    <span className="link-text">{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}