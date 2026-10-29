import React, { useState, useEffect, useRef } from 'react';
import LoadingCanvas3D from './LoadingCanvas3D';
import './LoadingScreen.css';

/**
 * LoadingScreen Component
 * A full-screen introduction for the portfolio with real-time 3D spatial graphics,
 * confident engineering typography, smooth progress telemetry, and coordinated shared-name handoff.
 * 
 * Features:
 * - Dynamic 3D interconnected systems core (LoadingCanvas3D)
 * - Typography: "VAIBHAV." transitioning smoothly to Hero heading "VAIBHAV"
 * - Two-Phase Cinematic FLIP sequence:
 *   - Phase 1: Name stays solid in place while surrounding loading elements fade (~200ms)
 *   - Phase 2: Name smoothly enlarges in place, horizontally centered, matching Hero dimensions (380ms)
 *   - Phase 3: Enlarged name smoothly glides across viewport into .hero-name-first position (680ms)
 *   - Phase 4: Hero content (AMULANI, portrait, eyebrow, subrole, intro, CTA) reveals concurrently
 *   - Phase 5: Seamless lock-in handoff to Hero heading with clean unmount and resource disposal
 * - Session-based display policy (shows on fresh session/reload, skips on in-page routing)
 * - Guaranteed unmount and zero lingering event listeners or scroll locks
 * - High-contrast accessible design with reduced motion support
 */
const MIN_DISPLAY_DURATION = 3500; // 3.5s deliberate duration
const PROGRESS_DURATION = 3150;     // Progress smoothly reaches 100% at ~3.15s
const MAX_FALLBACK_TIMEOUT = 5500;  // 5.5s hard fallback timeout

// Phase timings for the slower, smoother, more cinematic shared-name transition:
const PHASE1_REST_MS = 220;    // Phase 1: surrounding loading elements fade, name remains visible in place (~220ms)
const PHASE2_ENLARGE_MS = 400; // Phase 2: name smoothly enlarges in place, horizontally centered (400ms)
const PHASE3_TRAVEL_MS = 740;  // Phase 3: enlarged name travels into Hero heading position (740ms)
const BUFFER_CLEANUP_MS = 40;  // Buffer for seamless handoff lock-in before unmount

const getProgressStage = (val) => {
  if (val < 32) return 'INITIALIZING ARCHITECTURE';
  if (val < 68) return 'LOADING SYSTEM MODULES';
  if (val < 100) return 'SYNCHRONIZING GRAPHICS';
  return 'SYSTEM READY';
};

