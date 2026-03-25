import React from 'react';
import { motion } from 'framer-motion';
import { FiCode, FiActivity, FiBriefcase } from 'react-icons/fi';
import './About.css';

const About = () => {
  return (
    <section id="about" className="section bg-alt">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 150 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="section-header">
            <h2 className="section-title">
              <span className="gradient-text">About Me</span>
            </h2>
            <div className="section-line"></div>
          </div>

          <div className="about-content">
            <div className="about-code-block glass-panel font-mono">
              <div className="terminal-header">
                <span className="dot red"></span>
                <span className="dot yellow"></span>
                <span className="dot green"></span>
                <span className="file-name">aboutMe.js</span>
              </div>
              <div className="code-content">
                <p><span className="keyword">const</span> <span className="variable">vaibhav</span> = <span className="keyword">&#123;</span></p>
                <p className="indent-1"><span className="property">age</span>: <span className="function">20</span>,</p>
                <p className="indent-1"><span className="property">title</span>: <span className="string">"Aspiring Software Engineer"</span>,</p>
                <p className="indent-1"><span className="property">education</span>: <span className="string">"B.Tech CSE (2nd Year) @ LNCT"</span>,</p>
                <p className="indent-1"><span className="property">location</span>: <span className="string">"Bhopal, India"</span>,</p>
                <p className="indent-1"><span className="property">skills</span>: [<span className="string">"C++"</span>, <span className="string">"Java"</span>, <span className="string">"Python"</span>, <span className="string">"JavaScript"</span>, <span className="string">"HTML"</span>, <span className="string">"CSS"</span>, <span className="string">"MERN Stack"</span>],</p>
                <p className="indent-1"><span className="property">coreConcepts</span>: [<span className="string">"Data Structures"</span>, <span className="string">"Algorithms"</span>, <span className="string">"Problem Solving"</span>],</p>
                <p className="indent-1"><span className="property">tools</span>: [<span className="string">"VS Code"</span>, <span className="string">"Git"</span>, <span className="string">"ChatGPT"</span>, <span className="string">"AI Tools"</span>],</p>
                <p className="indent-1"><span className="property">interests</span>: [</p>
                <p className="indent-2"><span className="string">"Full Stack Development"</span>,</p>
                <p className="indent-2"><span className="string">"Scalable Web Applications"</span>,</p>
                <p className="indent-2"><span className="string">"Modern UI/UX"</span>,</p>
                <p className="indent-2"><span className="string">"Learning New Technologies"</span></p>
                <p className="indent-1">],</p>
                <p className="indent-1"><span className="property">currentFocus</span>: <span className="string">"Mastering MERN stack, DSA, and building real-world projects"</span></p>
                <p><span className="keyword">&#125;</span>;</p>
              </div>
            </div>

            <div className="about-highlights">
              <div className="highlight-card developer-card glass-panel">
                <FiCode className="highlight-icon" />
                <h4>Lifelong Passion</h4>
                <p>Strong interest in computers since childhood, evolved into a passion for coding and logic building.</p>
              </div>
              <div className="highlight-card developer-card glass-panel">
                <FiActivity className="highlight-icon" />
                <h4>Continuous Growth</h4>
                <p>Actively building real-world projects, learning backend concepts, and exploring AI-assisted workflows.</p>
              </div>
              <div className="highlight-card developer-card glass-panel">
                <FiBriefcase className="highlight-icon" />
                <h4>Solid Foundation</h4>
                <p>Strong focus on Data Structures & Algorithms, forming the core of my problem-solving ability.</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
