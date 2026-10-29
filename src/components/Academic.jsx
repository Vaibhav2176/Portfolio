import React, { useEffect, useRef, useState } from 'react';
import { 
  FiAward, 
  FiBookOpen, 
  FiCalendar, 
  FiCheckCircle, 
  FiDownload, 
  FiExternalLink, 
  FiFileText, 
  FiMapPin, 
  FiTrendingUp, 
  FiShield, 
  FiLayers,
  FiCompass,
  FiGlobe
} from 'react-icons/fi';
import AcademicCanvas3D from './AcademicCanvas3D';
import './Academic.css';

/**
 * Semester academic progression data (Strictly verified results only):
 * Semester 1: SGPA 8.05, CGPA 8.05
 * Semester 2: SGPA 8.25, CGPA 8.15
 * Semester 3: SGPA 8.42, CGPA 8.25
 * Semester 4: In Progress / Pending (Unpublished)
 */
const semesterProgression = [
  {
    sem: 'Semester 1',
    term: '2024',
    sgpa: '8.05',
    cgpa: '8.05',
    status: 'Completed',
    isCompleted: true
  },
  {
    sem: 'Semester 2',
    term: '2024',
    sgpa: '8.25',
    cgpa: '8.15',
    status: 'Completed',
    isCompleted: true
  },
  {
    sem: 'Semester 3',
    term: '2025',
    sgpa: '8.42',
    cgpa: '8.25',
    status: 'Completed',
    isCompleted: true,
    highlight: 'Highest SGPA'
  },
  {
    sem: 'Semester 4',
    term: '2025',
    sgpa: '—',
    cgpa: '—',
    status: 'In Progress',
    isCompleted: false
  }
];

/**
 * Secondary & Higher Secondary Education (Verified CBSE records)
 */
const schoolEducation = [
  {
    id: 'class-xii',
    tag: '02 / CLASS XII (SENIOR SECONDARY)',
    title: 'Class XII — Senior Secondary (PCM)',
    institution: 'Mithi Gobindram Public School',
    location: 'Bhopal, Madhya Pradesh',
    board: 'CBSE Board',
    year: '2024',
    score: '92.0%',
    scoreLabel: 'Aggregate Distinction',
    details: 'Majored in Physics, Chemistry, and Mathematics (PCM), building strong quantitative reasoning, analytical thinking, and scientific problem-solving foundations.'
  },
  {
    id: 'class-x',
    tag: '03 / CLASS X (SECONDARY EDUCATION)',
    title: 'Class X — Secondary Education',
    institution: 'Mithi Gobindram Public School',
    location: 'Bhopal, Madhya Pradesh',
    board: 'CBSE Board',
    year: '2022',
    score: '87.7%',
    scoreLabel: 'Aggregate Distinction',
    details: 'Secondary curriculum completed with top distinctions across Mathematics, Science, and Social Studies, setting the technical trajectory for computer science.'
  }
];

/**
 * Verified Technical Certifications & Credentials
 * Includes verified source records, NPTEL, Cisco, NASSCOM, and newly verified certificates
 */
