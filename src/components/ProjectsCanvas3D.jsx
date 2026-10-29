import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * ProjectsCanvas3D
 * Cinematic 3D atmospheric environment extending continuously through the entire Projects section.
 * Aligned with Hero, About, Skills, Academic, and Activity sections:
 * - Anchored in midnight-blue (#060a14) with exponential atmospheric fog
 * - Vertical spatial distribution providing continuous depth behind all five projects:
 *     1. Rays Academy: Microservices & secure delivery cluster (Cyan #38bdf8)
 *     2. ToolVerse: Client-side modular utility prism (Emerald #10b981)
 *     3. NetSage AI: Deterministic diagnostic engine core (Amber #f59e0b)
 *     4. Nostera: Encrypted memory vault & orbital node (Rose/Violet #f43f5e)
 *     5. HomeSync: Multi-tenant relational schema lattice (Royal Blue #3b82f6)
 * - Receding perspective ground grid & flank wireframe monoliths for architectural scale
 * - Dual-tone ambient stardust particles distributed across the full vertical space
 * - Smooth scroll-synchronized vertical parallax tracking the 5 project presentations
 * - Strict performance safeguards: capped DPR (1.0), viewport sticky wrapper, auto-pause offscreen & on tab hide
 * - Zero memory leaks: full geometry/material disposal on unmount; respects prefers-reduced-motion
 */
const ProjectsCanvas3D = () => {
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

      // 1. Scene & Cinematic Fog (#060a14)
      const scene = new THREE.Scene();
      scene.fog = new THREE.FogExp2(0x060a14, 0.016);

      const width = container.clientWidth || window.innerWidth || 1200;
      const height = container.clientHeight || window.innerHeight || 800;

      const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 800);
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
        console.warn('ProjectsCanvas3D WebGLRenderer creation bypassed:', e);
        return;
      }

      // 2. Spatial Dual-Tone Lighting
      const ambientLight = track(new THREE.AmbientLight(0x0b1329, 2.2));
      scene.add(ambientLight);

      // Cyan illumination
      const cyanLight = track(new THREE.PointLight(0x38bdf8, 3.8, 120));
      cyanLight.position.set(-24, 16, 18);
      scene.add(cyanLight);

      // Royal Blue illumination
      const blueLight = track(new THREE.PointLight(0x2563eb, 3.6, 120));
      blueLight.position.set(24, -16, 18);
      scene.add(blueLight);

      // Emerald & Amber subtle mid-tones
      const emeraldLight = track(new THREE.PointLight(0x10b981, 1.6, 80));
      emeraldLight.position.set(16, 4, 12);
      scene.add(emeraldLight);

      const amberLight = track(new THREE.PointLight(0xf59e0b, 1.6, 80));
      amberLight.position.set(-16, -6, 12);
      scene.add(amberLight);

      // 3. Extended Receding Perspective Ground Grid
      const gridHelper = track(new THREE.GridHelper(180, 48, 0x38bdf8, 0x1e3a8a));
      gridHelper.position.set(0, -18, -12);
      gridHelper.rotation.x = 0.12;
      if (gridHelper.material) {
        gridHelper.material.transparent = true;
        gridHelper.material.opacity = 0.25;
        gridHelper.material.blending = THREE.AdditiveBlending;
      }
      scene.add(gridHelper);

      // 4. Distant Architectural Monoliths in Flanks for Skyline Depth
      const monolithsGroup = new THREE.Group();
      scene.add(monolithsGroup);

      const monolithConfigs = [
        { x: -46, y: 12,  z: -48, w: 9,  h: 36, d: 8, color: 0x38bdf8 },
        { x: -32, y: -4,  z: -52, w: 8,  h: 38, d: 7, color: 0x1e40af },
        { x:  32, y: 8,   z: -50, w: 8,  h: 36, d: 7, color: 0x3b82f6 },
        { x:  46, y: -12, z: -46, w: 9,  h: 32, d: 8, color: 0x06b6d4 }
      ];

      monolithConfigs.forEach((m) => {
        const geo = track(new THREE.BoxGeometry(m.w, m.h, m.d));
        const mat = track(
          new THREE.MeshBasicMaterial({
            color: 0x060e20,
            transparent: true,
            opacity: 0.25
          })
        );
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(m.x, m.y, m.z);
        monolithsGroup.add(mesh);

        const edgeGeo = track(new THREE.EdgesGeometry(geo));
        const edgeMat = track(
          new THREE.LineBasicMaterial({
            color: m.color,
            transparent: true,
            opacity: 0.22,
            blending: THREE.AdditiveBlending
          })
        );
        const edges = new THREE.LineSegments(edgeGeo, edgeMat);
        edges.position.copy(mesh.position);
        monolithsGroup.add(edges);
      });

      // 5. Scrollable Projects Architecture Hierarchy
      // This group moves vertically in tandem with the user's scroll across the 5 projects
      const projectsWorldGroup = new THREE.Group();
      scene.add(projectsWorldGroup);

      // --- NODE 1: Rays Academy Cluster (Y: +14, Cyan #38bdf8) ---
      const raysNodeGeo = track(new THREE.IcosahedronGeometry(2.6, 0));
      const raysNodeMat = track(
        new THREE.MeshBasicMaterial({
          color: 0x38bdf8,
          wireframe: true,
          transparent: true,
          opacity: 0.24,
          blending: THREE.AdditiveBlending
        })
      );
      const raysMesh = new THREE.Mesh(raysNodeGeo, raysNodeMat);
      raysMesh.position.set(-22, 14, -14);
      projectsWorldGroup.add(raysMesh);

      // Child verification node
      const childGeo = track(new THREE.TetrahedronGeometry(1.6, 0));
      const childMat = track(
        new THREE.MeshBasicMaterial({
          color: 0x0284c7,
          wireframe: true,
          transparent: true,
          opacity: 0.20,
          blending: THREE.AdditiveBlending
        })
      );
      const childMesh = new THREE.Mesh(childGeo, childMat);
      childMesh.position.set(-16, 10, -12);
      projectsWorldGroup.add(childMesh);

      // Connector line
      const pipeGeo = track(
        new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(-22, 14, -14),
          new THREE.Vector3(-16, 10, -12)
        ])
      );
      const pipeMat = track(
        new THREE.LineBasicMaterial({
          color: 0x38bdf8,
          transparent: true,
          opacity: 0.26,
          blending: THREE.AdditiveBlending
        })
      );
      projectsWorldGroup.add(new THREE.Line(pipeGeo, pipeMat));

      // --- NODE 2: ToolVerse Modular Utility Prism (Y: +7, Emerald #10b981) ---
      const toolverseGeo = track(new THREE.OctahedronGeometry(2.5, 0));
      const toolverseMat = track(
        new THREE.MeshBasicMaterial({
          color: 0x10b981,
          wireframe: true,
          transparent: true,
          opacity: 0.22,
          blending: THREE.AdditiveBlending
        })
      );
      const toolverseMesh = new THREE.Mesh(toolverseGeo, toolverseMat);
      toolverseMesh.position.set(22, 7, -15);
      projectsWorldGroup.add(toolverseMesh);

      // Outer ring for ToolVerse
      const toolverseRingGeo = track(new THREE.RingGeometry(3.4, 3.7, 32));
      const toolverseRingMat = track(
        new THREE.MeshBasicMaterial({
          color: 0x34d399,
          transparent: true,
          opacity: 0.16,
          side: THREE.DoubleSide,
          blending: THREE.AdditiveBlending
        })
      );
      const toolverseRing = new THREE.Mesh(toolverseRingGeo, toolverseRingMat);
      toolverseRing.position.set(22, 7, -15);
      toolverseRing.rotation.x = Math.PI / 3;
      projectsWorldGroup.add(toolverseRing);

      // --- NODE 3: NetSage AI Diagnostic Core (Y: 0, Amber #f59e0b) ---
      const netsageGeo = track(new THREE.DodecahedronGeometry(2.4, 0));
      const netsageMat = track(
        new THREE.MeshBasicMaterial({
          color: 0xf59e0b,
          wireframe: true,
          transparent: true,
          opacity: 0.24,
          blending: THREE.AdditiveBlending
        })
      );
      const netsageMesh = new THREE.Mesh(netsageGeo, netsageMat);
      netsageMesh.position.set(-21, 0, -14);
      projectsWorldGroup.add(netsageMesh);

      // Diagnostic engine orbital ring
      const netsageRingGeo = track(new THREE.RingGeometry(3.2, 3.5, 32));
      const netsageRingMat = track(
        new THREE.MeshBasicMaterial({
          color: 0xfbbf24,
          transparent: true,
          opacity: 0.18,
          side: THREE.DoubleSide,
          blending: THREE.AdditiveBlending
        })
      );
      const netsageRing = new THREE.Mesh(netsageRingGeo, netsageRingMat);
      netsageRing.position.set(-21, 0, -14);
      netsageRing.rotation.y = Math.PI / 4;
      projectsWorldGroup.add(netsageRing);

      // --- NODE 4: Nostera Emotional Memory Vault (Y: -7, Rose/Violet #f43f5e) ---
      const nosteraGeo = track(new THREE.IcosahedronGeometry(2.3, 0));
      const nosteraMat = track(
        new THREE.MeshBasicMaterial({
          color: 0xf43f5e,
          wireframe: true,
          transparent: true,
          opacity: 0.20,
          blending: THREE.AdditiveBlending
        })
      );
      const nosteraMesh = new THREE.Mesh(nosteraGeo, nosteraMat);
      nosteraMesh.position.set(21, -7, -15);
      projectsWorldGroup.add(nosteraMesh);

      // Nostera satellite node
      const nosteraSatGeo = track(new THREE.SphereGeometry(1.0, 8, 8));
      const nosteraSatMat = track(
        new THREE.MeshBasicMaterial({
          color: 0xfb7185,
          wireframe: true,
          transparent: true,
          opacity: 0.18,
          blending: THREE.AdditiveBlending
        })
      );
      const nosteraSatMesh = new THREE.Mesh(nosteraSatGeo, nosteraSatMat);
      nosteraSatMesh.position.set(16, -5, -13);
      projectsWorldGroup.add(nosteraSatMesh);

      // --- NODE 5: HomeSync Relational Schema Lattice (Y: -14, Royal Blue #3b82f6) ---
      const homesyncGeo = track(new THREE.BoxGeometry(3.2, 3.2, 3.2));
      const homesyncMat = track(
        new THREE.MeshBasicMaterial({
          color: 0x3b82f6,
          wireframe: true,
          transparent: true,
          opacity: 0.22,
          blending: THREE.AdditiveBlending
        })
      );
      const homesyncMesh = new THREE.Mesh(homesyncGeo, homesyncMat);
      homesyncMesh.position.set(-20, -14, -14);
      projectsWorldGroup.add(homesyncMesh);

      // Inner relational core
      const homesyncCoreGeo = track(new THREE.BoxGeometry(1.6, 1.6, 1.6));
      const homesyncCoreMat = track(
        new THREE.MeshBasicMaterial({
          color: 0x60a5fa,
          wireframe: true,
          transparent: true,
          opacity: 0.18,
          blending: THREE.AdditiveBlending
        })
      );
      const homesyncCore = new THREE.Mesh(homesyncCoreGeo, homesyncCoreMat);
      homesyncCore.position.set(-20, -14, -14);
      projectsWorldGroup.add(homesyncCore);

      // 6. Dual-Tone Atmospheric Stardust Particles Distributed Across Space
      const particleHalf = 36;
      const pPosCyan = new Float32Array(particleHalf * 3);
      const pPosBlue = new Float32Array(particleHalf * 3);

      for (let i = 0; i < particleHalf; i++) {
        const side = i % 2 === 0 ? -1 : 1;
        pPosCyan[i * 3] = side * (16 + Math.random() * 26);
        pPosCyan[i * 3 + 1] = (Math.random() - 0.5) * 60;
        pPosCyan[i * 3 + 2] = (Math.random() - 0.5) * 30 - 8;

        pPosBlue[i * 3] = -side * (16 + Math.random() * 26);
        pPosBlue[i * 3 + 1] = (Math.random() - 0.5) * 60;
        pPosBlue[i * 3 + 2] = (Math.random() - 0.5) * 30 - 8;
      }

      const geoCyan = track(new THREE.BufferGeometry());
      geoCyan.setAttribute('position', new THREE.BufferAttribute(pPosCyan, 3));
      const matCyan = track(
        new THREE.PointsMaterial({
          color: 0x38bdf8,
          size: 1.2,
          transparent: true,
          opacity: 0.35,
          blending: THREE.AdditiveBlending
        })
      );
      const particlesCyan = new THREE.Points(geoCyan, matCyan);
      scene.add(particlesCyan);

      const geoBlue = track(new THREE.BufferGeometry());
      geoBlue.setAttribute('position', new THREE.BufferAttribute(pPosBlue, 3));
      const matBlue = track(
        new THREE.PointsMaterial({
          color: 0x60a5fa,
          size: 1.2,
          transparent: true,
          opacity: 0.30,
          blending: THREE.AdditiveBlending
        })
      );
      const particlesBlue = new THREE.Points(geoBlue, matBlue);
      scene.add(particlesBlue);

      // 7. Responsive Resize
      const handleResize = () => {
        if (!container || !renderer) return;
        const w = container.clientWidth || window.innerWidth;
        const h = container.clientHeight || window.innerHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h, false);
      };
      window.addEventListener('resize', handleResize);

      // 8. Scroll & Mouse Tracking (Zero Reflows inside render loop)
      let isVisible = false;
      let animationFrameId = null;
      let observer = null;
      let mouseX = 0;
      let mouseY = 0;
      let targetX = 0;
      let targetY = 0;

      let sectionTop = 0;
      let sectionHeight = 1;
      let cachedScrollY = typeof window !== 'undefined' ? window.scrollY : 0;

      const updateSectionMetrics = () => {
        const sectionEl = document.getElementById('projects');
        if (sectionEl) {
          const rect = sectionEl.getBoundingClientRect();
          sectionTop = (window.scrollY || 0) + rect.top;
          sectionHeight = rect.height || 1;
        }
      };

      updateSectionMetrics();
      window.addEventListener('resize', updateSectionMetrics, { passive: true });

      const handleScroll = () => {
        if (!isVisible) return;
        cachedScrollY = window.scrollY;
      };
      window.addEventListener('scroll', handleScroll, { passive: true });

      const handleMouseMove = (e) => {
        if (prefersReducedMotion || !isVisible) return;
        const normX = (e.clientX / window.innerWidth) * 2 - 1;
        const normY = -(e.clientY / window.innerHeight) * 2 + 1;
        targetX = normX * 1.2;
        targetY = normY * 0.8;
      };
      window.addEventListener('mousemove', handleMouseMove, { passive: true });

      // 9. Intersection Observer (Zero GPU/CPU overhead when out of view)
      const sectionEl = document.getElementById('projects');
      if (typeof IntersectionObserver !== 'undefined' && sectionEl) {
        observer = new IntersectionObserver(
          ([entry]) => {
            isVisible = entry.isIntersecting;
            if (isVisible) {
              updateSectionMetrics();
              if (!animationFrameId && !document.hidden) {
                animate();
              }
            } else if (animationFrameId) {
              cancelAnimationFrame(animationFrameId);
              animationFrameId = null;
            }
          },
          { threshold: 0.01 }
        );
        observer.observe(sectionEl);
      }

      // 10. Document Visibility Change
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

      // 11. Animation Loop
      const startTime = performance.now();
      let currentProgress = 0;

      const animate = () => {
        if (!isVisible || document.hidden) {
          animationFrameId = null;
          return;
        }

        animationFrameId = requestAnimationFrame(animate);

        const elapsedTime = (performance.now() - startTime) * 0.001;

        if (!prefersReducedMotion) {
          // Mouse interpolation
          mouseX += (targetX - mouseX) * 0.04;
          mouseY += (targetY - mouseY) * 0.04;

          // Scroll progress calculation across the 5 projects using cached scroll position
          const scrollY = cachedScrollY;
          const maxScroll = Math.max(sectionHeight - window.innerHeight, 1);
          const rawProgress = Math.min(Math.max((scrollY - sectionTop) / maxScroll, 0), 1);
          currentProgress += (rawProgress - currentProgress) * 0.06;

          // Translate projects group vertically with scroll progress
          // At start (0), node 1 is near center. At end (1), node 5 is near center.
          projectsWorldGroup.position.y = (currentProgress - 0.5) * 28;

          // Camera gentle tilt and parallax
          camera.position.x = mouseX * 2.2;
          camera.position.y = mouseY * 1.4;
          camera.lookAt(0, 0, 0);

          // Subtle rotations for project nodes
          raysMesh.rotation.x = elapsedTime * 0.12;
          raysMesh.rotation.y = elapsedTime * 0.15;
          childMesh.rotation.y = elapsedTime * 0.18;

          toolverseMesh.rotation.x = elapsedTime * 0.14;
          toolverseMesh.rotation.y = elapsedTime * 0.12;
          toolverseRing.rotation.z = elapsedTime * 0.16;

          netsageMesh.rotation.x = elapsedTime * -0.12;
          netsageMesh.rotation.y = elapsedTime * 0.15;
          netsageRing.rotation.z = elapsedTime * -0.15;

          nosteraMesh.rotation.y = elapsedTime * 0.14;
          nosteraSatMesh.position.x = 21 + Math.cos(elapsedTime * 0.8) * 3.2;
          nosteraSatMesh.position.z = -15 + Math.sin(elapsedTime * 0.8) * 3.2;

          homesyncMesh.rotation.x = elapsedTime * 0.10;
          homesyncMesh.rotation.y = elapsedTime * 0.12;
          homesyncCore.rotation.x = elapsedTime * -0.14;
          homesyncCore.rotation.y = elapsedTime * -0.10;

          // Dual-tone particle drift
          particlesCyan.rotation.y = elapsedTime * 0.010;
          particlesBlue.rotation.y = elapsedTime * -0.008;
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
        window.removeEventListener('resize', updateSectionMetrics);
        window.removeEventListener('scroll', handleScroll);
        window.removeEventListener('mousemove', handleMouseMove);

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
      console.warn('ProjectsCanvas3D safely encountered an error and was isolated:', err);
    }

    return () => cleanupFn();
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="projects-3d-canvas-container" 
      aria-hidden="true" 
    />
  );
};

export default ProjectsCanvas3D;
