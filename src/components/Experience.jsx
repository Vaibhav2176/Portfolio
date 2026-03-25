import React from 'react';
import { motion } from 'framer-motion';
import { FiGitCommit, FiGitBranch } from 'react-icons/fi';
import './Experience.css';

const timelineData = [
  {
    id: 1,
    type: 'education',
    title: 'B.Tech in Computer Science Engineering',
    company: 'LNCTS',
    date: 'Current (2nd Year)',
    hash: 'edu-cgpa815',
    description: <>Pursuing undergraduate degree at Lakshmi Narain College of Technology & Science. Current CGPA: <span className="gradient-text" style={{fontWeight: 700}}>8.15</span>. Strong focus on Core CS concepts.</>,
    icon: <FiGitCommit />
  },
  {
    id: 2,
    type: 'education',
    title: 'Class 12 (PCM)',
    company: 'Mithi Gobindram Public School',
    date: 'CBSE Board',
    hash: 'edu-score92',
    description: <>Completed Higher Secondary Education with an outstanding <span className="gradient-text" style={{fontWeight: 700}}>92%</span> aggregate, establishing a strong analytical hardware/software foundation.</>,
    icon: <FiGitCommit />
  },
  {
    id: 3,
    type: 'learning',
    title: 'Building Real-world Web Apps',
    company: 'Full Stack Focus',
    date: 'Active',
    hash: 'proj-mern',
    description: 'Actively developing dynamic projects using HTML, CSS, JavaScript, and learning the powerful MERN stack to execute full-stack environments.',
    icon: <FiGitBranch />
  },
  {
    id: 4,
    type: 'learning',
    title: 'Data Structures & Algorithms',
    company: 'Problem Solving',
    date: 'Active',
    hash: 'core-dsa',
    description: 'Practicing Data Structures and Algorithms regularly to significantly strengthen problem-solving skills and pure logic building capabilities.',
    icon: <FiGitBranch />
  },
  {
    id: 5,
    type: 'learning',
    title: 'Backend Dev & AI Workflows',
    company: 'Modern Tools',
    date: 'Exploring',
    hash: 'tech-ai',
    description: 'Exploring heavily into backend development, advanced APIs, and modern development workflows by utilizing AI tools like ChatGPT for extreme productivity.',
    icon: <FiGitBranch />
  }
];

const Experience = () => {
  return (
    <section id="experience" className="section bg-alt">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 150 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="section-header">
            <h2 className="section-title">
              <span className="gradient-text">Experience & Education</span>
            </h2>
            <div className="section-line"></div>
          </div>

          <div className="timeline-container">
            {timelineData.map((item, index) => (
              <div key={item.id} className="timeline-item">
                <div className="timeline-dot">
                  {item.icon}
                </div>
                
                <motion.div
                  className="timeline-content glass-panel"
                  initial={{ opacity: 0, x: -100 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.7, type: 'spring', bounce: 0.3, delay: 0.2 * index }}
                  viewport={{ once: true, margin: "-50px" }}
                >
                  <div className="timeline-meta">
                    <span className="timeline-date font-mono">{item.date}</span>
                    <span className="timeline-hash font-mono">commit {item.hash}</span>
                  </div>
                  <h3 className="timeline-title">{item.title}</h3>
                  <h4 className="timeline-company"><FiGitBranch className="inline-icon" /> {item.company}</h4>
                  <p className="timeline-description">{item.description}</p>
                </motion.div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Experience;
