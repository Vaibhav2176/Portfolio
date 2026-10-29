import React from 'react';
import { Link } from 'react-scroll';
import { FiArrowRight, FiDownload, FiMapPin, FiExternalLink, FiChevronDown } from 'react-icons/fi';
import { personalInfo } from '../data/portfolioData';
import HeroCanvas3D from './HeroCanvas3D';
import './Hero.css';

/**
 * Hero Component — Cinematic Developer Portfolio
 * Features:
 * - Uses the newly provided custom asset: "Cinematic Blue-Toned Professional Portrait.png"
 * - Natural, upright environmental portrait aligned visually with the name block
 * - Solid crisp white monumental name typography (no neon glows, no metallic gradients)
 * - Eyebrow: COMPUTER SCIENCE ENGINEER
 * - Subtitle: FULL-STACK DEVELOPER · SYSTEMS BUILDER
 * - Natural introduction: "I build useful digital products, engineer reliable software, and turn ideas into working applications."
 * - Three clear actions: Explore My Work, Download Resume, Get in Touch
 * - Removed floating code window entirely (clean, uncluttered composition)
 * - Removed all telemetry, coordinates, and redundant badges
 */
const Hero = ({ introState = 'completed' }) => {
  return (
    <section 
      id="hero" 
      className={`hero-editorial-section intro-state-${introState}`} 
      aria-label="Introduction and Overview"
    >
      
      {/* 1. Cinematic 3D Spatial Night Atmosphere (Skyline, Moon, Lighting) */}
      <HeroCanvas3D />

      {/* 2. Panoramic Studio Window Mullions */}
      <div className="hero-window-frames" aria-hidden="true">
        <div className="window-frame-line frame-left" />
        <div className="window-frame-line frame-center" />
        <div className="window-frame-line frame-right" />
        <div className="window-frame-horizontal" />
      </div>

      {/* 3. Dual-Tone Environmental Light Washes */}
      <div className="hero-background-washes" aria-hidden="true">
        <div className="hero-light-wash-cyan" />
        <div className="hero-light-wash-amber" />
      </div>

      {/* 4. Foreground Blurred Foliage (Cinematic Depth of Field) */}
      <div className="hero-vignette-left" aria-hidden="true" />
      <div className="hero-vignette-right" aria-hidden="true" />

      {/* 5. Main Hero Viewport Composition */}
      <div className="hero-editorial-viewport">
        
        {/* ==================================================================
            LEFT COLUMN: Pure, Confident Typography & Clear Action Pathways
            ================================================================== */}
        <div className="hero-editorial-copy">
          
          {/* Eyebrow: Restrained, uppercase with subtle rule */}
          <div className="hero-eyebrow-group">
            <span className="hero-eyebrow-label font-mono">
              COMPUTER SCIENCE ENGINEER
            </span>
            <span className="hero-eyebrow-divider" aria-hidden="true" />
          </div>

          {/* Focal Point: Solid Crisp White Monumental Name */}
          <div className="hero-name-container">
            <h1 className="hero-editorial-name">
              <span className="name-row hero-name-first">
                <span className="hero-name-text">VAIBHAV</span>
              </span>
              <span className="name-row hero-name-last">
                <span className="hero-name-text">AMULANI</span>
              </span>
            </h1>
          </div>

          {/* Professional Identity Line: Exactly three roles */}
          <div className="hero-editorial-subrole font-mono">
            FULL-STACK DEVELOPER · SOFTWARE ENGINEER · PROBLEM SOLVER
          </div>

          {/* Resume-Aligned Hero Introduction Paragraph */}
          <p className="hero-editorial-intro">
            I’m a Computer Science undergraduate with a strong foundation in programming, data structures, algorithms, and software engineering. I build and deploy full-stack applications backed by relational databases, with a focus on reliable, secure, and maintainable software.
          </p>

          {/* Three Clear Actions */}
          <div className="hero-editorial-actions">
            <Link
              to="projects"
              href="#projects"
              smooth={true}
              duration={500}
              offset={-70}
              className="btn hero-btn-primary font-mono"
            >
              <span>Explore My Work</span>
              <FiArrowRight className="action-icon" aria-hidden="true" />
            </Link>

            <a
              href={personalInfo.resumePdf}
              download="Vaibhav_Amulani_Resume.pdf"
              className="btn hero-btn-secondary font-mono"
              aria-label="Download Vaibhav Amulani's Resume (PDF)"
            >
              <FiDownload className="action-icon" aria-hidden="true" />
              <span>Download Resume</span>
            </a>

            <Link
              to="contact"
              href="#contact"
              smooth={true}
              duration={500}
              offset={-70}
              className="hero-btn-link font-mono"
            >
              <span>Get in Touch</span>
              <FiExternalLink className="action-icon-sm" aria-hidden="true" />
            </Link>
          </div>

          {/* Subtle Location Indicator */}
          <div className="hero-editorial-location font-mono">
            <FiMapPin className="pin-icon" aria-hidden="true" />
            <span>Bhopal, India</span>
          </div>

        </div>

        {/* ==================================================================
            RIGHT COLUMN: Custom Portfolio Portrait Asset (Naturally Integrated)
            ================================================================== */}
        <div className="hero-editorial-visual">
          <div className="hero-portrait-stage">
            
            {/* The newly added portfolio-specific image asset */}
            <img
              src="/Cinematic Blue-Toned Professional Portrait.png"
              alt="Vaibhav Amulani — Software Engineer"
              className="hero-custom-portrait-img"
              loading="eager"
              fetchpriority="high"
            />

            {/* Transition Geometric Shell & Framing Sweep (Active during 3D handoff) */}
            <div className="hero-portrait-geometric-frame" aria-hidden="true">
              <div className="geometric-frame-corner corner-tl" />
              <div className="geometric-frame-corner corner-tr" />
              <div className="geometric-frame-corner corner-bl" />
              <div className="geometric-frame-corner corner-br" />
              <div className="geometric-frame-sweep" />
            </div>

            {/* Seamless 4-Directional Vignette & Dissolves (Melts into Environment) */}
            <div className="hero-portrait-fade-left" aria-hidden="true" />
            <div className="hero-portrait-fade-bottom" aria-hidden="true" />
            <div className="hero-portrait-fade-top" aria-hidden="true" />
            <div className="hero-portrait-fade-right" aria-hidden="true" />

          </div>

          {/* Information Cards (Desktop: Floating Overlays; Mobile: Intentional Flow) */}
          <div className="hero-cards-container">
            {/* Card A — Academic Profile Card */}
            <div className="hero-floating-card hero-card-academic" aria-label="Academic Profile">
              <div className="academic-card-header font-mono">
                <span className="academic-card-indicator" aria-hidden="true" />
                <span className="academic-card-title">ACADEMIC PROFILE</span>
              </div>
              <div className="academic-card-body font-mono">
                <div className="academic-degree">B.Tech · Computer Science</div>
                <div className="academic-institution">LNCTS · 2024–2028</div>
              </div>
              <div className="academic-card-footer font-mono">
                <span className="cgpa-label">Current CGPA</span>
                <span className="cgpa-value">8.25 / 10</span>
              </div>
            </div>

            {/* Card B — Engineering Stack */}
            <div className="hero-floating-card hero-card-stack" aria-label="Technical Skills: Engineering Stack">
              <div className="stack-card-header font-mono">
                <span className="stack-card-indicator" aria-hidden="true" />
                <span className="stack-card-title">ENGINEERING STACK</span>
              </div>
              <div className="stack-card-body font-mono">
                <div className="stack-row">React · TypeScript</div>
                <div className="stack-row">Node.js · PostgreSQL</div>
                <div className="stack-row">Python · REST APIs</div>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* 6. Subtle Center Bottom Scroll Indicator */}
      <div className="hero-editorial-scroll-cue">
        <Link
          to="about"
          href="#about"
          smooth={true}
          duration={500}
          offset={-70}
          className="scroll-cue-link font-mono"
          aria-label="Scroll to about section"
        >
          <div className="mouse-capsule" aria-hidden="true">
            <div className="mouse-wheel" />
          </div>
          <span className="scroll-cue-text">SCROLL TO EXPLORE</span>
          <FiChevronDown className="scroll-cue-chevron" aria-hidden="true" />
        </Link>
      </div>

    </section>
  );
};

export default Hero;