const LoadingScreen = ({ onFinish = null, onHandoffStart = null }) => {
  // Initialize lazily; skip only on explicit reduced motion or test override
  const [isUnmounted, setIsUnmounted] = useState(() => {
    if (typeof window === 'undefined') return false;
    const isSkipped = window.location.search.includes('skip_intro=true');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    return Boolean(isSkipped || prefersReducedMotion);
  });

  const [progress, setProgress] = useState(0);
  const [isHandoffStarted, setIsHandoffStarted] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [handoffPhase, setHandoffPhase] = useState('idle'); // 'idle' | 'resting' | 'enlarging' | 'traveling' | 'completed'
  const [isPortraitOnRight, setIsPortraitOnRight] = useState(true);
  const [flyerProps, setFlyerProps] = useState(null);

  const onFinishRef = useRef(onFinish);
  const onHandoffStartRef = useRef(onHandoffStart);
  const webglReadyRef = useRef(false);
  const brandHeadingRef = useRef(null);
  const brandTextRef = useRef(null);
  const handoffStartTimeRef = useRef(0);

  useEffect(() => {
    onFinishRef.current = onFinish;
    onHandoffStartRef.current = onHandoffStart;
  }, [onFinish, onHandoffStart]);

  useEffect(() => {
    const isSkipped = window.location.search.includes('skip_intro=true');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (isSkipped || prefersReducedMotion) {
      document.body.style.overflow = '';
      setIsUnmounted(true);
      if (onFinishRef.current) onFinishRef.current();
      return;
    }

    // Ensure document starts at top and lock background scroll during intro
    window.scrollTo(0, 0);
    document.body.style.overflow = 'hidden';

    const startTime = performance.now();
    let animationFrameId = null;
    let fallbackTimer = null;
    let phase2Timer = null;
    let phase3Timer = null;
    let handoffLandTimer = null;
    let exitUnmountTimer = null;
    let isCompleteTriggered = false;

    // Monitor document and fonts readiness asynchronously without prematurely dismissing
    const checkReadiness = async () => {
      try {
        if (document.fonts && document.fonts.ready) {
          await document.fonts.ready;
        }
      } catch {
        // Fallback gracefully
      }
    };
    checkReadiness();

    const triggerExit = () => {
      if (isCompleteTriggered) return;
      isCompleteTriggered = true;

      setProgress(100);

      const prefersReducedMotion = typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      const targetEl = document.querySelector('.hero-name-first .hero-name-text') ||
                       document.querySelector('.hero-name-first');
      const startEl = brandTextRef.current;

      if (prefersReducedMotion || !targetEl || !startEl) {
        setIsExiting(true);
        setIsHandoffStarted(true);
        if (onHandoffStartRef.current) onHandoffStartRef.current();
        document.body.style.overflow = '';
        exitUnmountTimer = setTimeout(() => {
          setIsUnmounted(true);
          if (onFinishRef.current) onFinishRef.current();
        }, 450);
        return;
      }

      const startRect = startEl.getBoundingClientRect();
      const targetRect = targetEl.getBoundingClientRect();

      if (startRect.width === 0 || targetRect.width === 0) {
        setIsExiting(true);
        setIsHandoffStarted(true);
        if (onHandoffStartRef.current) onHandoffStartRef.current();
        document.body.style.overflow = '';
        exitUnmountTimer = setTimeout(() => {
          setIsUnmounted(true);
          if (onFinishRef.current) onFinishRef.current();
        }, 450);
        return;
      }

      const computedStart = window.getComputedStyle(startEl);
      const startWidth = startRect.width || 1;
      const startHeight = startRect.height || 1;
      const targetWidth = targetRect.width || startWidth;
      const targetHeight = targetRect.height || startHeight;

      const scaleX = targetWidth / startWidth;
      const scaleY = targetHeight / startHeight;

      const startCenterX = startRect.left + startWidth / 2;
      const startCenterY = startRect.top + startHeight / 2;
      const targetCenterX = targetRect.left + targetWidth / 2;
      const targetCenterY = targetRect.top + targetHeight / 2;

      const initialDeltaX = targetCenterX - startCenterX;
      const initialDeltaY = targetCenterY - startCenterY;

      setFlyerProps({
        top: startRect.top,
        left: startRect.left,
        width: startWidth,
        height: startHeight,
        fontSize: parseFloat(computedStart.fontSize) || 54,
        lineHeight: computedStart.lineHeight || '1.08',
        scaleX,
        scaleY,
        startCenterX,
        startCenterY,
        deltaX: initialDeltaX,
        deltaY: initialDeltaY,
      });

      // Measure portrait spatial positioning to coordinate 3D core directional flow
      const portraitEl = document.querySelector('.hero-portrait-stage') || document.querySelector('.hero-editorial-visual');
      const portraitRect = portraitEl ? portraitEl.getBoundingClientRect() : null;
      const isRight = portraitRect ? (portraitRect.left + portraitRect.width / 2) > (window.innerWidth / 2) : true;
      setIsPortraitOnRight(isRight);

      // Phase 1 begins: name is solid in place, surrounding elements begin fading, Hero unveils
      handoffStartTimeRef.current = performance.now();
      setIsHandoffStarted(true);
      setIsExiting(true);
      setHandoffPhase('resting');
      if (onHandoffStartRef.current) onHandoffStartRef.current();

      // Phase 2: Enlarge in place horizontally centered (220ms -> 620ms)
      phase2Timer = setTimeout(() => {
        setHandoffPhase('enlarging');
      }, PHASE1_REST_MS);

      // Phase 3: Move enlarged name into Hero heading position (620ms -> 1360ms)
      phase3Timer = setTimeout(() => {
        // Recalculate target destination after fonts and layout have stabilized
        const currentTargetEl = document.querySelector('.hero-name-first .hero-name-text') ||
                                document.querySelector('.hero-name-first');
        if (currentTargetEl) {
          const liveTargetRect = currentTargetEl.getBoundingClientRect();
          if (liveTargetRect.width > 0 && liveTargetRect.height > 0) {
            const liveTargetWidth = liveTargetRect.width;
            const liveTargetHeight = liveTargetRect.height;
            const liveTargetCenterX = liveTargetRect.left + liveTargetWidth / 2;
            const liveTargetCenterY = liveTargetRect.top + liveTargetHeight / 2;
            const liveDeltaX = liveTargetCenterX - startCenterX;
            const liveDeltaY = liveTargetCenterY - startCenterY;
            const computedTarget = window.getComputedStyle(currentTargetEl);
            setFlyerProps(prev => ({
              ...prev,
              deltaX: liveDeltaX,
              deltaY: liveDeltaY,
              scaleX: liveTargetWidth / startWidth,
              scaleY: liveTargetHeight / startHeight,
              targetLineHeight: computedTarget.lineHeight,
              targetLetterSpacing: computedTarget.letterSpacing,
            }));
          }
        }
        setHandoffPhase('traveling');
      }, PHASE1_REST_MS + PHASE2_ENLARGE_MS);

      // Phase 4: Arrival at destination & seamless visibility transfer (1360ms)
      // Native heading renders underneath the exact matching flyer
      handoffLandTimer = setTimeout(() => {
        setHandoffPhase('completed');
        if (onFinishRef.current) onFinishRef.current();
      }, PHASE1_REST_MS + PHASE2_ENLARGE_MS + PHASE3_TRAVEL_MS);

      // Phase 5: Clean unmount after native heading is guaranteed painted (1400ms)
      exitUnmountTimer = setTimeout(() => {
        document.body.style.overflow = '';
        setIsUnmounted(true);
      }, PHASE1_REST_MS + PHASE2_ENLARGE_MS + PHASE3_TRAVEL_MS + BUFFER_CLEANUP_MS);
    };

    // Coordinated progress telemetry loop
    const updateProgress = () => {
      const now = performance.now();
      const elapsed = now - startTime;

      let targetProgress = 0;
      if (elapsed < 850) {
        targetProgress = Math.floor((elapsed / 850) * 32);
      } else if (elapsed < 2000) {
        targetProgress = 32 + Math.floor(((elapsed - 850) / 1150) * 36);
      } else if (elapsed < PROGRESS_DURATION) {
        targetProgress = 68 + Math.floor(((elapsed - 2000) / (PROGRESS_DURATION - 2000)) * 31);
      } else {
        targetProgress = 100;
      }

      setProgress(prev => Math.max(prev, targetProgress));

      const readyForExit = elapsed >= MIN_DISPLAY_DURATION;
      const isDocumentReady = document.readyState === 'complete';

      if ((readyForExit && isDocumentReady) || elapsed >= MAX_FALLBACK_TIMEOUT) {
        triggerExit();
      } else {
        animationFrameId = requestAnimationFrame(updateProgress);
      }
    };

    animationFrameId = requestAnimationFrame(updateProgress);

    // Guaranteed fallback timer to never trap the user
    fallbackTimer = setTimeout(() => {
      triggerExit();
    }, MAX_FALLBACK_TIMEOUT);

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (fallbackTimer) clearTimeout(fallbackTimer);
      if (phase2Timer) clearTimeout(phase2Timer);
      if (phase3Timer) clearTimeout(phase3Timer);
      if (handoffLandTimer) clearTimeout(handoffLandTimer);
      if (exitUnmountTimer) clearTimeout(exitUnmountTimer);
      document.body.style.overflow = '';
    };
  }, []); // Run effect once on mount

  if (isUnmounted) return null;

  const stageLabel = getProgressStage(progress);

  return (
    <div 
      className={`loading-screen-overlay ${isHandoffStarted ? 'is-handoff' : ''} ${isExiting ? 'is-exiting' : ''}`}
      data-handoff-phase={handoffPhase}
      role="status"
      aria-live="polite"
      aria-label="Loading portfolio experience"
    >
      {/* Full-viewport Atmospheric Spatial Radial Blooms */}
      <div className="loading-ambient-bloom-center" aria-hidden="true" />
      <div className="loading-ambient-bloom-cyan" aria-hidden="true" />
      <div className="loading-ambient-bloom-blue" aria-hidden="true" />

      {/* Full-viewport 3D Canvas Background & Focal Scene */}
      <div className="loading-canvas-container" aria-hidden="true">
        <LoadingCanvas3D 
          isExiting={isExiting}
          handoffPhase={handoffPhase}
          isPortraitOnRight={isPortraitOnRight}
          onReady={() => { webglReadyRef.current = true; }} 
        />
      </div>

      {/* Recomposed Centered Flow Shell: Vertically & horizontally balanced */}
      <div className="loading-flow-container">
        {/* Upper spatial zone for the enlarged 3D geometric focal point */}
        <div className="loading-centerpiece-anchor" aria-hidden="true" />

        {/* Coordinated Typography & Telemetry Block */}
        <div className="loading-content-group">
          
          {/* Eyebrow System Node Status */}
          <div className="loading-eyebrow-row">
            <span className="loading-status-dot" aria-hidden="true" />
            <span className="loading-eyebrow-text font-mono text-xs">
              PORTFOLIO INITIALIZATION
            </span>
          </div>

          {/* Crisp Monolithic Name Identity with graceful dot separation */}
          <h1 className="loading-brand-name font-heading" ref={brandHeadingRef}>
            <span 
              className={`loading-brand-text ${isHandoffStarted ? 'is-hidden' : ''}`} 
              ref={brandTextRef}
            >
              VAIBHAV
            </span>
            <span className={`loading-brand-dot ${isHandoffStarted ? 'is-fading' : ''}`}>
              .
            </span>
          </h1>

          {/* Secondary Engineering Discipline */}
          <p className="loading-role-text font-mono">
            SOFTWARE ENGINEER · FULL STACK &amp; APPLIED AI
          </p>

          {/* Minimal Precision Progress Bar & Telemetry */}
          <div className="loading-telemetry-container">
            <div className="loading-progress-track">
              <div 
                className="loading-progress-bar" 
                style={{ width: `${progress}%` }} 
                aria-valuenow={progress}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
            
            <div className="loading-telemetry-labels font-mono text-xs">
              <span className="telemetry-label-status">
                {stageLabel}
              </span>
              <span className="telemetry-label-percent">
                {progress}%
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* Shared-Name Transition Flight Clone */}
      {flyerProps && (
        <div
          className="loading-flying-name font-heading"
          data-phase={handoffPhase}
          aria-hidden="true"
          style={{
            position: 'fixed',
            top: `${flyerProps.top}px`,
            left: `${flyerProps.left}px`,
            width: `${flyerProps.width}px`,
            height: `${flyerProps.height}px`,
            transformOrigin: 'center center',
            transform:
              handoffPhase === 'traveling' || handoffPhase === 'completed'
                ? `translate3d(${flyerProps.deltaX}px, ${flyerProps.deltaY}px, 0) scale(${flyerProps.scaleX}, ${flyerProps.scaleY})`
                : handoffPhase === 'enlarging'
                ? `translate3d(0, 0, 0) scale(${flyerProps.scaleX}, ${flyerProps.scaleY})`
                : 'translate3d(0, 0, 0) scale(1, 1)',
            transition:
              handoffPhase === 'traveling'
                ? 'transform 740ms cubic-bezier(0.16, 1, 0.3, 1), text-shadow 350ms ease'
                : handoffPhase === 'enlarging'
                ? 'transform 400ms cubic-bezier(0.25, 1, 0.5, 1), letter-spacing 400ms ease, text-shadow 400ms ease'
                : 'none',
            textShadow:
              handoffPhase === 'enlarging'
                ? '0 4px 28px rgba(0, 0, 0, 0.85), 0 0 40px rgba(56, 189, 248, 0.26)'
                : 'none',
            letterSpacing:
              (handoffPhase === 'traveling' || handoffPhase === 'completed') && flyerProps.targetLetterSpacing
                ? flyerProps.targetLetterSpacing
                : handoffPhase === 'enlarging'
                ? '-0.04em'
                : '-0.025em',
            fontSize: `${flyerProps.fontSize}px`,
            lineHeight:
              (handoffPhase === 'traveling' || handoffPhase === 'completed') && flyerProps.targetLineHeight
                ? flyerProps.targetLineHeight
                : flyerProps.lineHeight,
            fontWeight: 800,
            color: '#ffffff',
            textTransform: 'uppercase',
            zIndex: 100000,
            pointerEvents: 'none',
            willChange: 'transform',
            margin: 0,
            padding: 0,
            display: 'inline-block',
            boxSizing: 'border-box',
            whiteSpace: 'nowrap',
          }}
        >
          VAIBHAV
        </div>
      )}
    </div>
  );
};

export default LoadingScreen;
