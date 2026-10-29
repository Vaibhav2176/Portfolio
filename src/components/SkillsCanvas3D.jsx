import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * SkillsCanvas3D: Cinematic Atmospheric 3D Environment for the Skills Section.
 * Aligned with the Hero & About sections:
 * - Receding perspective ground grid with glowing cyan/indigo lines (AdditiveBlending)
 * - Floating translucent geometric glass panels with illuminated wireframe outlines in negative space
 * - Faint drifting particle nodes and architectural wireframe monoliths at deep Z coordinates
 * - Spatial dual-tone lighting (cool cyan on left, royal blue/violet on right)
 * - Multi-layer parallax responding to pointer movement and window scroll
 * - Automatic pause when offscreen via IntersectionObserver (zero wasted CPU/GPU)
 * - Full memory disposal on unmount; respects prefers-reduced-motion
 */
const SkillsCanvas3D = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Check WebGL availability
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

    // Memory tracking registry
    const disposables = [];
    const track = (resource) => {
      if (resource) disposables.push(resource);
      return resource;
    };

    // 1. Scene & Cinematic Fog Anchored to Midnight-Blue (#060a14)
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x060a14, 0.016);

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 750;

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 700);
    camera.position.set(0, 3, 30);
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
    } catch {
      return;
    }

    // 2. Spatial Dual-Tone Lighting (Cyan on left, deep royal blue on right)
    const ambientLight = track(new THREE.AmbientLight(0x0b1329, 2.0));
    scene.add(ambientLight);

    const cyanPoint = track(new THREE.PointLight(0x38bdf8, 4.2, 90));
    cyanPoint.position.set(-24, 8, 14);
    scene.add(cyanPoint);

    const bluePoint = track(new THREE.PointLight(0x2563eb, 3.8, 90));
    bluePoint.position.set(24, 6, 12);
    scene.add(bluePoint);

    const violetPoint = track(new THREE.PointLight(0x818cf8, 2.2, 75));
    violetPoint.position.set(0, -10, 10);
    scene.add(violetPoint);

    // 3. Receding Perspective Ground Grid (Clearly visible sloping horizon)
    const gridHelper = track(new THREE.GridHelper(160, 48, 0x38bdf8, 0x1e3a8a));
    gridHelper.position.set(0, -9.5, -8);
    gridHelper.rotation.x = 0.12;
    if (gridHelper.material) {
      gridHelper.material.transparent = true;
      gridHelper.material.opacity = 0.38;
      gridHelper.material.blending = THREE.AdditiveBlending;
    }
    scene.add(gridHelper);

    // 4. Floating Translucent Architectural Glass Panels in Negative Space
    const floatingGroup = new THREE.Group();
    scene.add(floatingGroup);

    // A. Left Floating Panel (x: -34, z: -18)
    const panelGeo1 = track(new THREE.PlaneGeometry(14, 22));
    const panelMat1 = track(new THREE.MeshBasicMaterial({
      color: 0x0c1a36,
      transparent: true,
      opacity: 0.28,
      side: THREE.DoubleSide
    }));
    const panelMesh1 = new THREE.Mesh(panelGeo1, panelMat1);
    panelMesh1.position.set(-34, 4, -18);
    panelMesh1.rotation.set(-0.06, 0.28, -0.04);
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

    // B. Right Floating Panel (x: 36, z: -20)
    const panelGeo2 = track(new THREE.PlaneGeometry(16, 24));
    const panelMat2 = track(new THREE.MeshBasicMaterial({
      color: 0x091428,
      transparent: true,
      opacity: 0.24,
      side: THREE.DoubleSide
    }));
    const panelMesh2 = new THREE.Mesh(panelGeo2, panelMat2);
    panelMesh2.position.set(36, 6, -20);
    panelMesh2.rotation.set(0.08, -0.26, 0.03);
    floatingGroup.add(panelMesh2);

    const edgeGeo2 = track(new THREE.EdgesGeometry(panelGeo2));
    const edgeMat2 = track(new THREE.LineBasicMaterial({
      color: 0x818cf8,
      transparent: true,
      opacity: 0.32,
      blending: THREE.AdditiveBlending
    }));
    const edgeLine2 = new THREE.LineSegments(edgeGeo2, edgeMat2);
    edgeLine2.position.copy(panelMesh2.position);
    edgeLine2.rotation.copy(panelMesh2.rotation);
    floatingGroup.add(edgeLine2);

    // 5. Subtle Floating Particles (Constellation Nodes in Negative Space)
    const particleCount = 42;
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      // Distribute in negative space flanks
      const side = i % 2 === 0 ? -1 : 1;
      particlePositions[i * 3] = side * (24 + Math.random() * 24);
      particlePositions[i * 3 + 1] = -12 + Math.random() * 28;
      particlePositions[i * 3 + 2] = -10 - Math.random() * 32;
    }

    const particleGeo = track(new THREE.BufferGeometry());
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const particleMat = track(new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 1.4,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending
    }));

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 6. Distant Wireframe Monoliths (Architectural Depth Silhouettes)
    const monolithsGroup = new THREE.Group();
    scene.add(monolithsGroup);

    const monolithConfigs = [
      { x: -44, y: 2,  z: -42, w: 9,  h: 28, d: 8, color: 0x38bdf8 },
      { x: -26, y: 4,  z: -48, w: 8,  h: 32, d: 7, color: 0x2563eb },
      { x:  28, y: 3,  z: -46, w: 8,  h: 30, d: 7, color: 0x818cf8 },
      { x:  46, y: 1,  z: -40, w: 9,  h: 26, d: 8, color: 0x38bdf8 }
    ];

    monolithConfigs.forEach((m) => {
      const geo = track(new THREE.BoxGeometry(m.w, m.h, m.d));
      const mat = track(new THREE.MeshBasicMaterial({
        color: 0x050c1e,
        transparent: true,
        opacity: 0.35
      }));
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(m.x, m.y, m.z);
      monolithsGroup.add(mesh);

      const edgeGeo = track(new THREE.EdgesGeometry(geo));
      const edgeMat = track(new THREE.LineBasicMaterial({
        color: m.color,
        transparent: true,
        opacity: 0.16,
        blending: THREE.AdditiveBlending
      }));
      const line = new THREE.LineSegments(edgeGeo, edgeMat);
      line.position.copy(mesh.position);
      monolithsGroup.add(line);
    });

    // 7. Parallax & Motion State (Active only when Skills is in view)
    let isIntersecting = false;
    let animationFrameId = null;
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    let scrollYOffset = 0;

    const handleMouseMove = (e) => {
      if (prefersReducedMotion || !isIntersecting) return;
      const normX = (e.clientX / window.innerWidth) * 2 - 1;
      const normY = -(e.clientY / window.innerHeight) * 2 + 1;
      targetX = normX * 1.5;
      targetY = normY * 1.0;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    let currentScrollY = window.scrollY;
    let windowHeight = window.innerHeight;
    const handleScroll = () => {
      currentScrollY = window.scrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Handle Resize
    let containerTop = container ? container.offsetTop : 0;
    let containerHeight = container ? (container.offsetHeight || 750) : 750;

    const handleResize = () => {
      if (!container || !renderer) return;
      containerTop = container.offsetTop;
      containerHeight = container.offsetHeight || 750;
      windowHeight = window.innerHeight;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || 750;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // 8. IntersectionObserver to Auto-Pause Rendering
    const observer = new IntersectionObserver(
      ([entry]) => {
        isIntersecting = entry.isIntersecting;
        if (isIntersecting) {
          if (container) {
            containerTop = container.offsetTop;
            containerHeight = container.offsetHeight || 750;
          }
          windowHeight = window.innerHeight;
          if (!animationFrameId && !document.hidden) {
            lastTime = performance.now();
            animate();
          }
        } else if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
          animationFrameId = null;
        }
      },
      { threshold: 0.02 }
    );

    observer.observe(container);

    // 9. Animation Loop (Zero DOM reflows: reads cached scroll & geometry values)
    let lastTime = performance.now();

    const animate = () => {
      if (!isIntersecting || document.hidden) {
        animationFrameId = null;
        return;
      }

      animationFrameId = requestAnimationFrame(animate);

      const now = performance.now();
      const delta = (now - lastTime) / 1000;
      lastTime = now;

      if (!prefersReducedMotion) {
        const top = containerTop - currentScrollY;
        const progress = (windowHeight - top) / (windowHeight + containerHeight);
        scrollYOffset = (progress - 0.5) * 4;

        // Smooth cursor interpolation
        mouseX += (targetX - mouseX) * 0.045;
        mouseY += (targetY - mouseY) * 0.045;

        camera.position.x = mouseX * 2.5;
        camera.position.y = 3 + mouseY * 1.8 + scrollYOffset * 0.6;
        camera.lookAt(0, scrollYOffset * 0.4, 0);

        // Subtle oscillation on floating panels
        panelMesh1.rotation.y = 0.28 + Math.sin(now * 0.0006) * 0.03;
        edgeLine1.rotation.copy(panelMesh1.rotation);

        panelMesh2.rotation.y = -0.26 + Math.cos(now * 0.0005) * 0.03;
        edgeLine2.rotation.copy(panelMesh2.rotation);

        // Faint particle drift
        particles.rotation.y += 0.02 * delta;
      }

      renderer.render(scene, camera);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
          animationFrameId = null;
        }
      } else if (isIntersecting && !animationFrameId) {
        lastTime = performance.now();
        animate();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // 10. Unmount & WebGL Resource Cleanup
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      observer.disconnect();
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);

      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }

      disposables.forEach((item) => {
        if (item.dispose) item.dispose();
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
      className="skills-3d-canvas-container" 
      aria-hidden="true" 
    />
  );
};

export default SkillsCanvas3D;
