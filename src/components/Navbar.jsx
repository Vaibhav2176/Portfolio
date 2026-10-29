import React, { useState, useEffect } from 'react';
import { Link } from 'react-scroll';
import { FiMenu, FiX, FiDownload } from 'react-icons/fi';
import { personalInfo } from '../data/portfolioData';
import './Navbar.css';

const Navbar = () => {
  const [navScrolled, setNavScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const isScrolled = window.scrollY > 40;
          setNavScrolled((prev) => (prev !== isScrolled ? isScrolled : prev));
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Overview', to: 'hero' },
    { name: 'About', to: 'about' },
    { name: 'Skills', to: 'skills' },
    { name: 'Academics', to: 'academic' },
    { name: 'Activity', to: 'activity' },
    { name: 'Projects', to: 'projects' },
    { name: 'Contact', to: 'contact' },
  ];

  return (
    <header className={`navbar ${navScrolled ? 'scrolled' : ''}`} role="banner">
      <div className="nav-container">
        
        {/* Brandmark */}
        <div className="logo cursor-pointer">
          <Link to="hero" href="#hero" smooth={true} duration={500} aria-label="Vaibhav Amulani - Home">
            VAIBHAV.
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="desktop-menu" aria-label="Main Navigation">
          <ul>
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link
                  activeClass="active"
                  to={link.to}
                  href={`#${link.to}`}
                  spy={true}
                  smooth={true}
                  offset={-70}
                  duration={500}
                  className="nav-link"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Desktop Quick Resume Download Action */}
        <div className="nav-actions-desktop">
          <a
            href={personalInfo.resumePdf}
            download="Vaibhav_Amulani_Resume.pdf"
            className="btn btn-secondary nav-resume-btn font-mono"
            aria-label="Download Vaibhav Amulani's Resume (PDF)"
          >
            <FiDownload /> Resume
          </a>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          type="button"
          className="mobile-toggle"
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      <nav className={`mobile-menu ${menuOpen ? 'open' : ''}`} aria-label="Mobile Navigation">
        <ul>
          {navLinks.map((link) => (
            <li key={link.name}>
              <Link
                activeClass="active"
                to={link.to}
                href={`#${link.to}`}
                spy={true}
                smooth={true}
                offset={-70}
                duration={500}
                onClick={() => setMenuOpen(false)}
                className="nav-link-mobile"
              >
                {link.name}
              </Link>
            </li>
          ))}
          <li className="mobile-menu-action">
            <a
              href={personalInfo.resumePdf}
              download="Vaibhav_Amulani_Resume.pdf"
              className="btn btn-primary mobile-resume-btn font-mono"
              aria-label="Download Vaibhav Amulani's Resume (PDF)"
            >
              <FiDownload /> Download Resume
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
