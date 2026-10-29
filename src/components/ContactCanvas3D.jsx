import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * ContactCanvas3D
 * Cinematic 3D atmospheric environment extending through the Contact section.
 * Aligned with Projects, Activity, Academic, Skills, About, and Hero sections:
 * - Anchored in midnight-blue (#060a14) with exponential atmospheric fog
 * - Technical transmission & communication structure positioned in negative space
 * - Central geodesic transmission polyhedron (Icosahedron with wireframe edges & glass faces)
 * - Dual concentric orbital transmission rings with moving satellite data nodes
 * - Receding perspective ground grid establishing architectural scale
 * - Dual-tone ambient stardust particles (cyan #38bdf8 and royal blue #3b82f6)
 * - Strict performance safeguards:
 *     - Capped DPR (1.0), antialias disabled for maximum frame rate
 *     - Absolutely positioned wrapper with pointer-events: none (zero document flow impact)
 *     - Automatic pause when offscreen via IntersectionObserver
 *     - Automatic pause when browser tab is inactive (document.visibilitychange)
 *     - Complete resource disposal (geometry, materials, renderer) on unmount
 *     - Respects prefers-reduced-motion (static rendering, zero continuous rotation)
 */
const ContactCanvas3D = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let cleanupFn = () => {};

    try {
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

      const disposables = [];
      const track = (resource) => {
        if (resource) disposables.push(resource);
        return resource;
      };

      // 1. Scene & Atmospheric Fog (#060a14)
      const scene = new THREE.Scene();
      scene.fog = new THREE.FogExp2(0x060a14, 0.015);

      const width = container.clientWidth || window.innerWidth || 1200;
      const height = container.clientHeight || window.innerHeight || 800;

      const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 700);
      camera.position.set(0, 0, 32);
      camera.lookAt(0, 0, 0);

      let renderer;
      try {
        renderer = new THREE.WebGLRenderer({
          alpha: true,
          antialias: false,
          powerPreference: 'high-performance'
        });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.0));
        renderer.setSize(width, height, false);
        renderer.domElement.style.width = '100%';
        renderer.domElement.style.height = '100%';
        renderer.setClearColor(0x000000, 0);
        container.appendChild(renderer.domElement);
      } catch (e) {
        console.warn('ContactCanvas3D WebGLRenderer creation bypassed:', e);
        return;
      }

      // 2. Spatial Dual-Tone Lighting
      const ambientLight = track(new THREE.AmbientLight(0x0b1329, 2.4));
      scene.add(ambientLight);

      // Cyan key light
      const cyanLight = track(new THREE.PointLight(0x38bdf8, 4.0, 110));
      cyanLight.position.set(16, 18, 16);
      scene.add(cyanLight);

      // Royal blue fill light
      const blueLight = track(new THREE.PointLight(0x2563eb, 3.4, 110));
      blueLight.position.set(-16, -10, 14);
      scene.add(blueLight);

      // Emerald subtle accent light
      const emeraldLight = track(new THREE.PointLight(0x10b981, 1.8, 80));
      emeraldLight.position.set(6, 14, 10);
      scene.add(emeraldLight);

      // 3. Technical Transmission Node Group
      // Repositioned strategically higher in negative space toward the upper-right quadrant
      const transmissionGroup = new THREE.Group();
      transmissionGroup.position.set(7.5, 6.8, -3.0);
      transmissionGroup.scale.set(1.18, 1.18, 1.18);
      scene.add(transmissionGroup);

      // Inner Core: Translucent Geodesic Icosahedron
      const coreGeo = track(new THREE.IcosahedronGeometry(3.6, 0));
      const coreMat = track(new THREE.MeshBasicMaterial({
        color: 0x0c2044,
        transparent: true,
        opacity: 0.40,
        wireframe: false
      }));
      const coreMesh = track(new THREE.Mesh(coreGeo, coreMat));
      transmissionGroup.add(coreMesh);

      // Outer Wireframe Lattice
      const wireMat = track(new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        wireframe: true,
        transparent: true,
        opacity: 0.55,
        blending: THREE.AdditiveBlending
      }));
      const wireMesh = track(new THREE.Mesh(coreGeo, wireMat));
      transmissionGroup.add(wireMesh);

      // Inner Wireframe Octahedron Core
      const innerOctGeo = track(new THREE.OctahedronGeometry(2.0, 0));
      const innerOctMat = track(new THREE.MeshBasicMaterial({
        color: 0x60a5fa,
        wireframe: true,
        transparent: true,
        opacity: 0.75,
        blending: THREE.AdditiveBlending
      }));
      const innerOctMesh = track(new THREE.Mesh(innerOctGeo, innerOctMat));
      transmissionGroup.add(innerOctMesh);

      // Primary Orbital Ring (Cyan)
      const ring1Geo = track(new THREE.TorusGeometry(5.8, 0.045, 16, 64));
      const ring1Mat = track(new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.52,
        blending: THREE.AdditiveBlending
      }));
      const ring1Mesh = track(new THREE.Mesh(ring1Geo, ring1Mat));
      ring1Mesh.rotation.x = Math.PI / 3;
      ring1Mesh.rotation.y = Math.PI / 6;
      transmissionGroup.add(ring1Mesh);

      // Secondary Orbital Ring (Blue)
      const ring2Geo = track(new THREE.TorusGeometry(7.8, 0.04, 16, 64));
      const ring2Mat = track(new THREE.MeshBasicMaterial({
        color: 0x3b82f6,
        transparent: true,
        opacity: 0.42,
        blending: THREE.AdditiveBlending
      }));
      const ring2Mesh = track(new THREE.Mesh(ring2Geo, ring2Mat));
      ring2Mesh.rotation.x = -Math.PI / 4;
      ring2Mesh.rotation.z = Math.PI / 5;
      transmissionGroup.add(ring2Mesh);

      // Orbiting Satellite Signal Nodes
      const satGeo = track(new THREE.SphereGeometry(0.22, 10, 10));
      const sat1Mat = track(new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        blending: THREE.AdditiveBlending
      }));
      const sat1 = track(new THREE.Mesh(satGeo, sat1Mat));
      transmissionGroup.add(sat1);

      const sat2Mat = track(new THREE.MeshBasicMaterial({
        color: 0x10b981,
        blending: THREE.AdditiveBlending
      }));
      const sat2 = track(new THREE.Mesh(satGeo, sat2Mat));
      transmissionGroup.add(sat2);

      // 4. Receding Perspective Ground Grid
      const gridHelper = track(new THREE.GridHelper(130, 36, 0x38bdf8, 0x1e3a8a));
      gridHelper.position.set(0, -11, -8);
      gridHelper.rotation.x = 0.12;
      if (gridHelper.material) {
        gridHelper.material.transparent = true;
        gridHelper.material.opacity = 0.28;
        gridHelper.material.blending = THREE.AdditiveBlending;
      }
      scene.add(gridHelper);

      // 5. Dual-Tone Ambient Stardust Particles
      const particleCount = 140;
      const pPositionsCyan = new Float32Array(particleCount * 3);
      const pPositionsBlue = new Float32Array(particleCount * 3);

      for (let i = 0; i < particleCount * 3; i += 3) {
        pPositionsCyan[i] = (Math.random() - 0.5) * 70;
        pPositionsCyan[i + 1] = (Math.random() - 0.5) * 44;
        pPositionsCyan[i + 2] = (Math.random() - 0.5) * 30 - 5;

        pPositionsBlue[i] = (Math.random() - 0.5) * 70;
        pPositionsBlue[i + 1] = (Math.random() - 0.5) * 44;
        pPositionsBlue[i + 2] = (Math.random() - 0.5) * 30 - 5;
      }

      const pGeoCyan = track(new THREE.BufferGeometry());
      pGeoCyan.setAttribute('position', new THREE.BufferAttribute(pPositionsCyan, 3));
      const pMatCyan = track(new THREE.PointsMaterial({
        size: 0.16,
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.55,
        blending: THREE.AdditiveBlending
      }));
      const particlesCyan = track(new THREE.Points(pGeoCyan, pMatCyan));
      scene.add(particlesCyan);

      const pGeoBlue = track(new THREE.BufferGeometry());
      pGeoBlue.setAttribute('position', new THREE.BufferAttribute(pPositionsBlue, 3));
      const pMatBlue = track(new THREE.PointsMaterial({
        size: 0.18,
        color: 0x3b82f6,
        transparent: true,
        opacity: 0.45,
        blending: THREE.AdditiveBlending
      }));
      const particlesBlue = track(new THREE.Points(pGeoBlue, pMatBlue));
      scene.add(particlesBlue);

      // 6. Interactive Motion & Parallax State
      let mouseX = 0;
      let mouseY = 0;
      let targetX = 0;
      let targetY = 0;
      let animationFrameId = null;
      let isVisible = true;
      let lastTime = performance.now();

      const handleMouseMove = (e) => {
        const halfW = window.innerWidth / 2;
        const halfH = window.innerHeight / 2;
        targetX = (e.clientX - halfW) / halfW;
        targetY = (e.clientY - halfH) / halfH;
      };

      if (!prefersReducedMotion) {
        window.addEventListener('mousemove', handleMouseMove, { passive: true });
      }

      // Responsive Resize
      const handleResize = () => {
        if (!container || !renderer) return;
        const newWidth = container.clientWidth || window.innerWidth || 1200;
        const newHeight = container.clientHeight || window.innerHeight || 800;
        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(newWidth, newHeight, false);
      };
      window.addEventListener('resize', handleResize, { passive: true });

      // Tab Visibility Management
      const handleVisibilityChange = () => {
        if (document.hidden) {
          if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
          }
        } else if (isVisible && !animationFrameId) {
          lastTime = performance.now();
          animate();
        }
      };
      document.addEventListener('visibilitychange', handleVisibilityChange);

      // Viewport IntersectionObserver
      let observer = null;
      if (window.IntersectionObserver) {
        observer = new IntersectionObserver(
          ([entry]) => {
            isVisible = entry.isIntersecting;
            if (isVisible && !document.hidden) {
              if (!animationFrameId) {
                lastTime = performance.now();
                animate();
              }
            } else if (!isVisible && animationFrameId) {
              cancelAnimationFrame(animationFrameId);
              animationFrameId = null;
            }
          },
          { threshold: 0.05 }
        );
        observer.observe(container);
      }

      // 7. Animation Loop
      let elapsedTime = 0;
      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);

        const now = performance.now();
        const delta = Math.min((now - lastTime) / 1000, 0.1);
        lastTime = now;
        elapsedTime += delta;

        if (!prefersReducedMotion) {
          // Smooth mouse dampening
          mouseX += (targetX - mouseX) * 0.04;
          mouseY += (targetY - mouseY) * 0.04;

          // Camera gentle tilt and parallax
          camera.position.x = mouseX * 1.8;
          camera.position.y = mouseY * 1.2;
          camera.lookAt(0, 0, 0);

          // Polyhedron rotations
          wireMesh.rotation.x = elapsedTime * 0.14;
          wireMesh.rotation.y = elapsedTime * 0.18;
          coreMesh.rotation.x = elapsedTime * 0.14;
          coreMesh.rotation.y = elapsedTime * 0.18;

          innerOctMesh.rotation.x = elapsedTime * -0.22;
          innerOctMesh.rotation.y = elapsedTime * 0.25;

          // Orbital rings rotation
          ring1Mesh.rotation.z = elapsedTime * 0.18;
          ring2Mesh.rotation.z = elapsedTime * -0.15;

          // Orbiting satellites
          const sat1Angle = elapsedTime * 0.65;
          sat1.position.x = Math.cos(sat1Angle) * 5.8;
          sat1.position.y = Math.sin(sat1Angle) * 3.4;
          sat1.position.z = Math.sin(sat1Angle) * 4.2;

          const sat2Angle = -elapsedTime * 0.50 + Math.PI;
          sat2.position.x = Math.cos(sat2Angle) * 7.6;
          sat2.position.y = Math.sin(sat2Angle) * 4.8;
          sat2.position.z = Math.cos(sat2Angle) * 3.2;

          // Particle drift
          particlesCyan.rotation.y = elapsedTime * 0.012;
          particlesBlue.rotation.y = elapsedTime * -0.010;
        }

        renderer.render(scene, camera);
      };

      if (isVisible && !document.hidden) {
        animate();
      }

      cleanupFn = () => {
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
        }
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        window.removeEventListener('resize', handleResize);
        if (!prefersReducedMotion) {
          window.removeEventListener('mousemove', handleMouseMove);
        }

        if (observer) {
          observer.disconnect();
        }

        disposables.forEach((item) => {
          if (item && typeof item.dispose === 'function') {
            item.dispose();
          }
        });

        if (renderer && renderer.domElement && renderer.domElement.parentNode) {
          renderer.domElement.parentNode.removeChild(renderer.domElement);
        }
        if (renderer) renderer.dispose();
      };
    } catch (err) {
      console.warn('ContactCanvas3D safely encountered an error and was isolated:', err);
    }

    return () => cleanupFn();
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="contact-3d-canvas-container" 
      aria-hidden="true" 
    />
  );
};

export default ContactCanvas3D;

