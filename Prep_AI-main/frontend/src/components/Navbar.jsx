import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import ThemeToggleButton from "./ThemeToggleButton";
import AuthProfileMenu from "./AuthProfileMenu";
import { isAuthenticated } from "../services/auth";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const authenticated = isAuthenticated();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-brand">
          <div className="brand-icon">N</div>
          <div className="brand-text">
            <span className="brand-name">NexaAura</span>
            <span className="brand-subtitle">InterviewAI</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="navbar-links">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/questions" className="nav-link">Question Bank</Link>
          <Link to="/resume" className="nav-link">Resume</Link>
          <Link to="/interview" className="nav-link">AI Interview</Link>
          <Link to="/ai-generator" className="nav-link">AI Generator</Link>
          <Link to="/mock-interviewer" className="nav-link">Mock Interview</Link>
          <Link to="/report" className="nav-link">Reports</Link>
          <a 
            href="https://nexaaura-doc-hub.vercel.app/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="nav-link nav-link-external"
          >
            NexaDoc
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
          </a>
        </div>

        {/* Right Actions */}
        <div className="navbar-actions">
          <ThemeToggleButton />
          
          {authenticated ? (
            <AuthProfileMenu />
          ) : (
            <>
              <Link to="/signup" className="nav-btn nav-btn-secondary">
                Sign In
              </Link>
              <button 
                onClick={() => navigate('/resume')}
                className="nav-btn nav-btn-primary"
              >
                Start Free Practice
              </button>
            </>
          )}

          {/* Mobile Menu Button */}
          <button 
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {mobileMenuOpen ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <path d="M3 12h18M3 6h18M3 18h18" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="mobile-menu">
          <Link to="/" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>
            Home
          </Link>
          <Link to="/questions" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>
            Question Bank
          </Link>
          <Link to="/resume" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>
            Resume
          </Link>
          <Link to="/interview" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>
            AI Interview
          </Link>
          <Link to="/ai-generator" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>
            AI Generator
          </Link>
          <Link to="/mock-interviewer" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>
            Mock Interview
          </Link>
          <Link to="/report" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>
            Reports
          </Link>
          <a 
            href="https://nexaaura-doc-hub.vercel.app/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="mobile-link"
          >
            NexaDoc ↗
          </a>
          {!authenticated && (
            <div className="mobile-actions">
              <Link to="/signup" className="mobile-btn mobile-btn-secondary">
                Sign In
              </Link>
              <button 
                onClick={() => {
                  navigate('/resume');
                  setMobileMenuOpen(false);
                }}
                className="mobile-btn mobile-btn-primary"
              >
                Start Free Practice
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
