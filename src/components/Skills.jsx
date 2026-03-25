import React from 'react';
import { motion } from 'framer-motion';
import './Skills.css';

const skillsData = [
  {
    category: 'Programming Languages',
    items: [
      { name: 'C++' },
      { name: 'Java' },
      { name: 'Python' },
      { name: 'JavaScript' }
    ]
  },
  {
    category: 'Web Development',
    items: [
      { name: 'HTML' },
      { name: 'CSS' },
      { name: 'JavaScript' },
      { name: 'MERN Stack' }
    ]
  },
  {
    category: 'Core CS Concepts',
    items: [
      { name: 'Data Structures' },
      { name: 'Algorithms' }
    ]
  },
  {
    category: 'Tools & Tech',
    items: [
      { name: 'VS Code' },
      { name: 'Git' },
      { name: 'ChatGPT' },
      { name: 'AI Tools' }
    ]
  }
];

const Skills = () => {
  return (
    <section id="skills" className="section">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 150 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="section-header center">
            <h2 className="section-title">
              <span className="gradient-text">My Skills</span>
            </h2>
            <div className="section-line mx-auto"></div>
          </div>

          <div className="skills-grid">
            {skillsData.map((skillGroup, index) => (
              <div key={index} className="skill-category glass-panel">
                <h3 className="category-title font-mono">&lt;{skillGroup.category.split(' ')[0]} /&gt;</h3>
                <div className="skills-badge-container">
                  {skillGroup.items.map((skill, i) => (
                    <motion.div 
                      key={i} 
                      className="skill-badge font-mono"
                      initial={{ opacity: 0, scale: 0.5, y: 20 }}
                      whileInView={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ duration: 0.5, type: 'spring', delay: (index * 0.15) + (i * 0.1) }}
                      viewport={{ once: true, margin: "-50px" }}
                      whileHover={{ scale: 1.1, y: -5 }}
                    >
                      <span className="badge-dot"></span>
                      <span className="skill-name">{skill.name}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Skills;
