import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * HeroCanvas3D: Cinematic Night Sky & Atmospheric Cityscape for the Portfolio Hero.
 * Retains subtle, restrained spatial depth matching the custom portfolio image:
 * - Distant high-rise architectural skyline silhouettes in atmospheric fog
 * - Distant celestial moon in upper left sky
 * - Subtle dual-tone lighting (cool cyan on left, warm ambient on right)
 * - Gentle camera parallax responding smoothly to cursor position
 * - Free of busy constellation line networks, wireframes, or distracting orbital geometry
 * - Automatically pauses on scroll for zero CPU/GPU waste; respects prefers-reduced-motion
 */
const HeroCanvas3D = () => {
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

    // 1. Scene & Cinematic Night Fog
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x060a14, 0.016);

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 34);

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
      console.warn('WebGL init failed:', err);
      return;
    }

    const disposables = [];
    const track = (obj) => {
      disposables.push(obj);
      return obj;
    };

    // 2. Restrained Dual-Tone Lighting
    const ambientLight = track(new THREE.AmbientLight(0x070c17, 3.5));
    scene.add(ambientLight);

    // Left ambient moonlight
    const lightCyan = track(new THREE.PointLight(0x38bdf8, 3.5, 90));
    lightCyan.position.set(-22, 12, 12);
    scene.add(lightCyan);

    // Right warm ambient fill
    const lightAmber = track(new THREE.PointLight(0xf59e0b, 3.8, 80));
    lightAmber.position.set(24, -4, 14);
    scene.add(lightAmber);

    // 3. Upper Left Celestial Moon
    const moonGeo = track(new THREE.SphereGeometry(3.2, 32, 32));
    const moonMat = track(new THREE.MeshBasicMaterial({
      color: 0xe2e8f0,
      transparent: true,
      opacity: 0.8
    }));
    const moonMesh = new THREE.Mesh(moonGeo, moonMat);
    moonMesh.position.set(-26, 15, -38);
    scene.add(moonMesh);

    // Moon soft halo ring
    const haloGeo = track(new THREE.RingGeometry(3.3, 5.0, 32));
    const haloMat = track(new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.18,
      side: THREE.DoubleSide
    }));
    const haloMesh = new THREE.Mesh(haloGeo, haloMat);
    haloMesh.position.copy(moonMesh.position);
    haloMesh.position.z += 0.1;
    scene.add(haloMesh);

    // 4. Distant Architectural Skyline (Subtle Monoliths in Atmospheric Fog)
    const skylineGroup = new THREE.Group();
    scene.add(skylineGroup);

    const towers = [
      { x: -40, w: 6, h: 22, z: -36 },
      { x: -30, w: 5, h: 28, z: -42 },
      { x: -20, w: 7, h: 18, z: -34 },
      { x: -10, w: 5, h: 24, z: -38 },
      { x: 2,   w: 6, h: 16, z: -35 },
      { x: 12,  w: 5.5, h: 26, z: -38 },
      { x: 22,  w: 7, h: 30, z: -44 },
      { x: 32,  w: 6, h: 20, z: -36 },
      { x: 42,  w: 8, h: 25, z: -40 }
    ];

    towers.forEach((t) => {
      const boxGeo = track(new THREE.BoxGeometry(t.w, t.h, 4));
      const boxMat = track(new THREE.MeshBasicMaterial({
        color: 0x060c18,
        transparent: true,
        opacity: 0.7
      }));
      const mesh = new THREE.Mesh(boxGeo, boxMat);
      mesh.position.set(t.x, t.h / 2 - 14, t.z);
      skylineGroup.add(mesh);

      // Subtle top/side edge highlight
      const edgeGeo = track(new THREE.EdgesGeometry(boxGeo));
      const edgeMat = track(new THREE.LineBasicMaterial({
        color: 0x1e3a8a,
        transparent: true,
        opacity: 0.25
      }));
      const edgeLine = new THREE.LineSegments(edgeGeo, edgeMat);
      edgeLine.position.copy(mesh.position);
      skylineGroup.add(edgeLine);
    });

    // 5. Subtle Receding Ground Plane Grid (Architectural depth & grounding)
    const gridHelper = track(new THREE.GridHelper(140, 42, 0x1d4ed8, 0x0f244a));
    gridHelper.position.set(0, -13.5, -8);
    if (gridHelper.material) {
      gridHelper.material.transparent = true;
      gridHelper.material.opacity = 0.22;
      gridHelper.material.blending = THREE.AdditiveBlending;
    }
    scene.add(gridHelper);

    // 6. Ambient Stardust (Very subtle, soft drift)
    const dustCount = prefersReducedMotion ? 20 : 40;
    const dustGeo = track(new THREE.BufferGeometry());
    const dustPositions = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      dustPositions[i * 3] = (Math.random() - 0.5) * 90;
      dustPositions[i * 3 + 1] = (Math.random() - 0.5) * 60;
      dustPositions[i * 3 + 2] = (Math.random() - 0.5) * 35;
    }
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
    const dustMat = track(new THREE.PointsMaterial({
      color: 0x60a5fa,
      size: 0.2,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending
    }));
    const stardust = new THREE.Points(dustGeo, dustMat);
    scene.add(stardust);

    // 7. Mouse Pointer Parallax Tracking (Active only when Hero is in viewport)
    let isVisible = true;
    let isTabActive = !document.hidden;
    let animationFrameId = null;

    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const handlePointerMove = (e) => {
      if (prefersReducedMotion || !isVisible) return;
      const clientX = e.clientX || (e.touches && e.touches[0]?.clientX) || 0;
      const clientY = e.clientY || (e.touches && e.touches[0]?.clientY) || 0;

      mouse.targetX = (clientX / window.innerWidth) * 2 - 1;
      mouse.targetY = -(clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    // 8. Responsive Resize
    const handleResize = () => {
      if (!container || !renderer) return;
      const newWidth = container.clientWidth || window.innerWidth;
      const newHeight = container.clientHeight || window.innerHeight;

      camera.aspect = newWidth / newHeight;
      if (newWidth < 768) {
        camera.position.z = 40;
        moonMesh.position.set(-14, 18, -38);
      } else {
        camera.position.z = 34;
        moonMesh.position.set(-26, 15, -38);
      }
      haloMesh.position.copy(moonMesh.position);
      haloMesh.position.z += 0.1;

      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize, { passive: true });
    handleResize();

    // 9. Visibility Controls: Zero CPU/GPU work when off-screen or tab is backgrounded
    const handleVisibilityChange = () => {
      isTabActive = !document.hidden;
      if (isTabActive && isVisible && !animationFrameId) {
        animate();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      if (isVisible && isTabActive) {
        if (!animationFrameId) {
          animate();
        }
      } else if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
    }, { threshold: 0.02 });

    observer.observe(container);

    // 10. Animation Loop
    const startTime = performance.now();

    const animate = () => {
      if (!isVisible || !isTabActive) {
        animationFrameId = null;
        return;
      }
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = (performance.now() - startTime) * 0.001;

      // Smooth pointer lerp
      mouse.x += (mouse.targetX - mouse.x) * 0.04;
      mouse.y += (mouse.targetY - mouse.y) * 0.04;

      if (!prefersReducedMotion) {
        // Slow celestial drift
        stardust.rotation.y = elapsedTime * 0.005;

        // Subtle breathing of the moon halo
        haloMesh.scale.setScalar(1 + Math.sin(elapsedTime * 0.6) * 0.02);

        // Skyline parallax
        skylineGroup.position.x = -mouse.x * 1.0;
        skylineGroup.position.y = -mouse.y * 0.5;

        // Ground grid slight shift
        gridHelper.position.x = -mouse.x * 0.6;

        // Smooth camera parallax
        camera.position.x = mouse.x * 1.2;
        camera.position.y = mouse.y * 0.8;
        camera.lookAt(0, 0, 0);
      }

      renderer.render(scene, camera);
    };

    animate();

    // 11. Cleanup on Unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('resize', handleResize);

      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }

      disposables.forEach((item) => {
        if (item && typeof item.dispose === 'function') {
          item.dispose();
        }
      });
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="hero-3d-canvas-container" 
      aria-hidden="true" 
    />
  );
};

export default HeroCanvas3D;
