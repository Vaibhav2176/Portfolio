import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * LoadingCanvas3D
 * Flagship 3D geometric centerpiece for the portfolio loading experience.
 * 
 * Features:
 * - Central Software Engineering & Interconnected Quantum Systems Core:
 *   - Translucent inner geodesic facet core (Icosahedron in deep midnight-blue)
 *   - Outer high-precision cyan wireframe lattice (#38bdf8) with additive glow
 *   - Concentric counter-rotating inner octahedron matrix (#60a5fa)
 *   - Interconnected vertex data nodes placed on polyhedral junctions
 * - Dual tilted concentric orbital rings (#38bdf8 and #3b82f6)
 * - Trailing signal satellites revolving along orbital trajectories
 * - Receding perspective ground plane grid fading into deep midnight fog (#040711)
 * - Sparse floating stardust particles drifting in spatial depth
 * - Interactive mouse parallax with smooth damping
 * - Coordinated entrance and exit transitions via `isExiting` prop
 * - Strict performance & memory safeguards (DPR capped at 1.2, full Three.js resource disposal on unmount)
 */
const LoadingCanvas3D = ({ 
  isExiting = false, 
  handoffPhase = 'idle',
  isPortraitOnRight = true,
  onReady = null 
}) => {
  const containerRef = useRef(null);
  const exitRef = useRef(isExiting);
  const phaseRef = useRef(handoffPhase);
  const portraitRightRef = useRef(isPortraitOnRight);

  useEffect(() => {
    exitRef.current = isExiting;
    phaseRef.current = handoffPhase;
    portraitRightRef.current = isPortraitOnRight;
  }, [isExiting, handoffPhase, isPortraitOnRight]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let cleanupFn = () => {};

    try {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      // WebGL availability check
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

      if (!isWebGLAvailable) {
        if (onReady) onReady();
        return;
      }

      const disposables = [];
      const track = (resource) => {
        if (resource) disposables.push(resource);
        return resource;
      };

      // 1. Scene & Atmospheric Fog (#040711)
      const scene = new THREE.Scene();
      scene.fog = new THREE.FogExp2(0x040711, 0.018);

      const width = container.clientWidth || window.innerWidth || 800;
      const height = container.clientHeight || window.innerHeight || 600;

      const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
      const isMobileInit = width < 640;
      const isTabletInit = width >= 640 && width < 1024;
      camera.position.set(0, 0, isMobileInit ? 30 : (isTabletInit ? 28 : 26));

      let renderer;
      try {
        renderer = new THREE.WebGLRenderer({
          alpha: true,
          antialias: true,
          powerPreference: 'high-performance'
        });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.25));
        renderer.setSize(width, height, false);
        renderer.domElement.style.width = '100%';
        renderer.domElement.style.height = '100%';
        renderer.domElement.style.position = 'absolute';
        renderer.domElement.style.inset = '0';
        renderer.setClearColor(0x000000, 0);
        container.appendChild(renderer.domElement);
      } catch (err) {
        console.warn('LoadingCanvas3D renderer init bypassed:', err);
        if (onReady) onReady();
        return;
      }

      // 2. Spatial Dual-Tone Lighting (Full-screen ambient environment)
      const ambientLight = track(new THREE.AmbientLight(0x0a1428, 3.2));
      scene.add(ambientLight);

      // Cyan key light
      const cyanLight = track(new THREE.PointLight(0x38bdf8, 4.8, 110));
      cyanLight.position.set(-20, 16, 20);
      scene.add(cyanLight);

      // Royal blue fill light
      const blueLight = track(new THREE.PointLight(0x3b82f6, 4.0, 110));
      blueLight.position.set(20, -14, 16);
      scene.add(blueLight);

      // Emerald subtle accent light
      const emeraldLight = track(new THREE.PointLight(0x10b981, 2.0, 80));
      emeraldLight.position.set(0, 12, 12);
      scene.add(emeraldLight);

      // 3. Central Geometric Composition Group (Balanced scale: supporting visual for VAIBHAV. branding)
      const coreGroup = new THREE.Group();
      coreGroup.position.set(0, isMobileInit ? 3.0 : (isTabletInit ? 3.3 : 3.6), 0);
      camera.lookAt(0, coreGroup.position.y * 0.35, 0);
      scene.add(coreGroup);

      // A. Translucent Inner Facet Core (Icosahedron - balanced 2.5 radius)
      const innerCoreGeo = track(new THREE.IcosahedronGeometry(2.5, 0));
      const innerCoreMat = track(new THREE.MeshBasicMaterial({
        color: 0x0c2044,
        transparent: true,
        opacity: 0.38,
        wireframe: false
      }));
      const innerCoreMesh = track(new THREE.Mesh(innerCoreGeo, innerCoreMat));
      coreGroup.add(innerCoreMesh);

      // B. Outer Electric Cyan Wireframe Lattice (radius 2.5)
      const wireMat = track(new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        wireframe: true,
        transparent: true,
        opacity: 0.72,
        blending: THREE.AdditiveBlending
      }));
      const wireMesh = track(new THREE.Mesh(innerCoreGeo, wireMat));
      coreGroup.add(wireMesh);

      // C. Concentric Inner Octahedron Matrix (Counter-rotating, 1.45 radius)
      const octGeo = track(new THREE.OctahedronGeometry(1.45, 0));
      const octMat = track(new THREE.MeshBasicMaterial({
        color: 0x60a5fa,
        wireframe: true,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending
      }));
      const octMesh = track(new THREE.Mesh(octGeo, octMat));
      coreGroup.add(octMesh);

      // D. Interconnected Vertex Transmission Nodes
      const nodeGeo = track(new THREE.SphereGeometry(0.08, 8, 8));
      const nodeMatCyan = track(new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        blending: THREE.AdditiveBlending
      }));
      const nodeMatEmerald = track(new THREE.MeshBasicMaterial({
        color: 0x34d399,
        blending: THREE.AdditiveBlending
      }));

      // Extract unique vertices from icosahedron
      const posAttr = innerCoreGeo.attributes.position;
      const vertexSet = [];
      for (let i = 0; i < posAttr.count; i++) {
        const v = new THREE.Vector3(posAttr.getX(i), posAttr.getY(i), posAttr.getZ(i));
        if (!vertexSet.some(existing => existing.distanceTo(v) < 0.12)) {
          vertexSet.push(v);
        }
      }

      const nodeMeshes = [];
      const nodeSurgeScales = new Float32Array(vertexSet.length).fill(1.0);

      vertexSet.forEach((vert, idx) => {
        const mat = idx % 4 === 0 ? nodeMatEmerald : nodeMatCyan;
        const node = track(new THREE.Mesh(nodeGeo, mat));
        node.position.copy(vert);
        coreGroup.add(node);
        nodeMeshes.push(node);
      });

      // Construct edge connectivity graph
      const neighbors = Array.from({ length: vertexSet.length }, () => []);
      for (let i = 0; i < vertexSet.length; i++) {
        for (let j = i + 1; j < vertexSet.length; j++) {
          const d = vertexSet[i].distanceTo(vertexSet[j]);
          // Standard icosahedron edge length with radius 2.5 is ~2.63
          if (Math.abs(d - 2.63) < 0.35) {
            neighbors[i].push(j);
            neighbors[j].push(i);
          }
        }
      }

      // Precompute two distinctive connected transmission pathways across wireframe edges
      const path1 = [0];
      let curr = 0;
      for (let step = 0; step < 4; step++) {
        const nbrs = neighbors[curr].filter(n => !path1.includes(n));
        const next = nbrs.length > 0 ? nbrs[0] : (neighbors[curr][0] || 0);
        path1.push(next);
        curr = next;
      }

      const path2 = [vertexSet.length - 1];
      curr = vertexSet.length - 1;
      for (let step = 0; step < 4; step++) {
        const nbrs = neighbors[curr].filter(n => !path2.includes(n));
        const next = nbrs.length > 0 ? nbrs[0] : (neighbors[curr][0] || 0);
        path2.push(next);
        curr = next;
      }

      // SIGNATURE WOW EFFECT: Travelling Cyan Light Signal (Pulse Head & Edge Beam)
      const pulseHeadGeo = track(new THREE.SphereGeometry(0.13, 10, 10));
      const pulseHeadMat = track(new THREE.MeshBasicMaterial({
        color: 0xe0f2fe, // Luminous bright cyan-white
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending
      }));
      const pulseHead = track(new THREE.Mesh(pulseHeadGeo, pulseHeadMat));
      coreGroup.add(pulseHead);

      const beamPositions = new Float32Array(6);
      const beamGeo = track(new THREE.BufferGeometry());
      beamGeo.setAttribute('position', new THREE.BufferAttribute(beamPositions, 3));
      const beamMat = track(new THREE.LineBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending
      }));
      const pulseBeam = track(new THREE.Line(beamGeo, beamMat));
      coreGroup.add(pulseBeam);

      // E. Primary Orbital Ring (Cyan, balanced 4.3 radius)
      const ring1Geo = track(new THREE.TorusGeometry(4.3, 0.035, 16, 72));
      const ring1Mat = track(new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.62,
        blending: THREE.AdditiveBlending
      }));
      const ring1Mesh = track(new THREE.Mesh(ring1Geo, ring1Mat));
      ring1Mesh.rotation.x = Math.PI / 3.2;
      ring1Mesh.rotation.y = Math.PI / 7;
      coreGroup.add(ring1Mesh);

      // F. Secondary Orbital Ring (Blue, balanced 5.6 radius)
      const ring2Geo = track(new THREE.TorusGeometry(5.6, 0.030, 16, 72));
      const ring2Mat = track(new THREE.MeshBasicMaterial({
        color: 0x3b82f6,
        transparent: true,
        opacity: 0.50,
        blending: THREE.AdditiveBlending
      }));
      const ring2Mesh = track(new THREE.Mesh(ring2Geo, ring2Mat));
      ring2Mesh.rotation.x = -Math.PI / 3.8;
      ring2Mesh.rotation.z = Math.PI / 5;
      coreGroup.add(ring2Mesh);

      // G. Trailing Satellites / Data Signals
      const satGeo = track(new THREE.SphereGeometry(0.16, 10, 10));
      const sat1 = track(new THREE.Mesh(satGeo, nodeMatCyan));
      coreGroup.add(sat1);

      const sat2 = track(new THREE.Mesh(satGeo, nodeMatEmerald));
      coreGroup.add(sat2);

      // 4. Receding Perspective Ground Grid (Spanning full screen)
      const gridHelper = track(new THREE.GridHelper(180, 36, 0x38bdf8, 0x1e3a8a));
      gridHelper.position.set(0, -9.5, -6);
      gridHelper.rotation.x = 0.16;
      if (gridHelper.material) {
        gridHelper.material.transparent = true;
        gridHelper.material.opacity = 0.30;
        gridHelper.material.blending = THREE.AdditiveBlending;
      }
      scene.add(gridHelper);

      // 5. Dual-Tone Ambient Stardust Particles (Spanning full wide screen)
      const particleCount = 140;
      const pPositionsCyan = new Float32Array(particleCount * 3);
      const pPositionsBlue = new Float32Array(particleCount * 3);

      for (let i = 0; i < particleCount * 3; i += 3) {
        pPositionsCyan[i] = (Math.random() - 0.5) * 85;
        pPositionsCyan[i + 1] = (Math.random() - 0.5) * 55;
        pPositionsCyan[i + 2] = (Math.random() - 0.5) * 30 - 4;

        pPositionsBlue[i] = (Math.random() - 0.5) * 85;
        pPositionsBlue[i + 1] = (Math.random() - 0.5) * 55;
        pPositionsBlue[i + 2] = (Math.random() - 0.5) * 30 - 4;
      }

      const pGeoCyan = track(new THREE.BufferGeometry());
      pGeoCyan.setAttribute('position', new THREE.BufferAttribute(pPositionsCyan, 3));
      const pMatCyan = track(new THREE.PointsMaterial({
        size: 0.18,
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.65,
        blending: THREE.AdditiveBlending
      }));
      const particlesCyan = track(new THREE.Points(pGeoCyan, pMatCyan));
      scene.add(particlesCyan);

      const pGeoBlue = track(new THREE.BufferGeometry());
      pGeoBlue.setAttribute('position', new THREE.BufferAttribute(pPositionsBlue, 3));
      const pMatBlue = track(new THREE.PointsMaterial({
        size: 0.20,
        color: 0x3b82f6,
        transparent: true,
        opacity: 0.50,
        blending: THREE.AdditiveBlending
      }));
      const particlesBlue = track(new THREE.Points(pGeoBlue, pMatBlue));
      scene.add(particlesBlue);

      // 6. Interactive Parallax & Animation Loop State
      let mouseX = 0;
      let mouseY = 0;
      let targetX = 0;
      let targetY = 0;
      let animationFrameId = null;
      let lastTime = performance.now();
      let elapsedTime = 0;
      let entranceProgress = prefersReducedMotion ? 1.0 : 0.0;
      let exitProgress = 0.0;

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
        const newW = container.clientWidth || window.innerWidth || 800;
        const newH = container.clientHeight || window.innerHeight || 600;
        camera.aspect = newW / newH;
        camera.updateProjectionMatrix();
        renderer.setSize(newW, newH, false);

        const isMobile = newW < 640;
        const isTablet = newW >= 640 && newW < 1024;
        camera.position.z = isMobile ? 30 : (isTablet ? 28 : 26);
        coreGroup.position.y = isMobile ? 3.0 : (isTablet ? 3.3 : 3.6);
      };
      window.addEventListener('resize', handleResize, { passive: true });

      // Signal ready
      if (onReady) onReady();

      // 7. Animation Loop
      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);

        const now = performance.now();
        const delta = Math.min((now - lastTime) / 1000, 0.1);
        lastTime = now;
        elapsedTime += delta;

        // Stage A: Progressive System Awakening (0s -> 0.8s)
        if (entranceProgress < 1.0) {
          entranceProgress = Math.min(entranceProgress + delta * 1.8, 1.0);
          const eased = 1.0 - Math.pow(1.0 - entranceProgress, 3);
          coreGroup.scale.setScalar(0.7 + eased * 0.3);

          // Grid and particles gradually emerge from deep midnight space
          if (gridHelper.material) {
            gridHelper.material.opacity = eased * 0.30;
          }
          pMatCyan.opacity = eased * 0.65;
          pMatBlue.opacity = eased * 0.50;
        }

        // Ambient spatial light breathing and drift over time
        cyanLight.position.x = -20 + Math.sin(elapsedTime * 0.7) * 3;
        cyanLight.position.y = 16 + Math.cos(elapsedTime * 0.5) * 2.5;
        cyanLight.intensity = 4.8 + Math.sin(elapsedTime * 1.2) * 0.4;

        blueLight.position.x = 20 - Math.sin(elapsedTime * 0.6) * 3;
        blueLight.position.y = -14 + Math.cos(elapsedTime * 0.8) * 2.5;
        blueLight.intensity = 4.0 + Math.cos(elapsedTime * 1.1) * 0.3;

        // SIGNATURE WOW EFFECT: Intermittent Travelling Cyan Pulse
        // Wave 1: 0.8s - 1.8s (Stage B: Geometric Synchronization)
        // Wave 2: 2.0s - 3.0s (Stage C: Identity Reveal)
        let activePath = null;
        let pathProgress = 0;
        let isWaveActive = false;

        if (elapsedTime >= 0.8 && elapsedTime < 1.8) {
          activePath = path1;
          pathProgress = (elapsedTime - 0.8) / 1.0;
          isWaveActive = true;
        } else if (elapsedTime >= 2.0 && elapsedTime < 3.0) {
          activePath = path2;
          pathProgress = (elapsedTime - 2.0) / 1.0;
          isWaveActive = true;
        }

        if (isWaveActive && activePath && activePath.length > 1 && !exitRef.current) {
          const waveEnvelope = Math.sin(pathProgress * Math.PI);
          pulseHeadMat.opacity = waveEnvelope * 0.95;
          beamMat.opacity = waveEnvelope * 0.85;

          const numSegments = activePath.length - 1;
          const globalSeg = pathProgress * numSegments;
          const segIndex = Math.min(Math.floor(globalSeg), numSegments - 1);
          const segFrac = globalSeg - segIndex;

          const idxA = activePath[segIndex];
          const idxB = activePath[segIndex + 1];
          const vA = vertexSet[idxA];
          const vB = vertexSet[idxB];

          if (vA && vB) {
            const curX = vA.x + (vB.x - vA.x) * segFrac;
            const curY = vA.y + (vB.y - vA.y) * segFrac;
            const curZ = vA.z + (vB.z - vA.z) * segFrac;

            pulseHead.position.set(curX, curY, curZ);

            beamPositions[0] = vA.x;
            beamPositions[1] = vA.y;
            beamPositions[2] = vA.z;
            beamPositions[3] = curX;
            beamPositions[4] = curY;
            beamPositions[5] = curZ;
            beamGeo.attributes.position.needsUpdate = true;

            // Trigger subtle node surge as pulse touches vertex
            if (segFrac < 0.20 && idxA < nodeSurgeScales.length) {
              nodeSurgeScales[idxA] = 1.7;
            }
          }
        } else {
          pulseHeadMat.opacity = 0;
          beamMat.opacity = 0;
        }

        // Dampen vertex node scale surges back to resting state
        for (let i = 0; i < nodeMeshes.length; i++) {
          if (nodeSurgeScales[i] > 1.0) {
            nodeSurgeScales[i] += (1.0 - nodeSurgeScales[i]) * 0.12;
            nodeMeshes[i].scale.setScalar(nodeSurgeScales[i]);
          } else {
            nodeMeshes[i].scale.setScalar(1.0);
          }
        }

        // Dynamic Geometric-to-Portrait Transformation during Handoff
        const currentPhase = phaseRef.current;
        const targetIsRight = portraitRightRef.current;

        if (currentPhase === 'resting') {
          // Phase A: Final, subtle cyan energy pulse
          wireMat.opacity = THREE.MathUtils.lerp(wireMat.opacity, 0.98, delta * 8.0);
          ring1Mat.opacity = THREE.MathUtils.lerp(ring1Mat.opacity, 0.88, delta * 8.0);
          cyanLight.intensity = THREE.MathUtils.lerp(cyanLight.intensity, 7.5, delta * 8.0);
          pulseHeadMat.opacity = 0;
          beamMat.opacity = 0;
          for (let i = 0; i < nodeMeshes.length; i++) {
            nodeSurgeScales[i] = 1.6;
          }
        } else if (currentPhase === 'enlarging') {
          // Phase B: 3D rotation, tilt, and pitch toward portrait
          const targetRotY = targetIsRight ? 0.48 : -0.22;
          const targetRotZ = targetIsRight ? -0.16 : 0.18;
          const targetPosX = targetIsRight ? 2.4 : 0.0;
          const targetPosY = (isMobileInit ? 3.0 : (isTabletInit ? 3.3 : 3.6)) + (targetIsRight ? 0.3 : -0.8);

          coreGroup.rotation.y = THREE.MathUtils.lerp(coreGroup.rotation.y, targetRotY, delta * 3.8);
          coreGroup.rotation.z = THREE.MathUtils.lerp(coreGroup.rotation.z, targetRotZ, delta * 3.8);
          coreGroup.position.x = THREE.MathUtils.lerp(coreGroup.position.x, targetPosX, delta * 2.8);
          coreGroup.position.y = THREE.MathUtils.lerp(coreGroup.position.y, targetPosY, delta * 2.8);

          octMesh.rotation.y += delta * 1.8;
          ring1Mesh.rotation.z += delta * 0.45;
          ring2Mesh.rotation.z -= delta * 0.40;

          // Wireframe stays crisp and luminous during in-place enlargement
          wireMat.opacity = THREE.MathUtils.lerp(wireMat.opacity, 0.85, delta * 4.0);
          innerCoreMat.opacity = THREE.MathUtils.lerp(innerCoreMat.opacity, 0.45, delta * 4.0);
          gridHelper.material.opacity = Math.max(gridHelper.material.opacity - delta * 0.4, 0);
        } else if (currentPhase === 'traveling' || currentPhase === 'completed') {
          // Phase C: Spatial convergence & directional particle stream toward portrait
          const targetPosX = targetIsRight ? 9.8 : 0.0;
          const targetPosY = (isMobileInit ? 3.0 : (isTabletInit ? 3.3 : 3.6)) + (targetIsRight ? 1.4 : -2.6);

          coreGroup.position.x = THREE.MathUtils.lerp(coreGroup.position.x, targetPosX, delta * 3.0);
          coreGroup.position.y = THREE.MathUtils.lerp(coreGroup.position.y, targetPosY, delta * 2.6);
          coreGroup.scale.setScalar(Math.max(coreGroup.scale.x - delta * 0.9, 0.35));

          // Controlled directional particle convergence towards portrait quadrant
          particlesCyan.position.x = THREE.MathUtils.lerp(particlesCyan.position.x, targetIsRight ? 12 : 0, delta * 2.5);
          particlesCyan.position.y = THREE.MathUtils.lerp(particlesCyan.position.y, targetIsRight ? 4 : -4, delta * 2.0);

          // Graceful dissolve as energy converges into portrait frame
          wireMat.opacity = Math.max(wireMat.opacity - delta * 1.25, 0);
          innerCoreMat.opacity = Math.max(innerCoreMat.opacity - delta * 1.0, 0);
          octMat.opacity = Math.max(octMat.opacity - delta * 1.3, 0);
          ring1Mat.opacity = Math.max(ring1Mat.opacity - delta * 1.1, 0);
          ring2Mat.opacity = Math.max(ring2Mat.opacity - delta * 1.0, 0);
          gridHelper.material.opacity = Math.max(gridHelper.material.opacity - delta * 1.1, 0);
          pMatCyan.opacity = Math.max(pMatCyan.opacity - delta * 0.8, 0);
          pMatBlue.opacity = Math.max(pMatBlue.opacity - delta * 0.8, 0);
          pulseHeadMat.opacity = 0;
          beamMat.opacity = 0;
        } else if (exitRef.current) {
          exitProgress = Math.min(exitProgress + delta * 1.5, 1.0);
          const exitEased = Math.pow(exitProgress, 2);
          coreGroup.scale.setScalar(1.0 + exitEased * 0.25);
          wireMat.opacity = Math.max(0.72 * (1.0 - exitProgress), 0);
          innerCoreMat.opacity = Math.max(0.38 * (1.0 - exitProgress), 0);
          octMat.opacity = Math.max(0.85 * (1.0 - exitProgress), 0);
          ring1Mat.opacity = Math.max(0.62 * (1.0 - exitProgress), 0);
          ring2Mat.opacity = Math.max(0.50 * (1.0 - exitProgress), 0);
          gridHelper.material.opacity = Math.max(0.30 * (1.0 - exitProgress), 0);
          pulseHeadMat.opacity = 0;
          beamMat.opacity = 0;
        }

        if (!prefersReducedMotion) {
          // Smooth mouse dampening
          mouseX += (targetX - mouseX) * 0.05;
          mouseY += (targetY - mouseY) * 0.05;

          // Camera gentle tilt and parallax
          camera.position.x = mouseX * 2.2;
          camera.position.y = mouseY * 1.5;
          camera.lookAt(0, coreGroup.position.y * 0.35, 0);

          // Polyhedron rotations
          const rotSpeed = exitRef.current ? 0.35 : 0.16;
          wireMesh.rotation.x = elapsedTime * (rotSpeed * 0.8);
          wireMesh.rotation.y = elapsedTime * rotSpeed;
          innerCoreMesh.rotation.x = elapsedTime * (rotSpeed * 0.8);
          innerCoreMesh.rotation.y = elapsedTime * rotSpeed;

          // Counter-rotating inner matrix
          octMesh.rotation.x = elapsedTime * -0.28;
          octMesh.rotation.y = elapsedTime * 0.32;
          octMesh.rotation.z = elapsedTime * 0.18;

          // Orbital rings
          ring1Mesh.rotation.z = elapsedTime * 0.22;
          ring2Mesh.rotation.z = elapsedTime * -0.18;

          // Satellite orbits (proportionate to 4.3 and 5.6 radius)
          const sat1Angle = elapsedTime * 0.75;
          sat1.position.x = Math.cos(sat1Angle) * 4.3;
          sat1.position.y = Math.sin(sat1Angle) * 2.5;
          sat1.position.z = Math.sin(sat1Angle) * 3.2;

          const sat2Angle = -elapsedTime * 0.60 + Math.PI;
          sat2.position.x = Math.cos(sat2Angle) * 5.6;
          sat2.position.y = Math.sin(sat2Angle) * 3.4;
          sat2.position.z = Math.cos(sat2Angle) * 2.6;

          // Background particle drift
          particlesCyan.rotation.y = elapsedTime * 0.015;
          particlesBlue.rotation.y = elapsedTime * -0.012;
        }

        renderer.render(scene, camera);
      };

      animate();

      cleanupFn = () => {
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
        }
        window.removeEventListener('resize', handleResize);
        if (!prefersReducedMotion) {
          window.removeEventListener('mousemove', handleMouseMove);
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
      console.warn('LoadingCanvas3D encountered an error and isolated safely:', err);
      if (onReady) onReady();
    }

    return () => cleanupFn();
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="loading-3d-canvas-wrapper" 
      aria-hidden="true" 
    />
  );
};

export default LoadingCanvas3D;

