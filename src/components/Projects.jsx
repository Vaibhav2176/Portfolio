import React, { useState, useEffect } from 'react';
import { 
  FiExternalLink, 
  FiGithub, 
  FiCheckCircle, 
  FiLock, 
  FiArrowUpRight,
  FiShoppingBag,
  FiFileText,
  FiActivity,
  FiLayers,
  FiShield,
  FiTerminal,
  FiCpu,
  FiZap,
  FiSmartphone,
  FiGitCommit,
  FiDatabase,
  FiUsers
} from 'react-icons/fi';
import { projectsData, secondaryProjects } from '../data/portfolioData';
import { 
  PUBLIC_REPOS, 
  BASELINE_COMMITS, 
  fetchLatestCommit, 
  formatRelativeCommitTime, 
  formatAbsoluteCommitDate 
} from '../utils/githubCommits';
import ProjectsCanvas3D from './ProjectsCanvas3D';
import './Projects.css';

/**
 * Projects Component
 * Flagship engineering portfolio showcase matching midnight-blue (#060a14) aesthetic.
 * 
 * Features:
 * - 5 Dedicated, full-width featured project presentations
 * - Authentic 3D spatial atmosphere with ProjectsCanvas3D
 * - Tasteful floating information panels in negative space around visuals
 * - Live, genuine GitHub activity indicators for public repositories
 * - 4 Refined secondary project cards in a balanced responsive grid
 * - Strict accessibility compliance (ARIA labels, keyboard navigation, high contrast)
 */
