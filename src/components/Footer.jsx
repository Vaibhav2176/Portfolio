import React, { useState, useEffect } from 'react';
import { FiGithub, FiLinkedin, FiTwitter, FiInstagram, FiArrowUp } from 'react-icons/fi';
import { Link as ScrollLink } from 'react-scroll';
import './Footer.css';

const Footer = () => {
  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    const checkScrollTop = () => {
      if (!showScroll && window.pageYOffset > 400) {
        setShowScroll(true);
      } else if (showScroll && window.pageYOffset <= 400) {
        setShowScroll(false);
      }
    };
    window.addEventListener('scroll', checkScrollTop);
    return () => window.removeEventListener('scroll', checkScrollTop);
  }, [showScroll]);

  return (
    <footer className="footer">
      <div className="container footer-content">
        <div className="footer-logo">
          <h2 className="gradient-text">Vaibhav Amulani.</h2>
          <p>Turning ideas into the future, one line of code at a time.</p>
        </div>

        <div className="social-links">
          <a href="https://github.com/Vaibhav2176" target="_blank" rel="noopener noreferrer" className="social-icon">
            <FiGithub />
          </a>
          <a href="https://www.linkedin.com/in/vaibhav-amulani-72aaab248/" target="_blank" rel="noopener noreferrer" className="social-icon">
            <FiLinkedin />
          </a>
          <a href="https://x.com/VaibhavAmulani" target="_blank" rel="noopener noreferrer" className="social-icon">
            <FiTwitter />
          </a>
          <a href="https://www.instagram.com/_vaibhav_amulani/" target="_blank" rel="noopener noreferrer" className="social-icon">
            <FiInstagram />
          </a>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Vaibhav Amulani. All rights reserved.</p>
      </div>

      {showScroll && (
        <ScrollLink
          to="hero"
          smooth={true}
          duration={500}
          className="back-to-top"
          aria-label="Back to top"
        >
          <FiArrowUp />
        </ScrollLink>
      )}
    </footer>
  );
};

export default Footer;
