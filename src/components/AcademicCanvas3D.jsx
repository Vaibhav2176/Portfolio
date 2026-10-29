import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * AcademicCanvas3D
 * Cinematic 3D atmospheric background for the Academic section.
 * Aligned with About & Skills sections:
 * - Anchored in midnight-blue (#060a14) with exponential atmospheric fog
 * - Receding perspective grid floor with illuminated cyan/indigo coordinates
 * - Floating crystalline academic polyhedra (icosahedron & octahedron wireframes) in spatial depth
 * - Sparse ambient light dust particles
 * - Pauses automatically when offscreen (IntersectionObserver)
 * - Complete memory disposal on unmount; respects prefers-reduced-motion
 */
const AcademicCanvas3D = () => {
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

      // 1. Scene & Fog (#060a14)
      const scene = new THREE.Scene();
      scene.fog = new THREE.FogExp2(0x060a14, 0.016);

      const width = container.clientWidth || window.innerWidth || 1200;
      const height = Math.min(container.clientHeight || 750, 960);

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
        renderer.setSize(width, height, false);
        renderer.domElement.style.width = '100%';
        renderer.domElement.style.height = '100%';
        renderer.setClearColor(0x000000, 0);
        container.appendChild(renderer.domElement);
      } catch (e) {
        console.warn('AcademicCanvas3D WebGLRenderer creation bypassed:', e);
        return;
      }

      // 2. Receding Perspective Ground Grid
      const gridGeometry = track(new THREE.PlaneGeometry(160, 160, 40, 40));
      const gridMaterial = track(
        new THREE.MeshBasicMaterial({
          color: 0x38bdf8,
          wireframe: true,
          transparent: true,
          opacity: 0.045,
          blending: THREE.AdditiveBlending
        })
      );
      const gridMesh = new THREE.Mesh(gridGeometry, gridMaterial);
      gridMesh.rotation.x = -Math.PI / 2.25;
      gridMesh.position.set(0, -9.5, -12);
      scene.add(gridMesh);

      // 3. Floating Crystalline Academic Polyhedra (representing geometry of knowledge & discipline)
      const polyGroup = new THREE.Group();
      scene.add(polyGroup);

      const polyData = [
        { geom: new THREE.IcosahedronGeometry(3.2, 0), pos: [-18, 5, -18], rot: [0.002, 0.003], color: 0x38bdf8 },
        { geom: new THREE.OctahedronGeometry(2.6, 0), pos: [20, 3, -15], rot: [-0.003, 0.002], color: 0x818cf8 },
        { geom: new THREE.TetrahedronGeometry(2.0, 0), pos: [-14, -4, -10], rot: [0.003, -0.002], color: 0x2dd4bf },
        { geom: new THREE.IcosahedronGeometry(2.4, 0), pos: [17, -5, -12], rot: [0.002, 0.004], color: 0x60a5fa }
      ];

      const polyMeshes = [];
      polyData.forEach((p) => {
        const g = track(p.geom);
        // Wireframe overlay
        const wireMat = track(
          new THREE.MeshBasicMaterial({
            color: p.color,
            wireframe: true,
            transparent: true,
            opacity: 0.16,
            blending: THREE.AdditiveBlending
          })
        );
        // Faint translucent inner facet
        const fillMat = track(
          new THREE.MeshBasicMaterial({
            color: p.color,
            transparent: true,
            opacity: 0.02,
            blending: THREE.AdditiveBlending
          })
        );

        const mesh = new THREE.Mesh(g, fillMat);
        const wireMesh = new THREE.Mesh(g, wireMat);
        mesh.add(wireMesh);
        mesh.position.set(...p.pos);
        mesh.userData = { rotSpeed: p.rot, initialY: p.pos[1], seed: Math.random() * 10 };
        polyGroup.add(mesh);
        polyMeshes.push(mesh);
      });

      // 4. Sparse Floating Ambient Particles
      const particleCount = 45;
      const particlePositions = new Float32Array(particleCount * 3);
      for (let i = 0; i < particleCount; i++) {
        particlePositions[i * 3] = (Math.random() - 0.5) * 60;
        particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 30;
        particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 40 - 5;
      }
      const particleGeometry = track(new THREE.BufferGeometry());
      particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

      const particleMaterial = track(
        new THREE.PointsMaterial({
          color: 0x38bdf8,
          size: 1.2,
          transparent: true,
          opacity: 0.28,
          blending: THREE.AdditiveBlending
        })
      );
      const particles = new THREE.Points(particleGeometry, particleMaterial);
      scene.add(particles);

      // 5. Responsive Resize
      const handleResize = () => {
        if (!container || !renderer) return;
        const w = container.clientWidth || window.innerWidth;
        const h = Math.min(container.clientHeight || 750, 960);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h, false);
      };
      window.addEventListener('resize', handleResize);

      // 6. Interactive Mouse Parallax (subtle, clamped, window-normalized without layout reflows)
      let isVisible = false;
      let animationFrameId = null;
      let observer = null;
      let mouseX = 0;
      let mouseY = 0;
      let targetX = 0;
      let targetY = 0;

      const handleMouseMove = (e) => {
        if (prefersReducedMotion || !isVisible) return;
        const normX = (e.clientX / window.innerWidth) * 2 - 1;
        const normY = -(e.clientY / window.innerHeight) * 2 + 1;
        targetX = normX * 1.5;
        targetY = normY * 0.8;
      };
      window.addEventListener('mousemove', handleMouseMove, { passive: true });

      // 7. Intersection Observer for Pause
      if (typeof IntersectionObserver !== 'undefined') {
        observer = new IntersectionObserver(
          ([entry]) => {
            isVisible = entry.isIntersecting;
            if (isVisible) {
              if (!animationFrameId && !document.hidden) {
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
      }

      // 8. Animation Loop
      const startTime = performance.now();

      const animate = () => {
        if (!isVisible || document.hidden) {
          animationFrameId = null;
          return;
        }

        animationFrameId = requestAnimationFrame(animate);

        const elapsed = (performance.now() - startTime) * 0.001;

        if (!prefersReducedMotion) {
          mouseX += (targetX - mouseX) * 0.04;
          mouseY += (targetY - mouseY) * 0.04;

          camera.position.x = mouseX;
          camera.position.y = 3 + mouseY;
          camera.lookAt(0, 0, 0);

          // Rotate polyhedra gently
          polyMeshes.forEach((mesh) => {
            mesh.rotation.x += mesh.userData.rotSpeed[0];
            mesh.rotation.y += mesh.userData.rotSpeed[1];
            mesh.position.y = mesh.userData.initialY + Math.sin(elapsed * 0.8 + mesh.userData.seed) * 0.5;
          });

          // Gentle particle drift
          particles.rotation.y = elapsed * 0.015;
        }

        renderer.render(scene, camera);
      };

      const handleVisibilityChange = () => {
        if (document.hidden) {
          if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
          }
        } else if (isVisible && !animationFrameId) {
          animate();
        }
      };
      document.addEventListener('visibilitychange', handleVisibilityChange);

      // 9. Cleanup & Full Resource Disposal
      cleanupFn = () => {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('mousemove', handleMouseMove);
        if (observer) observer.disconnect();

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
      console.warn('AcademicCanvas3D safely encountered an error and was isolated:', err);
    }

    return () => cleanupFn();
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="academic-3d-canvas-container" 
      aria-hidden="true" 
    />
  );
};

export default AcademicCanvas3D;

