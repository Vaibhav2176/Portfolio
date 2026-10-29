import React, { useEffect, useRef } from 'react';
import './SkillsHologramTerminal.css';

/**
 * SkillsHologramTerminal
 * A compact, floating 3D developer artifact comprising:
 * 1. An opaque, distinct miniature terminal window with syntax-highlighted code.
 * 2. A floating, slowly rotating 3D wireframe cube with subtle drifting particles.
 * 3. Directional lighting, layered shadows, and floor reflection.
 */
const SkillsHologramTerminal = () => {
  const containerRef = useRef(null);
  const rafRef = useRef(null);
  const rectRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      rectRef.current = null;
    };
    window.addEventListener('resize', handleResize, { passive: true });
    return () => {
      window.removeEventListener('resize', handleResize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const handleMouseEnter = () => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      rectRef.current = {
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height,
        scrollY: window.scrollY,
        scrollX: window.scrollX
      };
    }
  };

  const handleMouseMove = (e) => {
    if (window.innerWidth < 1024) return;

    const el = containerRef.current;
    if (!el) return;
    const clientX = e.clientX;
    const clientY = e.clientY;

    if (rafRef.current) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      if (!el.isConnected) return;
      if (!rectRef.current) {
        const rect = el.getBoundingClientRect();
        rectRef.current = {
          left: rect.left,
          top: rect.top,
          width: rect.width,
          height: rect.height,
          scrollY: window.scrollY,
          scrollX: window.scrollX
        };
      }
      const cached = rectRef.current;
      if (!cached || !cached.width || !cached.height) return;

      const currentLeft = cached.left - (window.scrollX - cached.scrollX);
      const currentTop = cached.top - (window.scrollY - cached.scrollY);
      const x = clientX - currentLeft - cached.width / 2;
      const y = clientY - currentTop - cached.height / 2;

      const rotX = Math.max(-2.5, Math.min(2.5, -(y / (cached.height / 2)) * 2.5));
      const rotY = Math.max(-2.5, Math.min(2.5, (x / (cached.width / 2)) * 2.5));

      el.style.setProperty('--tilt-x', `${rotX.toFixed(2)}deg`);
      el.style.setProperty('--tilt-y', `${rotY.toFixed(2)}deg`);
    });
  };

  const handleMouseLeave = () => {
    rectRef.current = null;
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    const el = containerRef.current;
    if (!el) return;
    el.style.setProperty('--tilt-x', '0deg');
    el.style.setProperty('--tilt-y', '0deg');
  };

  return (
    <div 
      className="skills-terminal-artifact"
      aria-label="Developer Terminal Artifact"
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        '--tilt-x': '0deg',
        '--tilt-y': '0deg'
      }}
    >
      {/* 1. Floor shadow and ambient cyan back-bloom for physical integration */}
      <div className="terminal-floor-shadow" aria-hidden="true" />
      <div className="terminal-ambient-bloom" aria-hidden="true" />

      {/* 2. Floating 3D Wireframe Cube hovering near top-right corner */}
      <div className="cube-orbit-anchor" aria-hidden="true">
        <div className="hologram-cube">
          <div className="cube-face face-front" />
          <div className="cube-face face-back" />
          <div className="cube-face face-right" />
          <div className="cube-face face-left" />
          <div className="cube-face face-top" />
          <div className="cube-face face-bottom" />
          <div className="cube-core-node" />
        </div>
        {/* Subtle ambient drifting particles */}
        <span className="cube-particle particle-1" />
        <span className="cube-particle particle-2" />
        <span className="cube-particle particle-3" />
        <span className="cube-particle particle-4" />
      </div>

      {/* 3. The Miniature Terminal Panel (Opaque, tactile, physical presence) */}
      <div className="terminal-panel-frame">
        {/* Top hairline highlight & corner accent markers */}
        <div className="terminal-top-beam" aria-hidden="true" />
        <span className="card-corner-marker top-left" aria-hidden="true" />
        <span className="card-corner-marker bottom-right" aria-hidden="true" />

        {/* Terminal Header Bar with Window Controls */}
        <div className="terminal-window-header">
          <div className="terminal-controls" aria-hidden="true">
            <span className="control-dot dot-close" />
            <span className="control-dot dot-minimize" />
            <span className="control-dot dot-maximize" />
          </div>

          <div className="terminal-tab-label font-mono">
            <span className="terminal-prompt-glyph" aria-hidden="true">&gt;_</span>
            <span>developer.config.ts</span>
          </div>

          <div className="terminal-live-beacon font-mono">
            <span className="beacon-dot" aria-hidden="true" />
            <span className="beacon-text">ACTIVE</span>
          </div>
        </div>

        {/* Divider */}
        <div className="terminal-header-divider" aria-hidden="true" />

        {/* Terminal Code Surface */}
        <div className="terminal-code-body font-mono">
          <div className="code-line">
            <span className="line-num" aria-hidden="true">1</span>
            <span className="syn-keyword">const</span>{' '}
            <span className="syn-var">developer</span>{' '}
            <span className="syn-operator">=</span>{' '}
            <span className="syn-brace">&#123;</span>
          </div>
          <div className="code-line indent">
            <span className="line-num" aria-hidden="true">2</span>
            <span className="syn-prop">curiosity</span>
            <span className="syn-colon">:</span>{' '}
            <span className="syn-bool">true</span>
            <span className="syn-comma">,</span>
          </div>
          <div className="code-line indent">
            <span className="line-num" aria-hidden="true">3</span>
            <span className="syn-prop">keepsBuilding</span>
            <span className="syn-colon">:</span>{' '}
            <span className="syn-bool">true</span>
          </div>
          <div className="code-line">
            <span className="line-num" aria-hidden="true">4</span>
            <span className="syn-brace">&#125;;</span>
            <span className="terminal-cursor" aria-hidden="true" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillsHologramTerminal;