const Projects = () => {
  // Live GitHub commits state hydrated from baseline to prevent layout shift
  const [repoCommits, setRepoCommits] = useState(() => {
    const initial = {};
    Object.values(PUBLIC_REPOS).forEach((slug) => {
      const base = BASELINE_COMMITS[slug];
      if (base) {
        initial[slug] = {
          ...base,
          relativeTime: formatRelativeCommitTime(base.date)
        };
      }
    });
    return initial;
  });

  // Fetch freshest commit activity in the background
  useEffect(() => {
    let isMounted = true;
    async function loadFreshCommits() {
      const slugs = Object.values(PUBLIC_REPOS);
      const results = await Promise.all(
        slugs.map(async (slug) => {
          const data = await fetchLatestCommit(slug);
          return { slug, data };
        })
      );
      if (isMounted) {
        const updated = {};
        results.forEach(({ slug, data }) => {
          if (data) {
            updated[slug] = {
              ...data,
              relativeTime: formatRelativeCommitTime(data.date)
            };
          }
        });
        setRepoCommits((prev) => ({ ...prev, ...updated }));
      }
    }
    loadFreshCommits();
    return () => {
      isMounted = false;
    };
  }, []);

  // Icon renderer helper for floating panels
  const renderPanelIcon = (iconName, accent) => {
    const cls = `panel-icon text-${accent}`;
    switch (iconName) {
      case 'git-commit': return <FiGitCommit className={cls} aria-hidden="true" />;
      case 'shield': return <FiShield className={cls} aria-hidden="true" />;
      case 'zap': return <FiZap className={cls} aria-hidden="true" />;
      case 'cpu': return <FiCpu className={cls} aria-hidden="true" />;
      case 'terminal': return <FiTerminal className={cls} aria-hidden="true" />;
      case 'lock': return <FiLock className={cls} aria-hidden="true" />;
      case 'smartphone': return <FiSmartphone className={cls} aria-hidden="true" />;
      case 'database': return <FiDatabase className={cls} aria-hidden="true" />;
      case 'users': return <FiUsers className={cls} aria-hidden="true" />;
      default: return <FiActivity className={cls} aria-hidden="true" />;
    }
  };

  // Icon renderer helper for secondary project cards
  const renderSecondaryIcon = (iconType) => {
    switch (iconType) {
      case 'shopping-bag':
        return <FiShoppingBag className="secondary-icon" aria-hidden="true" />;
      case 'file-text':
        return <FiFileText className="secondary-icon text-blue" aria-hidden="true" />;
      case 'activity':
        return <FiActivity className="secondary-icon text-emerald" aria-hidden="true" />;
      case 'layers':
        return <FiLayers className="secondary-icon text-amber" aria-hidden="true" />;
      default:
        return <FiLayers className="secondary-icon" aria-hidden="true" />;
    }
  };

  return (
    <section 
      id="projects" 
      className="projects-editorial-section section"
      aria-label="Featured Software Engineering Projects"
    >
      {/* 3D Atmospheric Background Canvas */}
      <ProjectsCanvas3D />

      {/* Atmospheric Radial Blooms */}
      <div className="projects-background-blooms" aria-hidden="true">
        <div className="projects-ambient-bloom-left" />
        <div className="projects-ambient-bloom-right" />
      </div>

      <div className="container projects-container">
        
        {/* ===================================================================
            SECTION HEADER & INTRODUCTORY COPY
            =================================================================== */}
        <header className="projects-section-header">
          <div className="section-eyebrow-group">
            <span className="eyebrow-label font-mono">Engineering Portfolio</span>
            <span className="eyebrow-divider" aria-hidden="true" />
          </div>
          
          <h2 className="projects-section-title font-heading">
            Featured Projects
          </h2>
          
          <p className="projects-section-subtitle">
            A curated selection of full-stack platforms, autonomous diagnostic engines, 
            and privacy-first applications built for production scale.
          </p>
        </header>

        {/* ===================================================================
            FIVE PRIMARY FEATURED PROJECTS (FULL-WIDTH PRESENTATIONS)
            =================================================================== */}
        <div className="projects-showcase-stack">
          {projectsData.map((project, index) => {
            const isRays = project.id === 'rays-academy';
            const isToolVerse = project.id === 'toolverse';
            const isNetSage = project.id === 'netsage-ai';
            const isNostera = project.id === 'nostera';
            const isHomeSync = project.id === 'homesync';

            // Alternating editorial rhythm: Even = Text Left / Visual Right, Odd = Visual Left / Text Right
            const isReverse = index % 2 !== 0;

            return (
              <article 
                key={project.id} 
                className={`project-card card project-${project.id} ${isReverse ? 'layout-reverse' : ''}`}
                aria-labelledby={`project-title-${project.id}`}
              >
                {/* Luminous Top Highlight Beam */}
                <div className={`project-top-beam beam-${project.id}`} aria-hidden="true" />
                
                {/* Top Meta Bar */}
                <div className="project-topbar">
                  <div className="project-index-group">
                    <span className="project-index font-mono">0{index + 1}</span>
                    <span className="project-category font-mono">{project.category}</span>
                  </div>
                  <div className="project-topbar-right">
                    {/* Special Google Play indicator for Nostera */}
                    {isNostera && project.playStoreStatus && (
                      <span className="google-play-status-pill font-mono text-xs">
                        <svg className="google-play-icon" viewBox="0 0 24 24" width="12" height="12" fill="currentColor" aria-hidden="true">
                          <path d="M3.609 1.814L13.793 12 3.61 22.186a2.38 2.38 0 0 1-.61-.954V2.768c.174-.37.388-.698.61-.954zm11.39 11.39l2.42 2.42-12.016 6.942 9.596-9.362zm0-2.408l-9.596-9.362 12.016 6.942-2.42 2.42zm1.205 1.204l3.666-2.117a1.666 1.666 0 0 1 0 2.895l-3.666 2.117-1.442-1.447 1.442-1.448z" />
                        </svg>
                        <span>{project.playStoreStatus}</span>
                      </span>
                    )}
                    <div className={`project-status-badge status-${project.statusType} font-mono`}>
                      <span className="status-indicator-dot" aria-hidden="true" />
                      <span>{project.status}</span>
                    </div>
                  </div>
                </div>

                {/* 2-Column Content + Visual Layout */}
                <div className="project-inner-grid">

                  {/* =========================================================
                      COLUMN 1: PROJECT CONTENT & SPECIFICATION
                      ========================================================= */}
                  <div className="project-content-col">
                    <div className="project-heading-block">
                      <h3 id={`project-title-${project.id}`} className="project-title font-heading">
                        {project.title}
                      </h3>
                      <p className="project-tagline font-mono">{project.tagline}</p>
                    </div>

                    <p className="project-description">
                      {project.description}
                    </p>

                    {/* Key Capabilities (Strictly 3) */}
                    <div className="project-capabilities-block">
                      <h4 className="capabilities-label font-mono">Key Capabilities</h4>
                      <ul className="capabilities-list">
                        {project.capabilities.map((cap, cIdx) => (
                          <li key={cIdx} className="capability-item">
                            <FiCheckCircle className="capability-icon text-cyan" aria-hidden="true" />
                            <div className="capability-text">
                              <strong className="capability-title">{cap.title}: </strong>
                              <span className="capability-detail">{cap.detail}</span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Concise Tech Stack */}
                    <div className="project-tech-row font-mono" aria-label="Technologies used">
                      {project.tech.map((t, tIdx) => (
                        <span key={tIdx} className="tech-badge">{t}</span>
                      ))}
                    </div>

                    {/* Action Bar & Verified Links */}
                    <div className="project-actions-bar">
                      <div className="action-links-group">
                        {project.live && (
                          <a
                            href={project.live}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-primary project-btn font-mono"
                            aria-label={`Open live platform for ${project.title} (opens in new tab)`}
                          >
                            <span>{project.liveLabel || "Live Platform"}</span>
                            <FiArrowUpRight className="btn-icon-right" aria-hidden="true" />
                          </a>
                        )}
                        {project.github ? (
                          <a
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-secondary project-btn font-mono"
                            aria-label={`View GitHub source code for ${project.title} (opens in new tab)`}
                          >
                            <FiGithub className="btn-icon-left" aria-hidden="true" />
                            <span>{project.githubLabel || "Source Code"}</span>
                          </a>
                        ) : null}
                        {project.statusNote && (
                          <span className="project-status-note font-mono text-xs">
                            <FiLock className="status-note-icon" aria-hidden="true" />
                            <span>{project.statusNote}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* =========================================================
                      COLUMN 2: BESPOKE VISUAL MOCKUP WITH FLOATING PANELS
                      ========================================================= */}
                  <div className="project-visual-col">
                    <div className="project-visual-wrapper">

                      {/* Tasteful Floating Info Panels */}
                      {project.floatingPanels && (
                        <div className="floating-panels-container" aria-label="Project Highlights">
                          {project.floatingPanels.map((panel, pIdx) => {
                            const isCommit = panel.type === 'github-commit';
                            const commitData = isCommit && project.repo ? repoCommits[project.repo] : null;
                            const posClass = `panel-pos-${panel.position}`;
                            const animClass = pIdx % 2 === 0 ? 'floating-panel-a' : 'floating-panel-b';
                            const accentClass = `panel-accent-${panel.accent}`;

                            if (isCommit && commitData) {
                              return (
                                <a
                                  key={panel.id || pIdx}
                                  href={commitData.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={`floating-info-panel ${posClass} ${animClass} ${accentClass} floating-commit-panel`}
                                  title={`Commit ${commitData.sha} on ${formatAbsoluteCommitDate(commitData.date)}: ${commitData.message}`}
                                  aria-label={`GitHub Activity: Last commit ${commitData.relativeTime}`}
                                >
                                  <div className="panel-icon-wrap">
                                    <FiGitCommit className={`panel-icon text-${panel.accent}`} aria-hidden="true" />
                                    <span className="commit-pulse-dot" aria-hidden="true" />
                                  </div>
                                  <div className="panel-text-wrap">
                                    <span className="panel-label font-mono">Last commit</span>
                                    <span className="panel-value font-mono">{commitData.relativeTime}</span>
                                  </div>
                                </a>
                              );
                            }

                            return (
                              <div
                                key={panel.id || pIdx}
                                className={`floating-info-panel ${posClass} ${animClass} ${accentClass}`}
                              >
                                <div className="panel-icon-wrap">
                                  {renderPanelIcon(panel.icon, panel.accent)}
                                </div>
                                <div className="panel-text-wrap">
                                  <span className="panel-label font-mono">{panel.label}</span>
                                  <span className="panel-value">{isCommit ? panel.fallbackValue : panel.value}</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                      
                      {/* 01: Rays Academy — Authentic Clickable Browser Mockup */}
                      {isRays && project.previewImage && (
                        <div className="project-visual-frame browser-mockup-frame">
                          <div className="preview-browser-header">
                            <div className="browser-dots" aria-hidden="true">
                              <span className="b-dot" />
                              <span className="b-dot" />
                              <span className="b-dot" />
                            </div>
                            <span className="browser-url font-mono">raysacademybhopal.in</span>
                            <span className="browser-tag font-mono text-xs text-cyan">Live Portal</span>
                          </div>
                          
                          <a 
                            href={project.live} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="browser-mockup-body interactive-preview-link"
                            aria-label="Inspect live Rays Academy production portal (opens in new tab)"
                          >
                            <img 
                              src={project.previewImage} 
                              alt="Rays Academy Bhopal live education portal hero and study materials catalog"
                              className="project-preview-img"
                              loading="lazy"
                            />
                            <div className="preview-hover-cue font-mono">
                              <span className="cue-icon">↗</span>
                              <span>Visit raysacademybhopal.in</span>
                            </div>
                          </a>
                        </div>
                      )}

                      {/* 02: ToolVerse — Utilities Dashboard Browser Mockup */}
                      {isToolVerse && project.previewImage && (
                        <div className="project-visual-frame browser-mockup-frame toolverse-browser-frame">
                          <div className="preview-browser-header">
                            <div className="browser-dots" aria-hidden="true">
                              <span className="b-dot b-dot-red" />
                              <span className="b-dot b-dot-amber" />
                              <span className="b-dot b-dot-green" />
                            </div>
                            <span className="browser-url font-mono">toolverse-hub.vercel.app</span>
                            <span className="browser-tag font-mono text-xs text-emerald">133+ Utilities Live</span>
                          </div>
                          
                          <a 
                            href={project.live} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="browser-mockup-body interactive-preview-link"
                            aria-label="Launch ToolVerse high-performance browser tools suite (opens in new tab)"
                          >
                            <img 
                              src={project.previewImage} 
                              alt="ToolVerse online developer utilities suite dashboard"
                              className="project-preview-img"
                              loading="lazy"
                            />
                            <div className="preview-hover-cue font-mono">
                              <span className="cue-icon">↗</span>
                              <span>Launch ToolVerse Suite</span>
                            </div>
                          </a>
                        </div>
                      )}

                      {/* 03: NetSage AI — Interactive Terminal Diagnostic Visualizer */}
                      {isNetSage && (
                        <div className="project-visual-frame terminal-mockup-frame netsage-visualizer-frame">
                          <div className="preview-terminal-header font-mono">
                            <div className="browser-dots" aria-hidden="true">
                              <span className="b-dot b-dot-red" />
                              <span className="b-dot b-dot-amber" />
                              <span className="b-dot b-dot-green" />
                            </div>
                            <span className="terminal-title">netsage-ai v1.2 — diagnostic-engine</span>
                            <span className="terminal-mode text-xs text-amber font-mono">Deterministic Core</span>
                          </div>
                          
                          <div className="netsage-terminal-interior font-mono">
                            <div className="term-line term-cmd">
                              <span className="prompt-glyph">&gt;</span>
                              <span className="term-prompt">python -m netsage.diagnostics --target core-router-01</span>
                            </div>
                            <div className="term-line term-output">
                              <span className="stage-tag">[STAGE 1: DETERMINISTIC RULES]</span>
                              <span>Verifying interface logs (34 checks)...</span>
                            </div>
                            <div className="term-line term-pass">
                              <FiCheckCircle className="term-icon text-emerald" aria-hidden="true" />
                              <span>ARP Table Integrity: OK (0 duplicate MACs)</span>
                            </div>
                            <div className="term-line term-pass">
                              <FiCheckCircle className="term-icon text-emerald" aria-hidden="true" />
                              <span>BGP Peering State: ESTABLISHED (148 prefixes)</span>
                            </div>
                            <div className="term-line term-fail">
                              <span className="fail-badge font-bold">FAULT</span>
                              <span>MTU Discrepancy: eth0 MTU (1500) &gt; Tunnel Next-Hop (1420)</span>
                            </div>
                            <div className="term-line term-remediation">
                              <span className="stage-tag">[STAGE 2: GEMINI REMEDIATION]</span>
                              <span className="term-ai">Grounded contextual patch generated.</span>
                            </div>
                            <div className="term-line term-review">
                              <span className="review-badge font-bold">HUMAN REVIEW</span>
                              <span>Administrator:</span>
                              <span className="btn-chip">[Approve]</span>
                              <span className="btn-chip">[Edit]</span>
                              <span className="btn-chip">[Reject]</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* 04: Nostera — Multi-Screen Layered Composition */}
                      {isNostera && (
                        <div className="project-visual-frame nostera-multi-screen-frame">
                          <div className="nostera-layered-device-composition">
                            
                            {/* Left Tilted Device (Moment Capture Flow) */}
                            {project.secondaryScreens && project.secondaryScreens[0] && (
                              <div className="secondary-screen-card screen-card-left" aria-hidden="true">
                                <img 
                                  src={project.secondaryScreens[0]} 
                                  alt="Nostera moment capture interface"
                                  className="secondary-screen-img"
                                  loading="lazy"
                                />
                                <div className="screen-caption-tag font-mono">01 / Capture Flow</div>
                              </div>
                            )}

                            {/* Center Primary Device (Interactive Phone Frame) */}
                            <div className="phone-device-bezel primary-phone-center">
                              <div className="phone-notch-bar">
                                <span className="phone-speaker" />
                                <span className="phone-camera-dot" />
                              </div>
                              <div className="phone-screen-container">
                                {project.previewImage && (
                                  <img 
                                    src={project.previewImage} 
                                    alt="Nostera primary sanctuary timeline and memory vault mobile screen"
                                    className="nostera-preview-img"
                                    loading="lazy"
                                  />
                                )}
                              </div>
                            </div>

                            {/* Right Tilted Device (Reflection Detail View) */}
                            {project.secondaryScreens && project.secondaryScreens[1] && (
                              <div className="secondary-screen-card screen-card-right" aria-hidden="true">
                                <img 
                                  src={project.secondaryScreens[1]} 
                                  alt="Nostera memory reflection details"
                                  className="secondary-screen-img"
                                  loading="lazy"
                                />
                                <div className="screen-caption-tag font-mono">02 / Daily Reflection</div>
                              </div>
                            )}

                          </div>
                        </div>
                      )}

                      {/* 05: HomeSync — Household Workspace Architecture Visualizer */}
                      {isHomeSync && (
                        <div className="project-visual-frame homesync-workspace-frame">
                          <div className="workspace-preview-header font-mono">
                            <div className="workspace-title-group">
                              <FiLayers className="text-blue" aria-hidden="true" />
                              <span className="workspace-name">The Maple Residence</span>
                              <span className="workspace-badge font-mono text-xs">Workspace Active</span>
                            </div>
                            <span className="workspace-members text-xs font-mono">4 Members • Multi-Tenant</span>
                          </div>

                          <div className="workspace-interior-grid font-mono">
                            <div className="workspace-panel chores-panel">
                              <div className="panel-header">
                                <span className="panel-title text-cyan">RECURRING CHORES</span>
                                <span className="panel-tag text-emerald">2 Due Today</span>
                              </div>
                              <div className="panel-list">
                                <div className="chore-item completed">
                                  <FiCheckCircle className="chore-icon text-emerald" aria-hidden="true" />
                                  <span>Kitchen Deep Clean (Assigned: Alex)</span>
                                </div>
                                <div className="chore-item pending">
                                  <span className="chore-dot bg-amber" aria-hidden="true" />
                                  <span>Weekly Recycling Sort (Assigned: Sam)</span>
                                </div>
                              </div>
                            </div>

                            <div className="workspace-panel expense-panel">
                              <div className="panel-header">
                                <span className="panel-title text-blue">EXPENSE LEDGER</span>
                                <span className="panel-tag text-blue">Drizzle Split</span>
                              </div>
                              <div className="panel-list">
                                <div className="expense-row">
                                  <span>Grocery Restock</span>
                                  <span className="expense-amt font-bold">$124.50</span>
                                </div>
                                <div className="expense-row">
                                  <span>High-Speed Fiber</span>
                                  <span className="expense-amt font-bold">$68.00</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="workspace-footer-boundary">
                            <FiShield className="text-blue" aria-hidden="true" />
                            <span>PostgreSQL Row-Level Security (RLS) guarantees absolute cross-household tenant isolation</span>
                          </div>
                        </div>
                      )}

                    </div>
                  </div>

                </div>

              </article>
            );
          })}
        </div>

        {/* ===================================================================
            PHASE 4: SECONDARY PROJECTS SECTION ("MORE PROJECTS")
            =================================================================== */}
        <div className="secondary-projects-section" id="more-projects">
          
          <div className="secondary-projects-header">
            <div className="section-eyebrow-group">
              <span className="eyebrow-label font-mono">Additional Work</span>
              <span className="eyebrow-divider" aria-hidden="true" />
            </div>
            <h3 className="secondary-projects-title font-heading">
              More Projects
            </h3>
            <p className="secondary-projects-subtitle">
              Additional engineering prototypes, open-source utilities, and academic research manuscripts.
            </p>
          </div>

          <div className="secondary-projects-grid">
            {secondaryProjects.map((item) => (
              <article 
                key={item.id} 
                className={`secondary-project-card card secondary-accent-${item.accent}`}
                aria-labelledby={`secondary-title-${item.id}`}
              >
                {/* Luminous Top Accent Beam */}
                <div className={`secondary-top-beam beam-${item.accent}`} aria-hidden="true" />

                {/* 1. Header: Icon, project category/tagline, and status badge */}
                <header className="secondary-card-header">
                  <div className="secondary-header-topline">
                    <div className={`secondary-icon-container icon-accent-${item.accent}`}>
                      {renderSecondaryIcon(item.icon)}
                    </div>
                    <span className="secondary-status-badge font-mono text-xs">{item.status}</span>
                  </div>
                  <span className="secondary-card-tagline font-mono">{item.tagline}</span>
                </header>

                {/* 2. Project Name: Consistent heading alignment */}
                <h4 id={`secondary-title-${item.id}`} className="secondary-project-title font-heading">
                  {item.title}
                </h4>

                {/* 3. Description: Comfortable line height and natural text flow */}
                <p className="secondary-project-desc">
                  {item.description}
                </p>

                {/* 4. Flexible Content Area: Activity strip + Tech badges */}
                <div className="secondary-card-body">
                  {/* Activity Strip: Live commit for public repos, Research manuscript for EduGuard AI */}
                  {item.repo && repoCommits[item.repo] ? (
                    <a
                      href={repoCommits[item.repo].url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="secondary-activity-strip"
                      title={`Latest commit ${repoCommits[item.repo].sha} on ${formatAbsoluteCommitDate(repoCommits[item.repo].date)}: ${repoCommits[item.repo].message}`}
                      aria-label={`GitHub Activity: Last commit ${repoCommits[item.repo].relativeTime}`}
                    >
                      <div className="activity-strip-indicator">
                        <FiGitCommit className={`strip-icon text-${item.accent}`} aria-hidden="true" />
                        <span className="activity-pulse-dot" aria-hidden="true" />
                      </div>
                      <span className="activity-strip-text font-mono">
                        Last commit · {repoCommits[item.repo].relativeTime} · <span className="activity-strip-sha font-mono text-xs">#{repoCommits[item.repo].sha}</span>
                      </span>
                    </a>
                  ) : item.paperUrl ? (
                    <a
                      href={item.paperUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="secondary-activity-strip secondary-research-strip"
                      title="Read academic research paper manuscript (PDF)"
                      aria-label={`Academic Research Manuscript PDF for ${item.title}`}
                    >
                      <div className="activity-strip-indicator">
                        <FiFileText className="strip-icon text-blue" aria-hidden="true" />
                      </div>
                      <span className="activity-strip-text font-mono">
                        Research manuscript · Paper · <span className="activity-strip-sha font-mono text-xs text-blue">#PDF</span>
                      </span>
                      <FiArrowUpRight className="activity-strip-ext text-blue" aria-hidden="true" />
                    </a>
                  ) : null}

                  {/* Technology Badges */}
                  <div className="secondary-tech-row font-mono" aria-label="Technologies used">
                    {item.tech.map((t, idx) => (
                      <span key={idx} className="secondary-tech-badge">{t}</span>
                    ))}
                  </div>
                </div>

                {/* 5 & 6. Divider & Actions: Pinned along the bottom */}
                <footer className="secondary-card-footer">
                  {/* Source Code Action */}
                  {item.github ? (
                    <a
                      href={item.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-secondary secondary-btn font-mono"
                      aria-label={`View GitHub source code for ${item.title} (opens in new tab)`}
                    >
                      <FiGithub className="btn-icon-left" aria-hidden="true" />
                      <span>{item.githubLabel || "Source Code"}</span>
                    </a>
                  ) : (
                    <button
                      type="button"
                      disabled
                      className="btn btn-secondary secondary-btn secondary-btn-disabled font-mono"
                      aria-disabled="true"
                      title="Source code repository pending release"
                    >
                      <FiGithub className="btn-icon-left" aria-hidden="true" />
                      <span>Source (Pending)</span>
                    </button>
                  )}

                  {/* Live Demo Action */}
                  {item.live ? (
                    <a
                      href={item.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary secondary-btn font-mono"
                      aria-label={`Open live demo for ${item.title} (opens in new tab)`}
                    >
                      <FiExternalLink className="btn-icon-left" aria-hidden="true" />
                      <span>{item.liveLabel || "Live Demo"}</span>
                    </a>
                  ) : (
                    <button
                      type="button"
                      disabled
                      className="btn btn-secondary secondary-btn secondary-btn-disabled font-mono"
                      aria-disabled="true"
                      title="Live demo deployment pending setup"
                    >
                      <FiExternalLink className="btn-icon-left" aria-hidden="true" />
                      <span>Demo (Pending)</span>
                    </button>
                  )}
                </footer>
              </article>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};

export default Projects;