const technicalCertifications = [
  {
    id: 'nptel-java',
    title: 'Programming in Java',
    issuer: 'NPTEL (IIT Kharagpur)',
    result: '92% • Elite + Gold Medal',
    category: 'Core Computer Science',
    badgeType: 'gold',
    pdfUrl: '/certificates/NPTEL_Programming_in_Java_Elite_Gold.pdf',
    fileName: 'NPTEL_Programming_in_Java_Elite_Gold.pdf'
  },
  {
    id: 'nptel-dsa',
    title: 'Data Structures & Algorithms Design',
    issuer: 'NPTEL (IIT Madras)',
    result: 'Consolidated Score: 52%',
    category: 'Core Computer Science',
    badgeType: 'standard',
    pdfUrl: '/certificates/NPTEL_Data_Structures_and_Algorithms_Design.pdf',
    fileName: 'NPTEL_Data_Structures_and_Algorithms_Design.pdf'
  },
  {
    id: 'cisco-virtual-internship',
    title: 'Cisco AICTE Virtual Internship Program 2026',
    issuer: 'Cisco Networking Academy • Supported by AICTE',
    result: 'Virtual Internship in AI • June–August 2026',
    category: 'Artificial Intelligence',
    badgeType: 'gold',
    pdfUrl: '/certificates/Cisco_AICTE_Virtual_Internship_Program_2026.pdf',
    fileName: 'Cisco_AICTE_Virtual_Internship_Program_2026.pdf'
  },
  {
    id: 'cisco-ai',
    title: 'Introduction to Modern AI',
    issuer: 'Cisco Networking Academy',
    result: 'Completed Coursework',
    category: 'AI & Networking',
    badgeType: 'standard',
    pdfUrl: '/certificates/Cisco_Intro_to_Modern_AI.pdf',
    fileName: 'Cisco_Intro_to_Modern_AI.pdf'
  },
  {
    id: 'cisco-reviews',
    title: 'Apply AI: Analyze Customer Reviews',
    issuer: 'Cisco Networking Academy',
    result: 'Completed Coursework',
    category: 'Applied NLP',
    badgeType: 'standard',
    pdfUrl: '/certificates/Cisco_Apply_AI_Analyze_Customer_Reviews.pdf',
    fileName: 'Cisco_Apply_AI_Analyze_Customer_Reviews.pdf'
  },
  {
    id: 'cisco-analytics',
    title: 'Data Analytics Essentials',
    issuer: 'Cisco Networking Academy',
    result: 'Completed Coursework',
    category: 'Data Systems',
    badgeType: 'standard',
    pdfUrl: '/certificates/Cisco_Data_Analytics_Essentials.pdf',
    fileName: 'Cisco_Data_Analytics_Essentials.pdf'
  },
  {
    id: 'cisco-iot',
    title: 'Introduction to IoT and Digital Transformation',
    issuer: 'Cisco Networking Academy',
    result: 'Completed Coursework',
    category: 'IoT & Systems',
    badgeType: 'standard',
    pdfUrl: '/certificates/Cisco_IoT_Course_Certificate.pdf',
    fileName: 'Cisco_IoT_Course_Certificate.pdf'
  },
  {
    id: 'nasscom-vibe',
    title: 'AI Assisted Application Development (Vibe Coding)',
    issuer: 'NASSCOM',
    result: '100% Score (Gold)',
    category: 'AI & Engineering',
    badgeType: 'gold',
    pdfUrl: '/certificates/NASSCOM_Vibe_Coding.pdf',
    fileName: 'NASSCOM_Vibe_Coding.pdf'
  },
  {
    id: 'nasscom-prompt',
    title: 'Prompt Engineering and ChatGPT',
    issuer: 'NASSCOM',
    result: '85% Score (Gold)',
    category: 'Applied AI',
    badgeType: 'gold',
    pdfUrl: '/certificates/NASSCOM_Prompt_Engineering.pdf',
    fileName: 'NASSCOM_Prompt_Engineering.pdf'
  },
  {
    id: 'experiential-learning',
    title: 'Experiential Learning',
    issuer: 'FutureSkills Prime / NASSCOM (MeitY, Govt. of India)',
    result: 'Essentials of Solution Development in IT',
    category: 'Software Engineering',
    badgeType: 'gold',
    pdfUrl: '/certificates/Experiential_Learning.pdf',
    fileName: 'Experiential_Learning.pdf'
  },
  {
    id: 'accenture-ascend',
    title: 'AI Fundamentals (ASCEND)',
    issuer: 'Accenture',
    result: 'Completed Program',
    category: 'Enterprise Tech',
    badgeType: 'standard',
    pdfUrl: '/certificates/Accenture_AI_Fundamentals_ASCEND.pdf',
    fileName: 'Accenture_AI_Fundamentals_ASCEND.pdf'
  },
  {
    id: 'futureskills-iot',
    title: 'IoT & Digital Transformation',
    issuer: 'FutureSkills Prime',
    result: 'Silver Recognition',
    category: 'IoT & Systems',
    badgeType: 'silver',
    pdfUrl: '/certificates/FutureSkills_Prime_IoT_Digital_Transformation.pdf',
    fileName: 'FutureSkills_Prime_IoT_Digital_Transformation.pdf'
  }
];

/**
 * Verified Research Papers & Academic Manuscripts
 * Sourced from actual repository documents in public/
 */
