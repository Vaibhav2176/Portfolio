import React from 'react';
import { motion } from 'framer-motion';
import { FiGithub, FiExternalLink, FiStar, FiGitBranch, FiFolder } from 'react-icons/fi';
import './Projects.css';

const projectData = [
  {
    id: 1,
    title: 'LNCT Website Project',
    description: 'A structured and responsive website showcasing LNCT institutions and companies, designed for students, parents, and competition evaluation.',
    tech: ['HTML', 'CSS', 'JavaScript'],
    github: 'https://github.com/Vaibhav2176',
    live: 'https://github.com/Vaibhav2176',
    stars: 12,
    forks: 3
  },
  {
    id: 2,
    title: 'Rays Academy Website',
    description: 'A clean and modern website for a coaching institute including faculty, gallery, contact, and future student portal features.',
    tech: ['HTML', 'CSS', 'JavaScript'],
    github: 'https://github.com/Vaibhav2176/rays-academy-renaissance',
    live: 'https://www.raysacademybhopal.in/',
    stars: 8,
    forks: 2
  },
  {
    id: 3,
    title: 'ToolVerse',
    description: 'A multi-tool website offering utilities like BMI calculator and other tools with consistent UI and usability focus.',
    tech: ['HTML', 'CSS', 'JavaScript'],
    github: 'https://github.com/Vaibhav2176/toolverse-hub',
    live: 'https://toolverse-hub.vercel.app/',
    stars: 15,
    forks: 5
  }
];

const Projects = () => {
  return (
    <section id="projects" className="section">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 150 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="section-header">
            <h2 className="section-title">
              <span className="gradient-text">Featured Projects</span>
            </h2>
            <div className="section-line"></div>
          </div>

          <div className="projects-grid">
            {projectData.map((project, index) => (
              <motion.div
                key={project.id}
                className="project-card glass-panel"
                initial={{ opacity: 0, scale: 0.8, y: 100 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6, type: "spring", bounce: 0.4, delay: index * 0.2 }}
                viewport={{ once: true, margin: "-50px" }}
              >
                <div className="project-top">
                  <FiFolder className="folder-icon" />
                  <div className="project-links-top">
                    <a href={project.github} target="_blank" rel="noopener noreferrer" className="link-icon">
                      <FiGithub />
                    </a>
                    <a href={project.live} target="_blank" rel="noopener noreferrer" className="link-icon">
                      <FiExternalLink />
                    </a>
                  </div>
                </div>

                <div className="project-content">
                  <h3 className="project-title font-heading">{project.title}</h3>
                  <p className="project-description">{project.description}</p>
                  
                  <div className="project-tech font-mono">
                    {project.tech.map((tech, i) => (
                      <span key={i} className="tech-badge">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="project-footer font-mono">
                  <div className="repo-stats">
                    <span><FiStar /> {project.stars}</span>
                    <span><FiGitBranch /> {project.forks}</span>
                  </div>
                  <div className="repo-status">
                    <span className="status-dot"></span> Active
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;
