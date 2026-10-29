import React, { useEffect, useRef, useState } from 'react';
import { 
  FiLayers, 
  FiCpu, 
  FiCompass, 
  FiCheckCircle,
  FiUser
} from 'react-icons/fi';
import AboutCanvas3D from './AboutCanvas3D';
import './About.css';

/**
 * About Section — Refined Content & Developer Profile
 * - Upper Split: Left = Introduction narrative (System-oriented opening); Right = Developer Profile (Personal Context, Academic Metric & Code Insight)
 * - Lower: Three distinct, tactile engineering focus cards with 3-color accent system
 *   (Card 1: Cyan/Blue, Card 2: Violet/Indigo, Card 3: Emerald Green)
 * - Seamless midnight-blue background continuing from the hero
 */
const About = () => {
  const cardRefs = useRef([]);
  const profilePanelRef = useRef(null);
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  // Staggered reveal trigger on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    const handleResize = () => {
      cardRectsRef.current = {};
      panelRectRef.current = null;
    };
    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', handleResize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const rafRef = useRef(null);
  const cardRectsRef = useRef({});
  const panelRectRef = useRef(null);

  const handleCardMouseEnter = (index) => {
    const card = cardRefs.current[index];
    if (card) {
      const rect = card.getBoundingClientRect();
      cardRectsRef.current[index] = {
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height,
        scrollY: window.scrollY,
        scrollX: window.scrollX
      };
    }
  };

  // Controlled, subtle hover lighting for the 3 cards (RAF-batched with cached card geometry + scroll compensation, tilt strictly clamped to <= 2.2 deg)
  const handleCardMouseMove = (e, index) => {
    if (window.innerWidth < 1024) return;

    const card = cardRefs.current[index];
    if (!card) return;
    const clientX = e.clientX;
    const clientY = e.clientY;

    if (rafRef.current) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      if (!card.isConnected) return;
      if (!cardRectsRef.current[index]) {
        const rect = card.getBoundingClientRect();
        cardRectsRef.current[index] = {
          left: rect.left,
          top: rect.top,
          width: rect.width,
          height: rect.height,
          scrollY: window.scrollY,
          scrollX: window.scrollX
        };
      }
      const cached = cardRectsRef.current[index];
      if (!cached || !cached.width || !cached.height) return;

      const currentLeft = cached.left - (window.scrollX - cached.scrollX);
      const currentTop = cached.top - (window.scrollY - cached.scrollY);
      const x = clientX - currentLeft;
      const y = clientY - currentTop;

      const centerX = cached.width / 2;
      const centerY = cached.height / 2;

      // Clamped strictly to 2.2 degrees maximum so text is always perfectly horizontal and readable
      const rotateX = Math.max(-2.2, Math.min(2.2, ((y - centerY) / centerY) * -2.2));
      const rotateY = Math.max(-2.2, Math.min(2.2, ((x - centerX) / centerX) * 2.2));

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-6px)`;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  };

  const handleCardMouseLeave = (index) => {
    delete cardRectsRef.current[index];
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    const card = cardRefs.current[index];
    if (!card) return;
    card.style.transform = '';
  };

  const handleProfileMouseEnter = () => {
    const panel = profilePanelRef.current;
    if (panel) {
      const rect = panel.getBoundingClientRect();
      panelRectRef.current = {
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height,
        scrollY: window.scrollY,
        scrollX: window.scrollX
      };
    }
  };

  // Restrained pointer depth on the right-side profile panel (RAF-batched with cached geometry + scroll compensation, clamped to <= 1.8 deg)
  const handleProfileMouseMove = (e) => {
    if (window.innerWidth < 1024) return;

    const panel = profilePanelRef.current;
    if (!panel) return;
    const clientX = e.clientX;
    const clientY = e.clientY;

    if (rafRef.current) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      if (!panel.isConnected) return;
      if (!panelRectRef.current) {
        const rect = panel.getBoundingClientRect();
        panelRectRef.current = {
          left: rect.left,
          top: rect.top,
          width: rect.width,
          height: rect.height,
          scrollY: window.scrollY,
          scrollX: window.scrollX
        };
      }
      const cached = panelRectRef.current;
      if (!cached || !cached.width || !cached.height) return;

      const currentLeft = cached.left - (window.scrollX - cached.scrollX);
      const currentTop = cached.top - (window.scrollY - cached.scrollY);
      const x = clientX - currentLeft;
      const y = clientY - currentTop;

      const centerX = cached.width / 2;
      const centerY = cached.height / 2;

      const rotateX = Math.max(-1.8, Math.min(1.8, ((y - centerY) / centerY) * -1.8));
      const rotateY = Math.max(-1.8, Math.min(1.8, ((x - centerX) / centerX) * 1.8));

      panel.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-3px)`;
      panel.style.setProperty('--mouse-x', `${x}px`);
      panel.style.setProperty('--mouse-y', `${y}px`);
    });
  };

  const handleProfileMouseLeave = () => {
    panelRectRef.current = null;
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    const panel = profilePanelRef.current;
    if (!panel) return;
    panel.style.transform = '';
  };

  return (
    <section 
      id="about" 
      ref={sectionRef}
      className={`about-editorial-section section ${isVisible ? 'is-revealed' : ''}`} 
      aria-label="About Me & Engineering Profile"
    >
      {/* 1. Receding 3D Atmospheric Canvas (Perspective ground grid & floating architectural glass) */}
      <AboutCanvas3D />

      {/* 2. Layered Midnight-Blue Atmospheric Depth Overlays & Spatial Lines */}
      <div className="about-depth-plane-gradient" aria-hidden="true" />
      <div className="about-architectural-lines" aria-hidden="true" />
      <div className="about-ambient-wash" aria-hidden="true" />

      <div className="container about-container">
        
        {/* ==================================================================
            UPPER SPLIT COMPOSITION:
            Left: Narrative (System-oriented opening & engineering mindset)
            Right: Developer Profile Panel (Academic Identity, Leadership & Code Insight)
            ================================================================== */}
        <div className="about-header-split">
          
          {/* Left Column: Heading & Narrative */}
          <div className="about-header-copy">
            <div className="section-eyebrow-group">
              <span className="eyebrow-label font-mono">Who I Am &amp; How I Build</span>
              <span className="eyebrow-divider" aria-hidden="true" />
            </div>

            <h2 className="section-title about-main-title">
              More than just writing code.
            </h2>

            <div className="about-intro-narrative">
              <p className="about-narrative-paragraph">
                My interest in software engineering goes beyond building interfaces—it lies in understanding the systems, decisions, and algorithms that make applications work reliably. Currently pursuing Computer Science and Engineering at LNCT&amp;S, Bhopal (Class of 2028) with an <strong>8.25 / 10 CGPA</strong>, I treat every project as an opportunity to bridge theoretical principles with hands-on implementation. To strengthen my foundation in computer science, I have completed rigorous NPTEL certifications alongside my degree coursework, expanding my knowledge of scalable software architectures and computing fundamentals.
              </p>
              <p className="about-narrative-paragraph">
                My daily work centers on full-stack web development, core algorithms, and practical applications of artificial intelligence. Alongside developing complete web platforms, I have contributed to academic research manuscripts exploring predictive machine learning and cybersecurity frameworks. For me, software engineering is about solving challenging problems, understanding the trade-offs behind every design decision, and continuously improving through deliberate, disciplined practice.
              </p>
            </div>
          </div>

          {/* Right Column: Floating Developer Profile Panel */}
          <div 
            ref={profilePanelRef}
            className="about-profile-panel"
            onMouseEnter={handleProfileMouseEnter}
            onMouseMove={handleProfileMouseMove}
            onMouseLeave={handleProfileMouseLeave}
            aria-label="Developer Profile & Technical Context"
          >
            <div className="profile-panel-top-beam" aria-hidden="true" />
            <div className="profile-panel-ambient-glare" aria-hidden="true" />
            
            {/* Corner architectural ticks */}
            <span className="panel-corner-tick top-left" aria-hidden="true" />
            <span className="panel-corner-tick bottom-right" aria-hidden="true" />

            {/* Panel Topbar */}
            <div className="profile-panel-topbar">
              <div className="profile-panel-badge font-mono">
                <FiUser className="badge-icon" aria-hidden="true" />
                <span>DEVELOPER PROFILE</span>
              </div>
            </div>

            {/* Academic Identity & Compact Metrics */}
            <div className="profile-panel-identity">
              <h3 className="profile-degree">Computer Science &amp; Engineering</h3>
              <p className="profile-institution font-mono">LNCT&amp;S · Bhopal</p>
              <div className="profile-academic-meta font-mono">
                <span className="meta-tag">B.Tech · 2024–2028</span>
                <span className="meta-divider" aria-hidden="true">·</span>
                <span className="meta-tag highlight-cyan">CGPA 8.25 / 10</span>
              </div>
            </div>

            <div className="profile-panel-divider" aria-hidden="true" />

            {/* Section: Beyond The Code / Leadership & Focus */}
            <div className="profile-context-block">
              <span className="profile-context-label font-mono">Beyond The Code</span>
              <ul className="profile-context-list font-mono">
                <li className="profile-context-item">
                  <span className="context-item-bullet" aria-hidden="true" />
                  <span>IEEE Student Branch Secretary</span>
                </li>
                <li className="profile-context-item">
                  <span className="context-item-bullet" aria-hidden="true" />
                  <span>Research-oriented learner</span>
                </li>
                <li className="profile-context-item">
                  <span className="context-item-bullet" aria-hidden="true" />
                  <span>Software projects &amp; independent development</span>
                </li>
              </ul>
            </div>

            <div className="profile-panel-divider" aria-hidden="true" />

            {/* Code-Inspired Focus & Mindset */}
            <div className="profile-code-snippet font-mono" aria-label="Developer structured focus and mindset">
              <div className="code-line">
                <span className="token-keyword">const</span> <span className="token-var">developer</span> <span className="token-op">=</span> <span className="token-brace">&#123;</span>
              </div>
              <div className="code-line indent">
                <span className="token-prop">role</span><span className="token-colon">:</span> <span className="token-str">"CSE Student"</span><span className="token-comma">,</span>
              </div>
              <div className="code-line indent">
                <span className="token-prop">focus</span><span className="token-colon">:</span> <span className="token-bracket">[</span><span className="token-str">"Full-Stack"</span><span className="token-comma">,</span> <span className="token-str">"Core CS"</span><span className="token-comma">,</span> <span className="token-str">"Applied AI"</span><span className="token-bracket">]</span><span className="token-comma">,</span>
              </div>
              <div className="code-line indent">
                <span className="token-prop">mindset</span><span className="token-colon">:</span> <span className="token-str">"Build. Test. Improve."</span>
              </div>
              <div className="code-line">
                <span className="token-brace">&#125;</span><span className="token-semicolon">;</span>
              </div>
            </div>
          </div>

        </div>

        {/* ==================================================================
            LOWER ROW: THE THREE ENGINEERING-FOCUS CARDS (CENTERPIECE)
            Preserved exactly with distinct accent colors, tactile depth & smooth hover
            ================================================================== */}
        <div className="about-pillars-grid" role="region" aria-label="Core Engineering Pillars">
          
          {/* ----------------------------------------------------------------
              CARD 1: Full-Stack Web Engineering (Cyan / Blue Accent)
              ---------------------------------------------------------------- */}
          <div
            ref={(el) => (cardRefs.current[0] = el)}
            className="about-pillar-feature-card card-fullstack"
            onMouseEnter={() => handleCardMouseEnter(0)}
            onMouseMove={(e) => handleCardMouseMove(e, 0)}
            onMouseLeave={() => handleCardMouseLeave(0)}
            style={{ '--stagger-delay': '120ms' }}
          >
            <div className="card-top-beam" aria-hidden="true" />
            <span className="card-corner-marker top-left" aria-hidden="true" />
            <span className="card-corner-marker bottom-right" aria-hidden="true" />

            <div className="card-ambient-glare" aria-hidden="true" />
            
            <div className="card-top-row">
              <div className="pillar-motif-pill font-mono">
                <FiLayers className="pillar-motif-icon" aria-hidden="true" />
                <span>01 · SYSTEMS &amp; WEB ARCHITECTURE</span>
              </div>
            </div>

            <div className="pillar-header-group">
              <h3 className="pillar-feature-title">Full-Stack Web Engineering</h3>
              <p className="pillar-feature-tagline font-mono">
                Typed frontends · Resilient APIs · Relational databases
              </p>
            </div>

            <p className="pillar-feature-description">
              Building end-to-end applications across modern frontends, backend APIs, and relational databases, with an emphasis on clean architecture, data integrity, and reliable user experiences.
            </p>

            <div className="pillar-tenets-list">
              <div className="tenet-item">
                <FiCheckCircle className="tenet-icon" aria-hidden="true" />
                <span><strong>Architecture:</strong> Modular component hierarchies and cohesive, typed API contracts.</span>
              </div>
              <div className="tenet-item">
                <FiCheckCircle className="tenet-icon" aria-hidden="true" />
                <span><strong>Data Layer:</strong> Structured relational schemas, strict constraints, and dependable state.</span>
              </div>
            </div>
          </div>

          {/* ----------------------------------------------------------------
              CARD 2: Core CS & Problem Solving (Violet / Indigo Accent)
              ---------------------------------------------------------------- */}
          <div
            ref={(el) => (cardRefs.current[1] = el)}
            className="about-pillar-feature-card card-algorithms"
            onMouseEnter={() => handleCardMouseEnter(1)}
            onMouseMove={(e) => handleCardMouseMove(e, 1)}
            onMouseLeave={() => handleCardMouseLeave(1)}
            style={{ '--stagger-delay': '240ms' }}
          >
            <div className="card-top-beam" aria-hidden="true" />
            <span className="card-corner-marker top-left" aria-hidden="true" />
            <span className="card-corner-marker bottom-right" aria-hidden="true" />

            <div className="card-ambient-glare" aria-hidden="true" />
            
            <div className="card-top-row">
              <div className="pillar-motif-pill font-mono">
                <FiCpu className="pillar-motif-icon" aria-hidden="true" />
                <span>02 · ALGORITHMIC RIGOR &amp; LOGIC</span>
              </div>
            </div>

            <div className="pillar-header-group">
              <h3 className="pillar-feature-title">Core CS &amp; Problem Solving</h3>
              <p className="pillar-feature-tagline font-mono">
                Data structures · Algorithmic reasoning · OOP principles
              </p>
            </div>

            <p className="pillar-feature-description">
              Strengthening the fundamentals behind good software through data structures, algorithms, object-oriented design, and deliberate problem-solving practice.
            </p>

            <div className="pillar-tenets-list">
              <div className="tenet-item">
                <FiCheckCircle className="tenet-icon" aria-hidden="true" />
                <span><strong>First Principles:</strong> Deconstructing complex challenges into clear, solvable logical components.</span>
              </div>
              <div className="tenet-item">
                <FiCheckCircle className="tenet-icon" aria-hidden="true" />
                <span><strong>Complexity:</strong> Evaluating runtime and memory trade-offs to engineer efficient, scalable solutions.</span>
              </div>
            </div>
          </div>

          {/* ----------------------------------------------------------------
              CARD 3: Applied AI & Practical Innovation (Emerald Green Accent)
              ---------------------------------------------------------------- */}
          <div
            ref={(el) => (cardRefs.current[2] = el)}
            className="about-pillar-feature-card card-applied-ai"
            onMouseEnter={() => handleCardMouseEnter(2)}
            onMouseMove={(e) => handleCardMouseMove(e, 2)}
            onMouseLeave={() => handleCardMouseLeave(2)}
            style={{ '--stagger-delay': '360ms' }}
          >
            <div className="card-top-beam" aria-hidden="true" />
            <span className="card-corner-marker top-left" aria-hidden="true" />
            <span className="card-corner-marker bottom-right" aria-hidden="true" />

            <div className="card-ambient-glare" aria-hidden="true" />
            
            <div className="card-top-row">
              <div className="pillar-motif-pill font-mono">
                <FiCompass className="pillar-motif-icon" aria-hidden="true" />
                <span>03 · APPLIED AI &amp; MODERN TOOLS</span>
              </div>
            </div>

            <div className="pillar-header-group">
              <h3 className="pillar-feature-title">Applied AI &amp; Practical Innovation</h3>
              <p className="pillar-feature-tagline font-mono">
                Deterministic foundations · Bounded AI · Verifiable utility
              </p>
            </div>

            <p className="pillar-feature-description">
              Exploring practical AI integrations while prioritizing sound engineering fundamentals, clear boundaries, and solutions that provide genuine, verifiable value.
            </p>

            <div className="pillar-tenets-list">
              <div className="tenet-item">
                <FiCheckCircle className="tenet-icon" aria-hidden="true" />
                <span><strong>Pragmatic Focus:</strong> Augmenting human workflows rather than relying on unconstrained automation.</span>
              </div>
              <div className="tenet-item">
                <FiCheckCircle className="tenet-icon" aria-hidden="true" />
                <span><strong>Deterministic Core:</strong> Grounding intelligent features in predictable, well-tested application logic.</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default About;
