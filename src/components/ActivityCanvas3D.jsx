import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * ActivityCanvas3D
 * Cinematic 3D atmospheric background extending through the entire Activity section.
 * Aligned with About, Skills, and Academic sections:
 * - Anchored in midnight-blue (#060a14) with exponential atmospheric fog
 * - Full-height spatial distribution spanning both GitHub (top) and LeetCode (bottom)
 * - Upper area: Git commit node clusters illuminated in emerald green (#10b981)
 * - Middle area: Harmonious transition nodes in negative space
 * - Lower area: Algorithmic knowledge polyhedra illuminated in warm amber (#f59e0b)
 * - Deep receding perspective ground grid extending through the bottom of the section
 * - 3D particle atmosphere distributed across the entire section height
 * - High-efficiency rendering: capped DPR (1.0), auto-pause on offscreen & tab hide
 * - Complete memory disposal on unmount; respects prefers-reduced-motion
 */
const ActivityCanvas3D = () => {
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

      // 1. Scene & Cinematic Night Fog (#060a14)
      const scene = new THREE.Scene();
      scene.fog = new THREE.FogExp2(0x060a14, 0.015);

      const width = container.clientWidth || window.innerWidth || 1200;
      const height = Math.min(container.clientHeight || 900, 960);

      const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 800);
      camera.position.set(0, 0, 32);
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
        console.warn('ActivityCanvas3D WebGLRenderer creation bypassed:', e);
        return;
      }

      // 2. Spatial Dual-Tone Lighting Distributed Vertically
      const ambientLight = track(new THREE.AmbientLight(0x0b1329, 2.4));
      scene.add(ambientLight);

      // Upper Left: GitHub Emerald spatial light
      const emeraldUpper = track(new THREE.PointLight(0x10b981, 3.8, 110));
      emeraldUpper.position.set(-24, 12, 16);
      scene.add(emeraldUpper);

      // Lower Right: LeetCode Amber spatial light
      const amberLower = track(new THREE.PointLight(0xf59e0b, 3.8, 110));
      amberLower.position.set(24, -12, 16);
      scene.add(amberLower);

      // Middle fill: Subtle atmospheric cyan
      const midFill = track(new THREE.PointLight(0x064e3b, 1.8, 80));
      midFill.position.set(0, 0, 10);
      scene.add(midFill);

      // 3. Extended Receding Perspective Ground Grid
      const gridHelper = track(new THREE.GridHelper(180, 48, 0x10b981, 0x064e3b));
      gridHelper.position.set(0, -10.5, -8);
      gridHelper.rotation.x = 0.12;
      if (gridHelper.material) {
        gridHelper.material.transparent = true;
        gridHelper.material.opacity = 0.30;
        gridHelper.material.blending = THREE.AdditiveBlending;
      }
      scene.add(gridHelper);

      // 4. Floating Translucent Architectural Glass Panels in Negative Space
      const floatingPanelsGroup = new THREE.Group();
      scene.add(floatingPanelsGroup);

      // A. Left Floating Panel (x: -36, z: -18) — Emerald Identity
      const panelGeo1 = track(new THREE.PlaneGeometry(14, 22));
      const panelMat1 = track(
        new THREE.MeshBasicMaterial({
          color: 0x06281e,
          transparent: true,
          opacity: 0.22,
          side: THREE.DoubleSide
        })
      );
      const panelMesh1 = new THREE.Mesh(panelGeo1, panelMat1);
      panelMesh1.position.set(-36, 6, -18);
      panelMesh1.rotation.set(-0.06, 0.28, -0.04);
      floatingPanelsGroup.add(panelMesh1);

      const edgeGeo1 = track(new THREE.EdgesGeometry(panelGeo1));
      const edgeMat1 = track(
        new THREE.LineBasicMaterial({
          color: 0x10b981,
          transparent: true,
          opacity: 0.32,
          blending: THREE.AdditiveBlending
        })
      );
      const edgeLine1 = new THREE.LineSegments(edgeGeo1, edgeMat1);
      edgeLine1.position.copy(panelMesh1.position);
      edgeLine1.rotation.copy(panelMesh1.rotation);
      floatingPanelsGroup.add(edgeLine1);

      // B. Right Floating Panel (x: 36, z: -20) — Amber Identity
      const panelGeo2 = track(new THREE.PlaneGeometry(16, 24));
      const panelMat2 = track(
        new THREE.MeshBasicMaterial({
          color: 0x241804,
          transparent: true,
          opacity: 0.20,
          side: THREE.DoubleSide
        })
      );
      const panelMesh2 = new THREE.Mesh(panelGeo2, panelMat2);
      panelMesh2.position.set(36, -6, -20);
      panelMesh2.rotation.set(0.08, -0.26, 0.03);
      floatingPanelsGroup.add(panelMesh2);

      const edgeGeo2 = track(new THREE.EdgesGeometry(panelGeo2));
      const edgeMat2 = track(
        new THREE.LineBasicMaterial({
          color: 0xf59e0b,
          transparent: true,
          opacity: 0.30,
          blending: THREE.AdditiveBlending
        })
      );
      const edgeLine2 = new THREE.LineSegments(edgeGeo2, edgeMat2);
      edgeLine2.position.copy(panelMesh2.position);
      edgeLine2.rotation.copy(panelMesh2.rotation);
      floatingPanelsGroup.add(edgeLine2);

      // 5. Distant Architectural Monoliths in Flanks for Skyline Depth
      const monolithsGroup = new THREE.Group();
      scene.add(monolithsGroup);

      const monolithConfigs = [
        { x: -44, y: 4,  z: -44, w: 9,  h: 28, d: 8, color: 0x10b981 },
        { x: -28, y: 6,  z: -48, w: 8,  h: 32, d: 7, color: 0x059669 },
        { x:  28, y: -4, z: -46, w: 8,  h: 30, d: 7, color: 0xd97706 },
        { x:  44, y: -6, z: -42, w: 9,  h: 26, d: 8, color: 0xf59e0b }
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
            opacity: 0.24,
            blending: THREE.AdditiveBlending
          })
        );
        const edges = new THREE.LineSegments(edgeGeo, edgeMat);
        edges.position.copy(mesh.position);
        monolithsGroup.add(edges);
      });

      // 6. Floating Engineering & Algorithmic Artifacts Spanning the Full Section Height
      const artifactsGroup = new THREE.Group();
      scene.add(artifactsGroup);

      // --- UPPER AREA (Behind GitHub Content): Git Commit Cluster (Emerald) ---
      const gitNodeGeo = track(new THREE.IcosahedronGeometry(2.8, 0));
      const gitNodeMat = track(
        new THREE.MeshBasicMaterial({
          color: 0x10b981,
          wireframe: true,
          transparent: true,
          opacity: 0.22,
          blending: THREE.AdditiveBlending
        })
      );
      const gitNodeMesh = new THREE.Mesh(gitNodeGeo, gitNodeMat);
      gitNodeMesh.position.set(-20, 10, -15);
      artifactsGroup.add(gitNodeMesh);

      const gitNodeInnerMat = track(
        new THREE.MeshBasicMaterial({
          color: 0x10b981,
          transparent: true,
          opacity: 0.04,
          blending: THREE.AdditiveBlending
        })
      );
      const gitNodeInner = new THREE.Mesh(gitNodeGeo, gitNodeInnerMat);
      gitNodeMesh.add(gitNodeInner);

      // Secondary Upper Node: Branch tip
      const branchGeo = track(new THREE.TetrahedronGeometry(1.8, 0));
      const branchMat = track(
        new THREE.MeshBasicMaterial({
          color: 0x34d399,
          wireframe: true,
          transparent: true,
          opacity: 0.18,
          blending: THREE.AdditiveBlending
        })
      );
      const branchMesh = new THREE.Mesh(branchGeo, branchMat);
      branchMesh.position.set(-14, 5, -12);
      artifactsGroup.add(branchMesh);

      // DAG Edge connector line
      const dagEdgeGeo = track(
        new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(-20, 10, -15),
          new THREE.Vector3(-14, 5, -12)
        ])
      );
      const dagEdgeMat = track(
        new THREE.LineBasicMaterial({
          color: 0x10b981,
          transparent: true,
          opacity: 0.28,
          blending: THREE.AdditiveBlending
        })
      );
      const dagEdgeLine = new THREE.Line(dagEdgeGeo, dagEdgeMat);
      artifactsGroup.add(dagEdgeLine);

      // --- MIDDLE TRANSITION AREA: Geometric Bridge ---
      const midNodeGeo = track(new THREE.DodecahedronGeometry(2.0, 0));
      const midNodeMat = track(
        new THREE.MeshBasicMaterial({
          color: 0x059669,
          wireframe: true,
          transparent: true,
          opacity: 0.14,
          blending: THREE.AdditiveBlending
        })
      );
      const midNodeMesh = new THREE.Mesh(midNodeGeo, midNodeMat);
      midNodeMesh.position.set(0, 0, -18);
      artifactsGroup.add(midNodeMesh);

      // --- LOWER AREA (Behind LeetCode Content): Algorithmic Knowledge Prism (Amber) ---
      const lcNodeGeo = track(new THREE.OctahedronGeometry(3.0, 0));
      const lcNodeMat = track(
        new THREE.MeshBasicMaterial({
          color: 0xf59e0b,
          wireframe: true,
          transparent: true,
          opacity: 0.22,
          blending: THREE.AdditiveBlending
        })
      );
      const lcNodeMesh = new THREE.Mesh(lcNodeGeo, lcNodeMat);
      lcNodeMesh.position.set(20, -9, -15);
      artifactsGroup.add(lcNodeMesh);

      const lcNodeInnerMat = track(
        new THREE.MeshBasicMaterial({
          color: 0xf59e0b,
          transparent: true,
          opacity: 0.04,
          blending: THREE.AdditiveBlending
        })
      );
      const lcNodeInner = new THREE.Mesh(lcNodeGeo, lcNodeInnerMat);
      lcNodeMesh.add(lcNodeInner);

      // Secondary Lower Node: Optimization Diamond
      const diamondGeo = track(new THREE.TetrahedronGeometry(2.0, 0));
      const diamondMat = track(
        new THREE.MeshBasicMaterial({
          color: 0xfbbf24,
          wireframe: true,
          transparent: true,
          opacity: 0.16,
          blending: THREE.AdditiveBlending
        })
      );
      const diamondMesh = new THREE.Mesh(diamondGeo, diamondMat);
      diamondMesh.position.set(14, -15, -13);
      artifactsGroup.add(diamondMesh);

      // 7. Dual-Tone Atmospheric Stardust Particles Across Full Height
      const particleHalf = 28;
      const pPosEmerald = new Float32Array(particleHalf * 3);
      const pPosAmber = new Float32Array(particleHalf * 3);

      for (let i = 0; i < particleHalf; i++) {
        const side = i % 2 === 0 ? -1 : 1;
        pPosEmerald[i * 3] = side * (18 + Math.random() * 24);
        pPosEmerald[i * 3 + 1] = (Math.random() - 0.5) * 52;
        pPosEmerald[i * 3 + 2] = (Math.random() - 0.5) * 30 - 8;

        pPosAmber[i * 3] = -side * (18 + Math.random() * 24);
        pPosAmber[i * 3 + 1] = (Math.random() - 0.5) * 52;
        pPosAmber[i * 3 + 2] = (Math.random() - 0.5) * 30 - 8;
      }

      const geoEmerald = track(new THREE.BufferGeometry());
      geoEmerald.setAttribute('position', new THREE.BufferAttribute(pPosEmerald, 3));
      const matEmerald = track(
        new THREE.PointsMaterial({
          color: 0x34d399,
          size: 1.2,
          transparent: true,
          opacity: 0.35,
          blending: THREE.AdditiveBlending
        })
      );
      const particlesEmerald = new THREE.Points(geoEmerald, matEmerald);
      scene.add(particlesEmerald);

      const geoAmber = track(new THREE.BufferGeometry());
      geoAmber.setAttribute('position', new THREE.BufferAttribute(pPosAmber, 3));
      const matAmber = track(
        new THREE.PointsMaterial({
          color: 0xfbbf24,
          size: 1.2,
          transparent: true,
          opacity: 0.30,
          blending: THREE.AdditiveBlending
        })
      );
      const particlesAmber = new THREE.Points(geoAmber, matAmber);
      scene.add(particlesAmber);

      // 8. Responsive Resize
      const handleResize = () => {
        if (!container || !renderer) return;
        const w = container.clientWidth || window.innerWidth;
        const h = Math.min(container.clientHeight || 900, 960);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h, false);
      };
      window.addEventListener('resize', handleResize);

      // 9. Interactive Mouse Parallax (window-normalized without layout reflows)
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
        targetX = normX * 1.4;
        targetY = normY * 0.8;
      };
      window.addEventListener('mousemove', handleMouseMove, { passive: true });

      // 10. Intersection Observer for Pause
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

      // 11. Document Visibility Change (Zero CPU/GPU usage when tab is hidden)
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

      // 12. Animation Loop
      const startTime = performance.now();

      const animate = () => {
        if (!isVisible || document.hidden) {
          animationFrameId = null;
          return;
        }

        animationFrameId = requestAnimationFrame(animate);

        const elapsedTime = (performance.now() - startTime) * 0.001;

        if (!prefersReducedMotion) {
          mouseX += (targetX - mouseX) * 0.04;
          mouseY += (targetY - mouseY) * 0.04;

          camera.position.x = mouseX * 2.0;
          camera.position.y = mouseY * 1.2;
          camera.lookAt(0, 0, 0);

          // Upper GitHub Node rotation & oscillation
          gitNodeMesh.rotation.x = elapsedTime * 0.12;
          gitNodeMesh.rotation.y = elapsedTime * 0.15;
          gitNodeMesh.position.y = 10 + Math.sin(elapsedTime * 0.8) * 0.35;

          branchMesh.rotation.y = elapsedTime * 0.16;
          branchMesh.position.y = 5 + Math.cos(elapsedTime * 0.7) * 0.3;

          // Middle Bridge Node rotation
          midNodeMesh.rotation.x = elapsedTime * 0.08;
          midNodeMesh.rotation.z = elapsedTime * 0.09;

          // Lower LeetCode Node rotation & oscillation
          lcNodeMesh.rotation.x = elapsedTime * -0.13;
          lcNodeMesh.rotation.y = elapsedTime * 0.11;
          lcNodeMesh.position.y = -9 + Math.cos(elapsedTime * 0.75) * 0.35;

          diamondMesh.rotation.y = elapsedTime * 0.15;
          diamondMesh.position.y = -15 + Math.sin(elapsedTime * 0.65) * 0.3;

          // Subtle floating panel sway
          floatingPanelsGroup.rotation.y = Math.sin(elapsedTime * 0.15) * 0.02;

          // Dual-tone particle drift
          particlesEmerald.rotation.y = elapsedTime * 0.012;
          particlesAmber.rotation.y = elapsedTime * -0.010;
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
      console.warn('ActivityCanvas3D safely encountered an error and was isolated:', err);
    }

    return () => cleanupFn();
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="activity-3d-canvas-container" 
      aria-hidden="true" 
    />
  );
};

export default ActivityCanvas3D;
