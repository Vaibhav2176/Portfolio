import React, { useState, useEffect } from 'react';
import { 
  FiGithub, 
  FiLinkedin, 
  FiTwitter, 
  FiInstagram, 
  FiArrowUp, 
  FiMail, 
  FiMapPin 
} from 'react-icons/fi';
import { SiLeetcode } from 'react-icons/si';
import { Link as ScrollLink } from 'react-scroll';
import { personalInfo } from '../data/portfolioData';
import './Footer.css';

/**
 * Footer Component
 * Cohesive, intentional conclusion to the portfolio matching the midnight-blue aesthetic.
 * 
 * Features:
 * - Clear brand identity and developer summary
 * - Quick-navigation matrix linking directly to all active portfolio sections
 * - Verified engineering repositories and direct contact channels
 * - Real-time automatically maintained copyright year
 * - Accessible floating back-to-top button with smooth scroll
 * - Strict responsive design across desktop, tablet, and mobile
 */
const Footer = () => {
  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    let ticking = false;
    const checkScrollTop = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const isOver = window.scrollY > 400;
          setShowScroll((prev) => (prev !== isOver ? isOver : prev));
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', checkScrollTop, { passive: true });
    return () => window.removeEventListener('scroll', checkScrollTop);
  }, []);

  const navSections = [
    { id: 'hero', label: 'Overview' },
    { id: 'about', label: 'About' },
    { id: 'skills', label: 'Skills' },
    { id: 'academic', label: 'Academics' },
    { id: 'activity', label: 'Activity' },
    { id: 'projects', label: 'Projects' },
    { id: 'contact', label: 'Contact' }
  ];

  return (
    <footer className="footer" role="contentinfo">
      {/* Luminous Top Divider Beam */}
      <div className="footer-top-accent-line" aria-hidden="true" />

      <div className="container footer-main-container">
        
        {/* Brand & Engineering Summary Column */}
        <div className="footer-brand-column">
          <div className="footer-brand-header">
            <h2 className="footer-logo-text font-heading">Vaibhav Amulani.</h2>
            <span className="footer-role-tag font-mono text-xs">
              Software Engineer · Full Stack &amp; Applied AI
            </span>
          </div>
          <p className="footer-bio-text">
            B.Tech CSE student at LNCTS Bhopal building real-world web applications, deterministic backend services, and practical applied AI tools.
          </p>
          <div className="footer-status-pill font-mono text-xs">
            <span className="footer-status-dot" aria-hidden="true" />
            <span>Available for Internships &amp; Roles</span>
          </div>
        </div>

        {/* Portfolio Section Navigation Column */}
        <div className="footer-nav-column">
          <h3 className="footer-column-heading font-mono text-xs">
            Portfolio Navigation
          </h3>
          <ul className="footer-nav-list" aria-label="Quick links to portfolio sections">
            {navSections.map((sec) => (
              <li key={sec.id}>
                <ScrollLink
                  to={sec.id}
                  href={`#${sec.id}`}
                  smooth={true}
                  duration={500}
                  offset={-70}
                  className="footer-nav-link font-mono"
                  tabIndex={0}
                  role="button"
                >
                  <span className="nav-link-indicator" aria-hidden="true">›</span>
                  <span>{sec.label}</span>
                </ScrollLink>
              </li>
            ))}
          </ul>
        </div>

        {/* Connect & Verified Profiles Column */}
        <div className="footer-connect-column">
          <h3 className="footer-column-heading font-mono text-xs">
            Direct &amp; Verified Channels
          </h3>
          
          <div className="footer-contact-details font-mono text-xs">
            <a 
              href={`mailto:${personalInfo.email}`} 
              className="footer-contact-item"
              title="Send email directly"
            >
              <FiMail className="contact-item-icon text-cyan" aria-hidden="true" />
              <span>{personalInfo.email}</span>
            </a>

            <div className="footer-contact-item">
              <FiMapPin className="contact-item-icon text-emerald" aria-hidden="true" />
              <span>{personalInfo.location} · Open to Remote</span>
            </div>
          </div>

          <div className="footer-social-strip" aria-label="Verified code repositories and social profiles">
            <a
              href={personalInfo.github}
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon"
              aria-label="GitHub profile (opens in new tab)"
              title="GitHub"
            >
              <FiGithub aria-hidden="true" />
            </a>
            <a
              href={personalInfo.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon"
              aria-label="LinkedIn profile (opens in new tab)"
              title="LinkedIn"
            >
              <FiLinkedin aria-hidden="true" />
            </a>
            <a
              href={personalInfo.leetcode}
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon"
              aria-label="LeetCode profile (opens in new tab)"
              title="LeetCode"
            >
              <SiLeetcode aria-hidden="true" />
            </a>
            <a
              href={personalInfo.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon"
              aria-label="X (formerly Twitter) profile (opens in new tab)"
              title="X (Twitter)"
            >
              <FiTwitter aria-hidden="true" />
            </a>
            <a
              href={personalInfo.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon"
              aria-label="Instagram profile (opens in new tab)"
              title="Instagram"
            >
              <FiInstagram aria-hidden="true" />
            </a>
          </div>
        </div>

      </div>

      {/* Bottom Legal & Architecture Bar */}
      <div className="footer-bottom">
        <div className="container footer-bottom-container font-mono text-xs">
          <p className="copyright-text">
            &copy; {new Date().getFullYear()} Vaibhav Amulani. All rights reserved.
          </p>
          <p className="architecture-text">
            Engineered with React 18, Vite, Three.js &amp; Tailwind CSS · High-Performance Spatial Architecture
          </p>
        </div>
      </div>

      {/* Floating Back to Top Button */}
      {showScroll && (
        <ScrollLink
          to="hero"
          href="#hero"
          smooth={true}
          duration={500}
          className="back-to-top"
          aria-label="Scroll back to top of page"
          title="Back to top"
          tabIndex={0}
          role="button"
        >
          <FiArrowUp aria-hidden="true" />
        </ScrollLink>
      )}
    </footer>
  );
};

export default Footer;
