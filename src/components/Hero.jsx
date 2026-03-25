import React, { useCallback } from 'react';
import Particles from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import { TypeAnimation } from 'react-type-animation';
import { motion } from 'framer-motion';
import { Link } from 'react-scroll';
import { FiDownload, FiArrowRight } from 'react-icons/fi';
import './Hero.css';

const Hero = () => {
  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  const particlesOptions = {
    fullScreen: { enable: false, zIndex: 0 },
    background: { color: { value: 'transparent' } },
    fpsLimit: 120,
    interactivity: {
      events: {
        onHover: { enable: true, mode: 'repulse' },
        resize: true,
      },
      modes: { repulse: { distance: 100, duration: 0.4 } },
    },
    particles: {
      color: { value: '#00f2fe' },
      links: {
        color: '#4facfe',
        distance: 150,
        enable: true,
        opacity: 0.2,
        width: 1,
      },
      move: {
        enable: true,
        direction: 'none',
        outModes: { default: 'bounce' },
        random: false,
        speed: 1.5,
        straight: false,
      },
      number: { density: { enable: true, area: 800 }, value: 60 },
      opacity: { value: 0.3 },
      shape: { type: 'circle' },
      size: { value: { min: 1, max: 3 } },
    },
    detectRetina: true,
  };

  return (
    <section id="hero" className="hero-section">
      <div className="particles-container">
        <Particles id="tsparticles" init={particlesInit} options={particlesOptions} />
      </div>
      
      <div className="hero-content">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <span className="greeting font-mono">&lt;hello_world /&gt;</span>
          <h1 className="name"><span className="gradient-text">Vaibhav Amulani</span></h1>
          <div className="title-wrapper">
            <h2 className="title">
              <TypeAnimation
                sequence={[
                  'Turning Logic into Code.',
                  1800,
                  'Solving Problems with DSA.',
                  1800,
                  'Building Scalable Web Apps.',
                  1800,
                  'Learning. Building. Improving.',
                  2200,
                ]}
                wrapper="span"
                speed={40}
                deletionSpeed={65}
                repeat={Infinity}
                cursor={true}
                className="gradient-text font-mono"
              />
            </h2>
          </div>
          
          <div className="terminal-window glass-panel">
            <div className="terminal-header">
              <span className="dot red"></span>
              <span className="dot yellow"></span>
              <span className="dot green"></span>
            </div>
            <div className="terminal-body font-mono">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1, duration: 0.5 }}>
                <p><span className="keyword">const</span> <span className="variable">name</span> = <span className="string">"Vaibhav Amulani"</span>;</p>
              </motion.div>
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.5, duration: 0.5 }}>
                <p><span className="keyword">let</span> <span className="variable">focus</span> = <span className="string">"MERN Stack & DSA"</span>;</p>
              </motion.div>
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 2, duration: 0.5 }}>
                <p className="mt-2"><span className="comment">// Exploring AI-assisted workflows</span></p>
              </motion.div>
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 2.5, duration: 0.5 }}>
                <p><span className="function">buildFuture</span>();<span className="cursor-blink">|</span></p>
              </motion.div>
            </div>
          </div>
          
          <div className="hero-buttons mt-4">
            <Link
              to="projects"
              smooth={true}
              duration={500}
              offset={-70}
              className="btn btn-primary"
            >
              View Projects <FiArrowRight className="btn-icon" />
            </Link>
            <Link
              to="contact"
              smooth={true}
              duration={500}
              offset={-70}
              className="btn btn-secondary glass-panel"
            >
              Hire Me <FiDownload className="btn-icon" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