const academicManuscripts = [
  {
    id: 'eduguard-ai',
    tag: '01 / RESEARCH MANUSCRIPT',
    title: 'EduGuard AI — AI-Based Student Performance Prediction and Early Warning System',
    type: 'Research Manuscript',
    status: 'Completed Research Project',
    docFormat: 'PDF Document',
    fileSize: '746 KB',
    description: 'Investigated predictive machine learning architectures to forecast academic risk trajectories and enable proactive institutional intervention before course failure.',
    technologies: ['XGBoost', 'LSTM', 'Graph Neural Networks (GNN)', 'Risk Modeling'],
    fileUrl: '/AI Based Student Performance Prediction and Early Warning System (Short).pdf',
    fileName: 'AI Based Student Performance Prediction and Early Warning System (Short).pdf'
  },
  {
    id: 'threat-prevention',
    tag: '02 / ACADEMIC MANUSCRIPT',
    title: 'Proactive Cyber Threat Prevention Using Ethical Hacking: A Six-Phase Integration Model',
    type: 'Academic Manuscript',
    status: 'Completed Manuscript',
    docFormat: 'DOCX Document',
    fileSize: '1.7 MB',
    description: 'Formulated a structured six-phase proactive penetration testing and preventative hardening framework for enterprise perimeter security.',
    technologies: ['Ethical Hacking', 'Threat Modeling', 'Vulnerability Assessment', 'Network Security'],
    fileUrl: '/Ethical Hacking and Cybersecurity.docx',
    fileName: 'Ethical Hacking and Cybersecurity.docx'
  }
];

/**
 * Verified Academic & Institutional Achievements (Zero EPAM)
 */
const academicAchievements = [
  {
    id: 'ieee-leadership',
    tag: '01 / EXECUTIVE LEADERSHIP',
    badge: 'Active Term • LNCT&S',
    title: 'Secretary, IEEE Student Branch Executive Committee, LNCTS.',
    description: 'Appointed Secretary of the IEEE Student Branch Executive Committee at LNCT&S, driving institutional technical workshops, programming symposiums, and student engineering hackathons. IEEE Student Member valid through December 2026.',
    certificateUrl: '/certificates/IEEE_Membership_Certificate.pdf',
    certificateLabel: 'View IEEE Executive Credential (PDF)'
  },
  {
    id: 'rgpv-nodal-drama',
    tag: '02 / UNIVERSITY DISTINCTION',
    badge: 'Double Gold Medals',
    title: 'Won Gold Medals in One Act Play and Mime as part of the LNCTS team, which secured Overall First Prize at the 2025 RGPV Nodal Level Art & Drama Competition.',
    description: 'Personally awarded individual Gold Medals in both One Act Play and Mime categories, leading the theatrical and dramatic execution as part of the LNCT&S contingent that claimed the prestigious Overall Championship Trophy.',
    meta: 'Rajiv Gandhi Proudyogiki Vishwavidyalaya (RGPV) • 2025'
  }
];

/**
 * Additional Information categories (Preserved exact wording & meaning)
 */
const additionalInformation = {
  technicalInterests: [
    'Backend Engineering',
    'System Design',
    'Database Management',
    'API Development',
    'Cloud Computing',
    'DevOps',
    'Cybersecurity'
  ],
  hobbies: [
    'Watching Cricket',
    'Movies and TV Shows',
    'Playing Chess',
    'Listening to Music'
  ],
  languages: [
    'English',
    'Hindi',
    'Sindhi',
    'Spanish'
  ]
};

