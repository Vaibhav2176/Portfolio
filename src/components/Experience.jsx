import React, { useState } from 'react';
import { FiAward, FiBookOpen, FiDownload, FiCheck, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { educationData, certifications, leadershipAndAchievements, researchPapers } from '../data/portfolioData';
import './Experience.css';

const Experience = () => {
  const [showSemesters, setShowSemesters] = useState(false);

  return (
    <section id="experience" className="section" aria-label="Education, Academic Record, and Achievements">
      <div className="section-ambient-wash" aria-hidden="true" />
      <div className="container">
        
        <div className="section-header">
          <div className="section-eyebrow-group">
            <span className="eyebrow-label">Academic Record & Credentials</span>
            <div className="eyebrow-divider" aria-hidden="true" />
          </div>
          <h2 className="section-title">Academic rigor, leadership milestones & continuous learning.</h2>
          <p className="section-description">
            Documented engineering education, verified semester performance, technical certifications, and institutional leadership roles.
          </p>
        </div>

        {/* Education Record Cards */}
        <div className="education-grid">
          {educationData.map((item, index) => (
            <div key={index} className="education-card card">
              <div className="edu-top-row">
                <span className="edu-degree font-heading">{item.degree}</span>
                <span className="edu-score font-mono">{item.score}</span>
              </div>
              <h4 className="edu-institution">{item.institution}</h4>
              <div className="edu-meta font-mono">
                <span>{item.period}</span>
                <span className="meta-bullet">·</span>
                <span className="edu-status">{item.status}</span>
              </div>
              <p className="edu-details">{item.details}</p>

              {/* Semester Breakdown toggle for Degree */}
              {item.semesters && (
                <div className="semester-breakdown-box">
                  <button 
                    type="button"
                    className="semester-toggle-btn font-mono"
                    onClick={() => setShowSemesters(!showSemesters)}
                    aria-expanded={showSemesters}
                  >
                    <span>{showSemesters ? "Hide Semester Progression" : "View Semester Progression (SGPA / CGPA)"}</span>
                    {showSemesters ? <FiChevronUp /> : <FiChevronDown />}
                  </button>

                  {showSemesters && (
                    <div className="semester-table-wrapper font-mono">
                      <table className="semester-table">
                        <thead>
                          <tr>
                            <th>Semester</th>
                            <th>SGPA</th>
                            <th>Cumulative CGPA</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {item.semesters.map((sem, sIdx) => (
                            <tr key={sIdx}>
                              <td>{sem.sem}</td>
                              <td className="text-accent">{sem.sgpa}</td>
                              <td className="text-highlight">{sem.cgpa}</td>
                              <td><span className={`sem-badge ${sem.status.toLowerCase().replace(' ', '-')}`}>{sem.status}</span></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Leadership & Achievements Subsection */}
        <div className="achievements-section-block">
          <h3 className="sub-section-title font-heading">
            <FiAward className="title-icon" /> Leadership & Honors
          </h3>
          <div className="leadership-grid">
            {leadershipAndAchievements.map((item, i) => (
              <div key={i} className="leadership-card card">
                <div className="leadership-header">
                  <h4 className="leadership-title">{item.title}</h4>
                  <span className="leadership-org font-mono">{item.organization}</span>
                </div>
                <p className="leadership-desc">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Certifications & Research Grid */}
        <div className="credentials-dual-grid">
          
          {/* Column 1: Certifications */}
          <div className="certs-column card">
            <h3 className="sub-section-title font-heading">
              <FiCheck className="title-icon" /> Technical Certifications
            </h3>
            <div className="certs-list font-mono">
              {certifications.map((cert, cIdx) => (
                <div key={cIdx} className="cert-item">
                  <div className="cert-info">
                    <span className="cert-name">{cert.title}</span>
                    <span className="cert-issuer">{cert.issuer}</span>
                  </div>
                  <span className="cert-score">{cert.score}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Column 2: Research Manuscripts */}
          <div className="research-column card">
            <h3 className="sub-section-title font-heading">
              <FiBookOpen className="title-icon" /> Research Manuscripts
            </h3>
            <div className="research-list">
              {researchPapers.map((paper, pIdx) => (
                <div key={pIdx} className="research-item">
                  <span className="research-type font-mono">{paper.type}</span>
                  <h4 className="research-title">{paper.title}</h4>
                  <p className="research-desc">{paper.description}</p>
                  <div className="research-tech-row font-mono">
                    {paper.technologies.map((tech, tIdx) => (
                      <span key={tIdx} className="tech-badge">{tech}</span>
                    ))}
                  </div>
                  {paper.pdfUrl && (
                    <a
                      href={paper.pdfUrl}
                      download
                      className="research-download-btn btn btn-secondary font-mono"
                      aria-label={`Download research manuscript for ${paper.title}`}
                    >
                      <FiDownload /> Download Manuscript
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default Experience;
