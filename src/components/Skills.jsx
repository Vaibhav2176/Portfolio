import React, { useEffect, useRef, useState } from 'react';
import { 
  FiCode, 
  FiLayout, 
  FiServer, 
  FiDatabase, 
  FiCompass, 
  FiTool, 
  FiLayers, 
  FiCpu 
} from 'react-icons/fi';
import SkillsCanvas3D from './SkillsCanvas3D';
import SkillsHologramTerminal from './SkillsHologramTerminal';
import './Skills.css';

/**
 * Complete 8-category skills data model:
 * Verified technologies directly backed by production projects, coursework, and resume.
 * Configured with content-driven grid spans to eliminate awkward blank space.
 */
const skillCategories = [
  {
    id: 'programming-languages',
    title: 'Programming Languages',
    tag: '01 / LANGUAGES',
    icon: FiCode,
    accentClass: 'card-violet',
    badgeClass: 'badge-violet',
    gridSpanClass: 'span-languages',
    skills: [
      'C++',
      'Java',
      'Python',
      'JavaScript',
      'TypeScript'
    ]
  },
  {
    id: 'frontend-mobile',
    title: 'Frontend & Mobile',
    tag: '02 / FRONTEND & MOBILE',
    icon: FiLayout,
    accentClass: 'card-cyan',
    badgeClass: 'badge-cyan',
    gridSpanClass: 'span-frontend',
    skills: [
      'React',
      'React Native',
      'Expo',
      'Vite',
      'HTML',
      'CSS',
      'Tailwind CSS',
      'shadcn/ui',
      'TanStack Query'
    ]
  },
  {
    id: 'backend-apis',
    title: 'Backend & APIs',
    tag: '03 / BACKEND & APIS',
    icon: FiServer,
    accentClass: 'card-blue',
    badgeClass: 'badge-blue',
    gridSpanClass: 'span-backend',
    skills: [
      'Node.js',
      'Express.js',
      'REST APIs',
      'API Integration',
      'Authentication & Authorization',
      'FastAPI'
    ]
  },
  {
    id: 'databases-data-access',
    title: 'Databases & Data Access',
    tag: '04 / DATABASES & ACCESS',
    icon: FiDatabase,
    accentClass: 'card-emerald',
    badgeClass: 'badge-emerald',
    gridSpanClass: 'span-databases',
    skills: [
      'PostgreSQL',
      'SQL',
      'Supabase',
      'MongoDB',
      'Mongoose',
      'Drizzle ORM',
      'Row-Level Security (RLS)',
      'Schema Design',
      'Access Control'
    ]
  },
  {
    id: 'ai-applications',
    title: 'AI & Applications',
    tag: '05 / APPLIED AI',
    icon: FiCompass,
    accentClass: 'card-teal',
    badgeClass: 'badge-teal',
    gridSpanClass: 'span-ai',
    skills: [
      'Google Gemini API',
      'OpenAI API',
      'Streamlit',
      'Rule-Based Diagnostics'
    ]
  },
  {
    id: 'developer-tools-testing',
    title: 'Developer Tools & Testing',
    tag: '06 / TOOLS & TESTING',
    icon: FiTool,
    accentClass: 'card-amber',
    badgeClass: 'badge-amber',
    gridSpanClass: 'span-tools',
    skills: [
      'Git',
      'GitHub',
      'Vercel',
      'Hostinger',
      'pytest',
      'Vitest',
      'Payment & Webhook Verification',
      'Secure File Uploads',
      'Signed URL Downloads'
    ]
  },
  {
    id: 'system-design-infrastructure',
    title: 'System Design & Infrastructure',
    tag: '07 / INFRASTRUCTURE',
    icon: FiLayers,
    accentClass: 'card-indigo',
    badgeClass: 'badge-indigo',
    gridSpanClass: 'span-infra',
    skills: [
      'Docker',
      'System Design Fundamentals',
      'CI/CD',
      'Linux',
      'Containerization',
      'Deployment & Hosting'
    ]
  },
  {
    id: 'core-computer-science',
    title: 'Core Computer Science',
    tag: '08 / COMPUTER SCIENCE',
    icon: FiCpu,
    accentClass: 'card-purple',
    badgeClass: 'badge-purple',
    gridSpanClass: 'span-core-cs',
    skills: [
      'Data Structures & Algorithms',
      'Object-Oriented Programming (OOP)',
      'Database Management Systems (DBMS)',
      'Computer Networks',
      'Software Engineering',
      'Machine Learning Fundamentals',
      'Problem Solving'
    ]
  }
];