const Academic = () => {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  const rafRef = useRef(null);
  const cardRectRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.08 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    const handleResize = () => {
      cardRectRef.current = null;
    };
    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', handleResize);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  // Subtle 3D hover physics (RAF-batched with cached card geometry + scroll compensation, clamped to <= 2.0 deg)
  const handleCardMouseEnter = (e) => {
    if (e.currentTarget) {
      const rect = e.currentTarget.getBoundingClientRect();
      cardRectRef.current = {
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height,
        scrollY: window.scrollY,
        scrollX: window.scrollX
      };
    }
  };

  const handleCardMouseMove = (e) => {
    if (window.innerWidth < 1024) return;

    const card = e.currentTarget;
    if (!card) return;
    const clientX = e.clientX;
    const clientY = e.clientY;

    if (rafRef.current) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      if (!card.isConnected) return;
      if (!cardRectRef.current) {
        const rect = card.getBoundingClientRect();
        cardRectRef.current = {
          left: rect.left,
          top: rect.top,
          width: rect.width,
          height: rect.height,
          scrollY: window.scrollY,
          scrollX: window.scrollX
        };
      }
      const cached = cardRectRef.current;
      if (!cached || !cached.width || !cached.height) return;

      const currentLeft = cached.left - (window.scrollX - cached.scrollX);
      const currentTop = cached.top - (window.scrollY - cached.scrollY);
      const x = clientX - currentLeft;
      const y = clientY - currentTop;

      const centerX = cached.width / 2;
      const centerY = cached.height / 2;

      const rotateX = Math.max(-2.0, Math.min(2.0, ((y - centerY) / centerY) * -2.0));
      const rotateY = Math.max(-2.0, Math.min(2.0, ((x - centerX) / centerX) * 2.0));

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  };

  const handleCardMouseLeave = (e) => {
    cardRectRef.current = null;
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    const card = e.currentTarget;
    if (!card) return;
    card.style.transform = '';
  };

  return (
    <section 
      id="academic" 
      ref={sectionRef}
      className={`academic-editorial-section section ${isVisible ? 'is-revealed' : ''}`}
      aria-label="Academic Background and Education"
    >
      {/* Anchor alias so legacy navigation '#experience' links target here */}
      <span id="experience" className="academic-anchor-alias" aria-hidden="true" />

      {/* 1. Atmospheric 3D Canvas */}
      <AcademicCanvas3D />

      {/* 2. Layered Midnight-Blue Atmosphere Overlays */}
      <div className="academic-depth-plane-gradient" aria-hidden="true" />
      <div className="academic-architectural-lines" aria-hidden="true" />
      <div className="academic-ambient-wash-cyan" aria-hidden="true" />
      <div className="academic-ambient-wash-violet" aria-hidden="true" />

      <div className="container academic-container">
        
        {/* ==================================================================
            SECTION HEADER
            ================================================================== */}
        <div className="academic-header-copy">
          <div className="section-eyebrow-group">
            <span className="eyebrow-label font-mono">Academic Foundation &amp; Progression</span>
            <span className="eyebrow-divider" aria-hidden="true" />
          </div>

          <h2 className="section-title academic-main-title">
            Education &amp; Academic Milestones
          </h2>

          <p className="academic-subheading font-mono">
            Formal computer science education, verified semester metrics, and foundational quantitative training.
          </p>
        </div>

        {/* ==================================================================
            1. PRIMARY SPOTLIGHT: B.TECH DEGREE & SEMESTER PROGRESSION
            ================================================================== */}
        <div 
          className="academic-hero-spotlight"
          onMouseEnter={handleCardMouseEnter}
          onMouseMove={handleCardMouseMove}
          onMouseLeave={handleCardMouseLeave}
        >
          {/* Top highlight beam, corner markers, and ambient glare */}
          <div className="card-top-beam" aria-hidden="true" />
          <span className="card-corner-marker top-left" aria-hidden="true" />
          <span className="card-corner-marker bottom-right" aria-hidden="true" />
          <div className="card-ambient-glare" aria-hidden="true" />

          <div className="spotlight-content-grid">
            
            {/* Left Column: Degree & Institutional Identity */}
            <div className="spotlight-left-column">
              <div className="degree-badge-strip">
                <span className="degree-category-pill font-mono">01 / PRIMARY QUALIFICATION</span>
                <span className="degree-status-pill font-mono">Currently Enrolled • 2nd Year</span>
              </div>

              <h3 className="spotlight-degree-title">
                Bachelor of Technology in Computer Science &amp; Engineering
              </h3>

              <div className="spotlight-institution-meta font-mono">
                <div className="meta-line">
                  <FiBookOpen className="meta-icon" aria-hidden="true" />
                  <span className="institution-name">Lakshmi Narain College of Technology &amp; Science (LNCT&amp;S)</span>
                </div>
                <div className="meta-subline">
                  <span className="meta-item"><FiMapPin className="meta-icon-sm" aria-hidden="true" /> Bhopal, Madhya Pradesh, India</span>
                  <span className="meta-sep" aria-hidden="true">•</span>
                  <span className="meta-item"><FiCalendar className="meta-icon-sm" aria-hidden="true" /> 2024 — 2028</span>
                  <span className="meta-sep" aria-hidden="true">•</span>
                  <span className="meta-item">Affiliated to RGPV</span>
                </div>
              </div>

              <p className="spotlight-summary">
                Structured undergraduate curriculum centered on rigorous computing fundamentals, algorithm design, software architecture, and distributed systems engineering.
              </p>

              {/* Core Academic Disciplines */}
              <div className="spotlight-focus-tags font-mono">
                <span className="focus-pill"><span className="dot" aria-hidden="true" />Data Structures &amp; Algorithms</span>
                <span className="focus-pill"><span className="dot" aria-hidden="true" />Object-Oriented Programming (OOP)</span>
                <span className="focus-pill"><span className="dot" aria-hidden="true" />Database Management Systems (DBMS)</span>
                <span className="focus-pill"><span className="dot" aria-hidden="true" />Computer Networks</span>
                <span className="focus-pill"><span className="dot" aria-hidden="true" />Software Engineering</span>
              </div>
            </div>

            {/* Right Column: Semester Trajectory Display */}
            <div className="spotlight-right-column">
              <div className="metric-headline-box">
                <span className="metric-label font-mono">CUMULATIVE GRADE POINT AVERAGE</span>
                <div className="metric-score-group">
                  <span className="metric-value font-mono">8.25</span>
                  <span className="metric-scale font-mono">/ 10.0</span>
                </div>
                <span className="metric-status-note font-mono">Verified across Semesters 1–3</span>
              </div>

              {/* Semester Milestones Cards */}
              <div className="semester-timeline-matrix" role="region" aria-label="Semester-wise SGPA and CGPA">
                <div className="timeline-matrix-header font-mono">
                  <span>Semester</span>
                  <span>SGPA</span>
                  <span>Cumulative</span>
                  <span>Status</span>
                </div>

                {semesterProgression.map((item) => (
                  <div 
                    key={item.sem} 
                    className={`semester-row-item font-mono ${item.isCompleted ? 'is-complete' : 'is-pending'}`}
                  >
                    <div className="sem-name-col">
                      <span className="sem-title">{item.sem}</span>
                      {item.highlight && <span className="sem-trend-badge"><FiTrendingUp aria-hidden="true" /> {item.highlight}</span>}
                    </div>

                    <div className="sem-sgpa-col">
                      <span className="score-val">{item.sgpa}</span>
                    </div>

                    <div className="sem-cgpa-col">
                      <span className="score-val highlight">{item.cgpa}</span>
                    </div>

                    <div className="sem-status-col">
                      <span className={`status-pill ${item.isCompleted ? 'status-done' : 'status-current'}`}>
                        {item.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* ==================================================================
            2. FOUNDATIONAL SCHOOL EDUCATION (CLASS XII & CLASS X)
            ================================================================== */}
        <div className="academic-secondary-grid">
          {schoolEducation.map((school) => (
            <div
              key={school.id}
              className="academic-school-card"
              onMouseEnter={handleCardMouseEnter}
              onMouseMove={handleCardMouseMove}
              onMouseLeave={handleCardMouseLeave}
            >
              <div className="card-top-beam" aria-hidden="true" />
              <span className="card-corner-marker top-left" aria-hidden="true" />
              <span className="card-corner-marker bottom-right" aria-hidden="true" />
              <div className="card-ambient-glare" aria-hidden="true" />

              <div className="school-card-topbar font-mono">
                <span className="school-tag">{school.tag}</span>
                <span className="school-score-badge">{school.score}</span>
              </div>

              <h4 className="school-title">{school.title}</h4>

              <div className="school-meta font-mono">
                <span className="meta-inst">{school.institution}</span>
                <span className="meta-details">{school.board} • {school.year} • {school.location}</span>
              </div>

              <p className="school-details">
                {school.details}
              </p>

              <div className="school-footer-badge font-mono">
                <FiCheckCircle className="badge-icon" aria-hidden="true" />
                <span>{school.scoreLabel}</span>
              </div>
            </div>
          ))}
        </div>

        {/* ==================================================================
            3. TECHNICAL CERTIFICATIONS & CREDENTIALS
            ================================================================== */}
        <div 
          className="academic-certifications-block"
          onMouseEnter={handleCardMouseEnter}
          onMouseMove={handleCardMouseMove}
          onMouseLeave={handleCardMouseLeave}
        >
          <div className="card-top-beam" aria-hidden="true" />
          <span className="card-corner-marker top-left" aria-hidden="true" />
          <span className="card-corner-marker bottom-right" aria-hidden="true" />

          <div className="strip-header">
            <div className="strip-eyebrow font-mono">
              <FiCheckCircle className="strip-icon" aria-hidden="true" />
              <span>TECHNICAL CERTIFICATIONS &amp; CREDENTIALS</span>
            </div>
            <p className="strip-caption font-mono">
              Verified external certifications across algorithms, artificial intelligence, software engineering, and industry programs.
            </p>
          </div>

          <div className="certifications-grid font-mono">
            {technicalCertifications.map((cert) => (
              <div key={cert.id} className="cred-tile">
                <div className="cred-tile-top">
                  <span className="cred-category">{cert.category}</span>
                  {cert.pdfUrl && (
                    <a
                      href={encodeURI(cert.pdfUrl)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cred-view-link"
                      aria-label={`View certificate for ${cert.title} (PDF)`}
                      title="View verified certificate document"
                    >
                      <FiExternalLink /> <span>View PDF</span>
                    </a>
                  )}
                </div>

                <h5 className="cred-title">{cert.title}</h5>
                <span className="cred-issuer">{cert.issuer}</span>
                
                <div className={`cred-result-badge badge-${cert.badgeType}`}>
                  <span className="cred-dot" aria-hidden="true" />
                  <span>{cert.result}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ==================================================================
            4. RESEARCH & ACADEMIC MANUSCRIPTS
            ================================================================== */}
        <div 
          className="academic-research-block"
          onMouseEnter={handleCardMouseEnter}
          onMouseMove={handleCardMouseMove}
          onMouseLeave={handleCardMouseLeave}
        >
          <div className="card-top-beam" aria-hidden="true" />
          <span className="card-corner-marker top-left" aria-hidden="true" />
          <span className="card-corner-marker bottom-right" aria-hidden="true" />

          <div className="strip-header">
            <div className="strip-eyebrow font-mono">
              <FiBookOpen className="strip-icon" aria-hidden="true" />
              <span>RESEARCH PAPERS &amp; ACADEMIC MANUSCRIPTS</span>
            </div>
            <p className="strip-caption font-mono">
              Independent applied research manuscripts in predictive machine learning architectures and defensive cybersecurity.
            </p>
          </div>

          <div className="academic-research-grid">
            {academicManuscripts.map((paper) => (
              <div key={paper.id} className="research-card">
                <div className="research-card-topbar font-mono">
                  <span className="research-tag">{paper.tag}</span>
                  <span className="research-doc-pill">
                    <FiFileText className="pill-icon" aria-hidden="true" />
                    {paper.docFormat}
                  </span>
                </div>

                <h4 className="research-card-title">{paper.title}</h4>

                <div className="research-meta-row font-mono">
                  <span className="research-status-badge">{paper.status}</span>
                  <span className="meta-sep" aria-hidden="true">•</span>
                  <span className="research-filesize">{paper.fileSize}</span>
                </div>

                <p className="research-card-desc">
                  {paper.description}
                </p>

                {/* Technologies / Keywords */}
                <div className="research-tech-pills font-mono">
                  {paper.technologies.map((tech) => (
                    <span key={tech} className="tech-badge">{tech}</span>
                  ))}
                </div>

                {/* Document Action Link */}
                <div className="research-card-footer">
                  <a
                    href={encodeURI(paper.fileUrl)}
                    download={paper.fileName}
                    className="btn btn-secondary research-btn font-mono"
                    aria-label={`Download ${paper.title} (${paper.docFormat})`}
                  >
                    <FiDownload className="btn-icon" aria-hidden="true" />
                    <span>Download {paper.docFormat.includes('PDF') ? 'Manuscript (PDF)' : 'Manuscript (DOCX)'}</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ==================================================================
            5. HONORS & INSTITUTIONAL ACHIEVEMENTS (ZERO EPAM)
            ================================================================== */}
        <div 
          className="academic-achievements-block"
          onMouseEnter={handleCardMouseEnter}
          onMouseMove={handleCardMouseMove}
          onMouseLeave={handleCardMouseLeave}
        >
          <div className="card-top-beam" aria-hidden="true" />
          <span className="card-corner-marker top-left" aria-hidden="true" />
          <span className="card-corner-marker bottom-right" aria-hidden="true" />

          <div className="strip-header">
            <div className="strip-eyebrow font-mono">
              <FiAward className="strip-icon" aria-hidden="true" />
              <span>HONORS &amp; INSTITUTIONAL ACHIEVEMENTS</span>
            </div>
            <p className="strip-caption font-mono">
              Verified collegiate leadership positions and university-level competition awards.
            </p>
          </div>

          <div className="academic-achievements-grid">
            {academicAchievements.map((item) => (
              <div key={item.id} className="achievement-card">
                <div className="achievement-topbar font-mono">
                  <span className="achievement-tag">{item.tag}</span>
                  <span className={`achievement-term-pill ${item.badge.includes('Gold') ? 'badge-gold-pill' : ''}`}>
                    {item.badge}
                  </span>
                </div>

                <h4 className="achievement-title">
                  {item.title}
                </h4>

                <p className="achievement-desc">
                  {item.description}
                </p>

                <div className="achievement-footer font-mono">
                  {item.certificateUrl ? (
                    <a 
                      href={encodeURI(item.certificateUrl)} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="achievement-link"
                      aria-label={item.certificateLabel}
                    >
                      <FiExternalLink /> <span>{item.certificateLabel}</span>
                    </a>
                  ) : (
                    <span className="achievement-badge-meta">
                      <FiAward className="badge-icon" /> {item.meta}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ==================================================================
            6. ADDITIONAL INFORMATION
            ================================================================== */}
        <div 
          className="academic-additional-info-block"
          onMouseEnter={handleCardMouseEnter}
          onMouseMove={handleCardMouseMove}
          onMouseLeave={handleCardMouseLeave}
        >
          <div className="card-top-beam" aria-hidden="true" />
          <span className="card-corner-marker top-left" aria-hidden="true" />
          <span className="card-corner-marker bottom-right" aria-hidden="true" />

          <div className="strip-header">
            <div className="strip-eyebrow font-mono">
              <FiLayers className="strip-icon" aria-hidden="true" />
              <span>ADDITIONAL INFORMATION</span>
            </div>
            <p className="strip-caption font-mono">
              Core technical engineering interests, analytical recreations, and spoken languages.
            </p>
          </div>

          <div className="additional-info-grid">
            {/* Category 1: Technical Interests */}
            <div className="info-group-card">
              <div className="info-group-header font-mono">
                <FiLayers className="info-icon text-cyan" aria-hidden="true" />
                <h5 className="info-group-title">Technical Interests</h5>
              </div>
              <div className="info-tags-container font-mono">
                {additionalInformation.technicalInterests.map((interest) => (
                  <span key={interest} className="info-tag-pill interest-pill">{interest}</span>
                ))}
              </div>
            </div>

            {/* Category 2: Hobbies */}
            <div className="info-group-card">
              <div className="info-group-header font-mono">
                <FiCompass className="info-icon text-violet" aria-hidden="true" />
                <h5 className="info-group-title">Hobbies</h5>
              </div>
              <div className="info-tags-container font-mono">
                {additionalInformation.hobbies.map((hobby) => (
                  <span key={hobby} className="info-tag-pill hobby-pill">{hobby}</span>
                ))}
              </div>
            </div>

            {/* Category 3: Languages */}
            <div className="info-group-card">
              <div className="info-group-header font-mono">
                <FiGlobe className="info-icon text-emerald" aria-hidden="true" />
                <h5 className="info-group-title">Languages</h5>
              </div>
              <div className="info-tags-container font-mono">
                {additionalInformation.languages.map((lang) => (
                  <span key={lang} className="info-tag-pill lang-pill">{lang}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Academic;
