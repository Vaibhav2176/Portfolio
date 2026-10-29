import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * AboutCanvas3D: Cinematic Atmospheric 3D Environment for the About Section.
 * Upgraded Features:
 * - Vivid receding perspective ground grid with glowing cyan-blue lines
 * - Floating translucent geometric glass panels & illuminated architectural frames at varied depths
 * - Distant architectural wireframe monoliths receding into midnight-blue atmospheric fog
 * - Dual-tone spatial lighting (cool cyan on left, deep royal blue on right)
 * - Multi-layer parallax tracking mouse movement and window scroll
 * - Automatic pause when offscreen via IntersectionObserver (zero waste)
 * - Strict cleanup on unmount; respects prefers-reduced-motion
 */
const AboutCanvas3D = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // WebGL support check
    let isWebGLAvailable = false;
    try {
      const testCanvas = document.createElement('canvas');
      isWebGLAvailable = !!(
        window.WebGLRenderingContext &&
        (testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl'))
      );
    } catch {
      isWebGLAvailable = false;
    }

    if (!isWebGLAvailable) return;

    // 1. Scene & Cinematic Night Fog (Anchored to #060a14)
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x060a14, 0.018);

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 750;

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 800);
    camera.position.set(0, 3, 32);
    camera.lookAt(0, 0, 0);

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance'
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.0));
      renderer.setSize(width, height);
      renderer.setClearColor(0x000000, 0);
      container.appendChild(renderer.domElement);
    } catch (err) {
      console.warn('About WebGL init failed:', err);
      return;
    }

    const disposables = [];
    const track = (obj) => {
      disposables.push(obj);
      return obj;
    };

    // 2. Dual-Tone Atmospheric Lighting
    const ambientLight = track(new THREE.AmbientLight(0x070c17, 3.2));
    scene.add(ambientLight);

    // Left cyan spatial illumination
    const lightCyan = track(new THREE.PointLight(0x38bdf8, 4.5, 95));
    lightCyan.position.set(-20, 14, 14);
    scene.add(lightCyan);

    // Right deep royal blue illumination
    const lightBlue = track(new THREE.PointLight(0x2563eb, 3.8, 90));
    lightBlue.position.set(22, -6, 16);
    scene.add(lightBlue);

    // 3. Prominent Receding Perspective Ground Grid
    // Primary line cyan (0x38bdf8), grid lines deep indigo (0x1e3a8a)
    const gridHelper = track(new THREE.GridHelper(140, 40, 0x38bdf8, 0x1e3a8a));
    gridHelper.position.set(0, -9.0, -8);
    gridHelper.rotation.x = 0.12; // Clearly visible perspective slope
    if (gridHelper.material) {
      gridHelper.material.transparent = true;
      gridHelper.material.opacity = 0.38;
      gridHelper.material.blending = THREE.AdditiveBlending;
    }
    scene.add(gridHelper);

    // 4. Floating Translucent Geometric Glass Panels & Architectural Frames
    const floatingGroup = new THREE.Group();
    scene.add(floatingGroup);

    // A. Left Floating Translucent Panel (z: -16)
    const panelGeo1 = track(new THREE.PlaneGeometry(14, 22));
    const panelMat1 = track(new THREE.MeshBasicMaterial({
      color: 0x0c1a36,
      transparent: true,
      opacity: 0.28,
      side: THREE.DoubleSide
    }));
    const panelMesh1 = new THREE.Mesh(panelGeo1, panelMat1);
    panelMesh1.position.set(-32, 4, -18);
    panelMesh1.rotation.y = 0.28;
    panelMesh1.rotation.z = -0.04;
    floatingGroup.add(panelMesh1);

    const edgeGeo1 = track(new THREE.EdgesGeometry(panelGeo1));
    const edgeMat1 = track(new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.32,
      blending: THREE.AdditiveBlending
    }));
    const edgeLine1 = new THREE.LineSegments(edgeGeo1, edgeMat1);
    edgeLine1.position.copy(panelMesh1.position);
    edgeLine1.rotation.copy(panelMesh1.rotation);
    floatingGroup.add(edgeLine1);

    // B. Right Floating Architectural Glass Frame (z: -20)
    const panelGeo2 = track(new THREE.PlaneGeometry(16, 26));
    const panelMat2 = track(new THREE.MeshBasicMaterial({
      color: 0x091428,
      transparent: true,
      opacity: 0.24,
      side: THREE.DoubleSide
    }));
    const panelMesh2 = new THREE.Mesh(panelGeo2, panelMat2);
    panelMesh2.position.set(34, 6, -22);
    panelMesh2.rotation.y = -0.26;
    panelMesh2.rotation.z = 0.03;
    floatingGroup.add(panelMesh2);

    const edgeGeo2 = track(new THREE.EdgesGeometry(panelGeo2));
    const edgeMat2 = track(new THREE.LineBasicMaterial({
      color: 0x60a5fa,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending
    }));
    const edgeLine2 = new THREE.LineSegments(edgeGeo2, edgeMat2);
    edgeLine2.position.copy(panelMesh2.position);
    edgeLine2.rotation.copy(panelMesh2.rotation);
    floatingGroup.add(edgeLine2);

    // 5. Distant Architectural Geometric Silhouettes (Receding Wireframe Monoliths)
    const architecturalGroup = new THREE.Group();
    scene.add(architecturalGroup);

    const monoliths = [
      { x: -44, y: 1,  z: -42, w: 9,  h: 28, d: 8 },
      { x: -28, y: 3,  z: -48, w: 8,  h: 32, d: 7 },
      { x: -14, y: -1, z: -40, w: 7,  h: 24, d: 7 },
      { x: 14,  y: 0,  z: -42, w: 8,  h: 26, d: 8 },
      { x: 28,  y: 4,  z: -50, w: 8,  h: 34, d: 8 },
      { x: 44,  y: 2,  z: -44, w: 10, h: 30, d: 9 }
    ];

    monoliths.forEach((m) => {
      const boxGeo = track(new THREE.BoxGeometry(m.w, m.h, m.d));
      
      // Illuminated wireframe edges
      const edgeGeo = track(new THREE.EdgesGeometry(boxGeo));
      const edgeMat = track(new THREE.LineBasicMaterial({
        color: 0x1d4ed8,
        transparent: true,
        opacity: 0.3,
        blending: THREE.AdditiveBlending
      }));
      const wireframe = new THREE.LineSegments(edgeGeo, edgeMat);
      wireframe.position.set(m.x, m.y, m.z);
      architecturalGroup.add(wireframe);

      // Dark core to occlude background geometry cleanly
      const coreMat = track(new THREE.MeshBasicMaterial({
        color: 0x050914,
        transparent: true,
        opacity: 0.65
      }));
      const coreMesh = new THREE.Mesh(boxGeo, coreMat);
      coreMesh.position.copy(wireframe.position);
      architecturalGroup.add(coreMesh);
    });

    // 6. Subtle Floating Ambient Nodes (Sparingly distributed for depth cues)
    const nodeCount = prefersReducedMotion ? 0 : 26;
    if (nodeCount > 0) {
      const nodeGeo = track(new THREE.BufferGeometry());
      const nodePos = new Float32Array(nodeCount * 3);
      for (let i = 0; i < nodeCount; i++) {
        nodePos[i * 3] = (Math.random() - 0.5) * 85;
        nodePos[i * 3 + 1] = (Math.random() - 0.5) * 36 + 2;
        nodePos[i * 3 + 2] = (Math.random() - 0.5) * 40 - 10;
      }
      nodeGeo.setAttribute('position', new THREE.BufferAttribute(nodePos, 3));
      const nodeMat = track(new THREE.PointsMaterial({
        color: 0x38bdf8,
        size: 0.3,
        transparent: true,
        opacity: 0.42,
        blending: THREE.AdditiveBlending
      }));
      const nodes = new THREE.Points(nodeGeo, nodeMat);
      scene.add(nodes);
    }

    // 7. Multi-Layer Parallax Tracking (Pointer and Scroll, active only when in view)
    let isSectionInView = false;
    let animationFrameId = null;

    const mouse = { currentX: 0, currentY: 0, targetX: 0, targetY: 0 };
    const handlePointerMove = (e) => {
      if (prefersReducedMotion || !isSectionInView) return;
      const clientX = e.clientX || (e.touches && e.touches[0]?.clientX) || 0;
      const clientY = e.clientY || (e.touches && e.touches[0]?.clientY) || 0;

      mouse.targetX = (clientX / window.innerWidth) * 2 - 1;
      mouse.targetY = -(clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    let currentScrollY = window.scrollY;
    let windowHeight = window.innerHeight;
    const handleScroll = () => {
      currentScrollY = window.scrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    let scrollTargetY = 0;
    let scrollCurrentY = 0;

    // 8. Responsive Resize
    let containerTop = container ? container.offsetTop : 0;

    const handleResize = () => {
      if (!container || !renderer) return;
      containerTop = container.offsetTop;
      windowHeight = window.innerHeight;
      const newWidth = container.clientWidth || window.innerWidth;
      const newHeight = container.clientHeight || 750;

      camera.aspect = newWidth / newHeight;
      if (newWidth < 768) {
        camera.position.z = 38;
        gridHelper.position.y = -7.5;
        panelMesh1.position.x = -22;
        edgeLine1.position.x = -22;
        panelMesh2.position.x = 22;
        edgeLine2.position.x = 22;
      } else {
        camera.position.z = 32;
        gridHelper.position.y = -9.0;
        panelMesh1.position.x = -32;
        edgeLine1.position.x = -32;
        panelMesh2.position.x = 34;
        edgeLine2.position.x = 34;
      }
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize, { passive: true });

    // 9. Intersection Observer (Zero GPU/CPU load when offscreen)
    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isSectionInView = entry.isIntersecting;
          if (isSectionInView) {
            if (container) containerTop = container.offsetTop;
            windowHeight = window.innerHeight;
            if (!animationFrameId && !document.hidden) {
              renderLoop();
            }
          } else if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
          }
        });
      },
      { threshold: 0.02 }
    );

    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      intersectionObserver.observe(aboutSection);
    }

    // 10. Render Loop (Zero DOM reflows: reads cached scroll & geometry values)
    const startTime = performance.now();

    const renderLoop = () => {
      if (!isSectionInView || document.hidden) {
        animationFrameId = null;
        return;
      }

      animationFrameId = requestAnimationFrame(renderLoop);

      const elapsed = (performance.now() - startTime) * 0.001;

      // Smooth pointer & scroll interpolation
      if (!prefersReducedMotion) {
        const top = containerTop - currentScrollY;
        scrollTargetY = (top / windowHeight) * 3.0;

        mouse.currentX += (mouse.targetX - mouse.currentX) * 0.05;
        mouse.currentY += (mouse.targetY - mouse.currentY) * 0.05;
        scrollCurrentY += (scrollTargetY - scrollCurrentY) * 0.06;

        camera.position.x = mouse.currentX * 3.2;
        camera.position.y = 3 + mouse.currentY * 1.8 + scrollCurrentY;
        camera.lookAt(0, 0, -10);

        // Slow architectural breathing
        floatingGroup.position.y = Math.sin(elapsed * 0.25) * 0.4;
        gridHelper.position.z = -8 + (Math.sin(elapsed * 0.18) * 0.6);
      }

      renderer.render(scene, camera);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
          animationFrameId = null;
        }
      } else if (isSectionInView && !animationFrameId) {
        renderLoop();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      if (aboutSection) intersectionObserver.unobserve(aboutSection);

      disposables.forEach((d) => {
        if (d && typeof d.dispose === 'function') d.dispose();
      });

      if (renderer) {
        renderer.dispose();
        if (renderer.domElement && renderer.domElement.parentNode) {
          renderer.domElement.parentNode.removeChild(renderer.domElement);
        }
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="about-3d-canvas-container" 
      aria-hidden="true" 
    />
  );
};

export default AboutCanvas3D;
