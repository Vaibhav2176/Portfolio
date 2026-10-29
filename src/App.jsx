import React, { useState, useCallback } from 'react';
import LoadingScreen from './components/LoadingScreen';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Academic from './components/Academic';
import Projects from './components/Projects';
import Activity from './components/Activity';
import Contact from './components/Contact';
import Footer from './components/Footer';
import './App.css';

function App() {
  const [introState, setIntroState] = useState(() => {
    if (typeof window === 'undefined') return 'completed';
    const hasSeenIntro = sessionStorage.getItem('portfolio_intro_seen');
    const isForced = window.location.search.includes('intro=true');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    return ((hasSeenIntro && !isForced) || prefersReducedMotion) ? 'completed' : 'loading';
  });

  const handleHandoffStart = useCallback(() => {
    setIntroState('transitioning');
  }, []);

  const handleIntroFinish = useCallback(() => {
    setIntroState('completed');
  }, []);

  return (
    <div className={`app intro-${introState}`}>
      <LoadingScreen 
        onHandoffStart={handleHandoffStart}
        onFinish={handleIntroFinish} 
      />
      <a href="#main-content" className="skip-to-content">
        Skip to main content
      </a>
      <Navbar />
      <main id="main-content">
        <Hero introState={introState} />
        <About />
        <Skills />
        <Academic />
        <Activity />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

export default App;