/**
 * Skills Section — Content-Driven Asymmetric Matrix
 * Features:
 * - Content-driven card sizing: wider spans for heavy categories, compact spans for shorter ones
 * - Preserves all 8 categories and every listed skill faithfully
 * - Seamless midnight-blue (#060a14) environment continuing from Hero & About
 * - Receding perspective horizon grid, negative-space floating panels & dual-tone ambient lighting
 * - Restrained 3D physics (tilt <= 2.0 deg), soft localized cursor glare
 * - Accessible, responsive, and performance-optimized
 */
const Skills = () => {
  const cardRefs = useRef([]);
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  // Staggered scroll entrance trigger
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
      { threshold: 0.08 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    const handleResize = () => {
      cardRectsRef.current = {};
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

  // Subtle 3D hover physics (RAF-batched with cached card geometry + scroll compensation, clamped to <= 2.0 deg)
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

      const rotateX = Math.max(-2.0, Math.min(2.0, ((y - centerY) / centerY) * -2.0));
      const rotateY = Math.max(-2.0, Math.min(2.0, ((x - centerX) / centerX) * 2.0));

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-5px)`;
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

  return (
    <section 
      id="skills" 
      ref={sectionRef}
      className={`skills-editorial-section section ${isVisible ? 'is-revealed' : ''}`}
      aria-label="Skills and Technologies"
    >
      {/* 1. Receding 3D Atmospheric Canvas (Ground grid, floating panels, monoliths) */}
      <SkillsCanvas3D />

      {/* 2. Layered Midnight-Blue Atmospheric Depth Overlays & Spatial Lines */}
      <div className="skills-background-washes" aria-hidden="true">
        <div className="skills-depth-plane-gradient" />
        <div className="skills-architectural-lines" />
        <div className="skills-ambient-wash-cyan" />
        <div className="skills-ambient-wash-violet" />
      </div>

      <div className="container skills-container">
        
        {/* ==================================================================
            SECTION HEADER: LABEL, HEADING & UNDERSTATED SUBHEADING
            ================================================================== */}
        <div className="skills-header-copy">
          <div className="section-eyebrow-group">
            <span className="eyebrow-label font-mono">Technical Expertise</span>
            <span className="eyebrow-divider" aria-hidden="true" />
          </div>

          <h2 className="section-title skills-main-title">
            Skills &amp; Technologies
          </h2>

          <p className="skills-subheading font-mono">
            Technologies and fundamentals I use to design, build, and improve software.
          </p>
        </div>

        {/* ==================================================================
            CONTENT-DRIVEN ASYMMETRIC GRID:
            Row 1: 01 (span 3) + 02 (span 5) + 03 (span 4) = 12
            Row 2: 04 (span 7) + 05 (span 5) = 12
            Row 3: 06 (span 5) + 07 (span 3) + 08 (span 4) = 12
            ================================================================== */}
        <div className="skills-cards-grid" role="region" aria-label="Skill Categories">
          {skillCategories.map((cat, index) => {
            const IconComponent = cat.icon;
            const isToolsCard = cat.id === 'developer-tools-testing';

            const cardContent = (
              <div
                key={cat.id}
                ref={(el) => (cardRefs.current[index] = el)}
                className={`skill-category-card ${cat.accentClass} ${isToolsCard ? '' : cat.gridSpanClass}`}
                onMouseEnter={() => handleCardMouseEnter(index)}
                onMouseMove={(e) => handleCardMouseMove(e, index)}
                onMouseLeave={() => handleCardMouseLeave(index)}
                style={{ '--stagger-delay': `${index * 60}ms` }}
              >
                {/* Hairline top highlight & corner accents */}
                <div className="card-top-beam" aria-hidden="true" />
                <span className="card-corner-marker top-left" aria-hidden="true" />
                <span className="card-corner-marker bottom-right" aria-hidden="true" />
                <div className="card-ambient-glare" aria-hidden="true" />

                {/* Card Header: Category Badge & Title */}
                <div className="category-card-topbar">
                  <div className={`category-badge font-mono ${cat.badgeClass}`}>
                    <IconComponent className="category-icon" aria-hidden="true" />
                    <span>{cat.tag}</span>
                  </div>
                </div>

                <h3 className="category-card-title">{cat.title}</h3>

                {/* Clean skill names list / pills */}
                <div className="category-skills-wrap font-mono">
                  {cat.skills.map((skill) => (
                    <span key={skill} className="skill-item-pill">
                      <span className="pill-indicator-dot" aria-hidden="true" />
                      <span className="pill-text">{skill}</span>
                    </span>
                  ))}
                </div>
              </div>
            );

            if (isToolsCard) {
              return (
                <div key="group-tools" className="skills-tools-column-group span-tools">
                  {cardContent}
                  <SkillsHologramTerminal />
                </div>
              );
            }

            return cardContent;
          })}
        </div>

      </div>
    </section>
  );
};

export default Skills;
