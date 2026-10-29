import React, { useState, useEffect, useCallback } from 'react';
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
    const isSkipped = window.location.search.includes('skip_intro=true');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    return (isSkipped || prefersReducedMotion) ? 'completed' : 'loading';
  });

  // Ensure scroll restoration is manual and page starts at the top on initial load/reload
  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }, []);

  const handleHandoffStart = useCallback(() => {
    setIntroState('transitioning');
  }, []);

  const handleIntroFinish = useCallback(() => {
    setIntroState('completed');
    window.scrollTo(0, 0);
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
