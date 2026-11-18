import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, extend, useFrame, useThree, type ThreeElement } from '@react-three/fiber';
import { Effects, OrbitControls } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { ShaderPass, UnrealBloomPass } from 'three-stdlib';
import * as THREE from 'three';
import {
  ODESSY_COL_DATA,
  ODESSY_PARTICLE_COUNT,
  ODESSY_POS_DATA,
} from '../../data/odessyParticleData';
import { useAppStore } from '../../store/useAppStore';
import { isCoarseDevice, isMobileViewport } from './frameUtils';

extend({ UnrealBloomPass, ShaderPass });

declare module '@react-three/fiber' {
  interface ThreeElements {
    unrealBloomPass: ThreeElement<typeof UnrealBloomPass>;
  }
}

const ZOOM_DURATION = 6.0; // Exact 6-second camera zoom-in (Stage 1) before Stage 2 logo morph & scroll unlock
const LOGO_GLYPH_COUNT = 17600; // Particles forming the emblem; remainder form ambient halo
const LOGO_SRC = './images/odessy-logo.png';

const COMPOSITE_BG_SHADER = {
  uniforms: {
    tDiffuse: { value: null },
    bgColor: { value: new THREE.Color('#000000') },
  },
  vertexShader: `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
  fragmentShader: `uniform sampler2D tDiffuse; uniform vec3 bgColor; varying vec2 vUv; void main() { vec4 texel = texture2D(tDiffuse, vUv); float alpha = clamp(max(texel.r, max(texel.g, texel.b)), 0.0, 1.0); gl_FragColor = vec4(texel.rgb + bgColor * (1.0 - alpha), 1.0); }`,
};

interface LogoTargetBuffers {
  logoPositions: Float32Array;
  logoColors: Float32Array;
  staggerDelays: Float32Array;
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function clamp01(v: number): number {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}

function seeded(n: number): number {
  const s = Math.sin(n * 12.9898 + 78.233) * 43758.5453;
  return s - Math.floor(s);
}

/**
 * Populates fallback ambient targets until the PNG pixel map resolves.
 */
function createInitialTargets(count: number, stride: number): LogoTargetBuffers {
  const logoPositions = new Float32Array(count * 3);
  const logoColors = new Float32Array(count * 3);
  const staggerDelays = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    const idx = i * 3;
    const srcIdx = Math.min(ODESSY_PARTICLE_COUNT - 1, i * stride) * 3;
    logoPositions[idx] = ODESSY_POS_DATA[srcIdx];
    logoPositions[idx + 1] = ODESSY_POS_DATA[srcIdx + 1];
    logoPositions[idx + 2] = ODESSY_POS_DATA[srcIdx + 2];
    logoColors[idx] = ODESSY_COL_DATA[srcIdx] / 255;
    logoColors[idx + 1] = ODESSY_COL_DATA[srcIdx + 1] / 255;
    logoColors[idx + 2] = ODESSY_COL_DATA[srcIdx + 2] / 255;
    staggerDelays[i] = seeded(i + 17) * 1.4;
  }

  return { logoPositions, logoColors, staggerDelays };
}

/**
 * Samples RGBA pixels from ./images/odessy-logo.png into normalized 3D particle coordinates
 * and exact metallic logo colors while keeping ambient dust particles cohesive.
 */
function buildTargetsFromImage(
  img: HTMLImageElement,
  count: number,
  stride: number,
  glyphCount: number
): LogoTargetBuffers {
  const logoPositions = new Float32Array(count * 3);
  const logoColors = new Float32Array(count * 3);
  const staggerDelays = new Float32Array(count);

  const width = img.naturalWidth || 752;
  const height = img.naturalHeight || 332;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return createInitialTargets(count, stride);
  }

  ctx.clearRect(0, 0, width, height);
  ctx.drawImage(img, 0, 0, width, height);
  const data = ctx.getImageData(0, 0, width, height).data;

  let minPx = width;
  let maxPx = 0;
  let minPy = height;
  let maxPy = 0;

  const sampledPixels: Array<{
    px: number;
    py: number;
    r: number;
    g: number;
    b: number;
  }> = [];

  for (let py = 0; py < height; py++) {
    for (let px = 0; px < width; px++) {
      const off = (py * width + px) * 4;
      const a = data[off + 3];
      if (a > 36) {
        if (px < minPx) minPx = px;
        if (px > maxPx) maxPx = px;
        if (py < minPy) minPy = py;
        if (py > maxPy) maxPy = py;

        sampledPixels.push({
          px,
          py,
          r: data[off] / 255,
          g: data[off + 1] / 255,
          b: data[off + 2] / 255,
        });
      }
    }
  }

  if (sampledPixels.length === 0) {
    return createInitialTargets(count, stride);
  }

  const spanX = Math.max(1, maxPx - minPx);
  const spanY = Math.max(1, maxPy - minPy);
  const worldWidth = 76;
  const worldHeight = worldWidth * (spanY / spanX);
  const halfW = worldWidth * 0.5;

  // Deterministic Fisher-Yates shuffle so all strokes fill evenly without scanline banding
  for (let i = sampledPixels.length - 1; i > 0; i--) {
    const j = Math.floor(seeded(i + 31) * (i + 1));
    const tmp = sampledPixels[i];
    sampledPixels[i] = sampledPixels[j];
    sampledPixels[j] = tmp;
  }

  for (let i = 0; i < count; i++) {
    const idx = i * 3;
    if (i < glyphCount) {
      const sample = sampledPixels[i % sampledPixels.length];
      const normX = (sample.px - minPx) / spanX - 0.5;
      const normY = 0.5 - (sample.py - minPy) / spanY;

      const jx = (seeded(i * 3 + 1) - 0.5) * 0.16;
      const jy = (seeded(i * 3 + 2) - 0.5) * 0.16;
      const jz = (seeded(i * 3 + 3) - 0.5) * 1.25;

      const wx = normX * worldWidth + jx;
      const wy = normY * worldHeight + jy;

      logoPositions[idx] = wx;
      logoPositions[idx + 1] = wy;
      logoPositions[idx + 2] = jz;

      // Primary #41D2A2 (65, 210, 162) mint-emerald with slight cool blue mixing
      const lum = clamp01(0.299 * sample.r + 0.587 * sample.g + 0.114 * sample.b);
      const blueMix = clamp01(0.22 + normX * 0.18 + Math.sin(normY * 3.5) * 0.08) * 0.38;
      const intensity = 0.48 + lum * 0.52;

      // #41D2A2 -> subtle cyan-blue (#29B6D8)
      const baseR = THREE.MathUtils.lerp(0.255, 0.16, blueMix);
      const baseG = THREE.MathUtils.lerp(0.824, 0.71, blueMix);
      const baseB = THREE.MathUtils.lerp(0.635, 0.86, blueMix);

      const highlight = Math.pow(lum, 2.2) * 0.28;
      logoColors[idx] = Math.min(1, baseR * intensity + highlight * 0.55);
      logoColors[idx + 1] = Math.min(1, baseG * intensity + highlight * 0.95);
      logoColors[idx + 2] = Math.min(1, baseB * intensity + highlight * 0.82);

      const waveProgress = clamp01((wx + halfW) / worldWidth);
      staggerDelays[i] = waveProgress * 1.35 + seeded(i + 91) * 0.25;
    } else {
      // Ambient #41D2A2 / deep sea-green stardust with slight blue accent
      const angle = seeded(i * 5 + 1) * Math.PI * 2;
      const radius = 38 + seeded(i * 5 + 2) * 44;
      const zDepth = -36 + seeded(i * 5 + 3) * 44;
      const ySpread = (seeded(i * 5 + 4) - 0.5) * 46;

      logoPositions[idx] = Math.cos(angle) * radius;
      logoPositions[idx + 1] = ySpread;
      logoPositions[idx + 2] = zDepth;

      const tintMix = seeded(i + 19);
      const depthFade = 0.38 + seeded(i + 23) * 0.42;
      logoColors[idx] = THREE.MathUtils.lerp(0.18, 0.10, tintMix * 0.35) * depthFade;
      logoColors[idx + 1] = THREE.MathUtils.lerp(0.78, 0.62, tintMix * 0.35) * depthFade;
      logoColors[idx + 2] = THREE.MathUtils.lerp(0.58, 0.74, tintMix * 0.45) * depthFade;

      staggerDelays[i] = 0.15 + seeded(i + 303) * 1.6;
    }
  }

  return { logoPositions, logoColors, staggerDelays };
}

interface ParticleSwarmProps {
  onRevealComplete: () => void;
  userInteractedRef: React.MutableRefObject<boolean>;
  controlsRef: React.RefObject<OrbitControlsImpl | null>;
  skipRequestedRef: React.MutableRefObject<boolean>;
  isMobile: boolean;
}

function ParticleSwarm({
  onRevealComplete,
  userInteractedRef,
  controlsRef,
  skipRequestedRef,
  isMobile,
}: ParticleSwarmProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const { camera } = useThree();

  const stride = isMobile ? 2 : 1;
  const count = Math.floor(ODESSY_PARTICLE_COUNT / stride);
  const glyphCount = Math.floor(LOGO_GLYPH_COUNT / stride);

  // Pre-allocated scratch helpers (zero per-frame GC inside useFrame)
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const targetVec = useMemo(() => new THREE.Vector3(), []);
  const logoVec = useMemo(() => new THREE.Vector3(), []);
  const pColor = useMemo(() => new THREE.Color(), []);
  const targetColor = useMemo(() => new THREE.Color(), []);
  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), []);
  const mouse3D = useMemo(() => new THREE.Vector3(), []);
  const dirVec = useMemo(() => new THREE.Vector3(), []);

  const currentPositions = useMemo(() => new Float32Array(count * 3), [count]);
  const logoTargetsRef = useRef<LogoTargetBuffers>(createInitialTargets(count, stride));
  const pointerNdcRef = useRef(new THREE.Vector2(9999, 9999));

  // Track pointer globally on window so particles repel at cursor or active touch
  useEffect(() => {
    const updateNdc = (e: PointerEvent) => {
      pointerNdcRef.current.set(
        (e.clientX / window.innerWidth) * 2 - 1,
        -(e.clientY / window.innerHeight) * 2 + 1
      );
    };
    const handlePointerMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch' && isCoarseDevice()) {
        updateNdc(e);
        return;
      }
      updateNdc(e);
    };
    const handlePointerDown = (e: PointerEvent) => {
      updateNdc(e);
    };
    const handlePointerUpOrCancel = (e: PointerEvent) => {
      if (e.pointerType === 'touch') {
        pointerNdcRef.current.set(9999, 9999);
      }
    };
    const handlePointerLeave = () => {
      pointerNdcRef.current.set(9999, 9999);
    };

    window.addEventListener('pointerdown', handlePointerDown, { passive: true });
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerup', handlePointerUpOrCancel, { passive: true });
    window.addEventListener('pointercancel', handlePointerUpOrCancel, { passive: true });
    window.addEventListener('pointerleave', handlePointerLeave);
    return () => {
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUpOrCancel);
      window.removeEventListener('pointercancel', handlePointerUpOrCancel);
      window.removeEventListener('pointerleave', handlePointerLeave);
    };
  }, []);

  // Load the logo PNG and extract pixel positions & colors
  useEffect(() => {
    let active = true;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      if (!active) return;
      logoTargetsRef.current = buildTargetsFromImage(img, count, stride, glyphCount);
    };
    img.src = LOGO_SRC;

    return () => {
      active = false;
    };
  }, [count, stride, glyphCount]);

  const material = useMemo(() => {
    return new THREE.MeshBasicMaterial({ color: 0xffffff });
  }, []);

  const geometry = useMemo(() => {
    const geo = new THREE.TetrahedronGeometry(isMobile ? 0.34 : 0.25).clone();
    const w = Math.ceil(Math.sqrt(count));
    const h = w;
    const references = new Float32Array(count * 2);
    for (let i = 0; i < count; i++) {
      references[i * 2] = ((i % w) + 0.5) / w;
      references[i * 2 + 1] = (Math.floor(i / w) + 0.5) / h;
    }
    geo.setAttribute('reference', new THREE.InstancedBufferAttribute(references, 2));
    return geo;
  }, [count, isMobile]);

  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material]);

  const elapsedRef = useRef(0);
  const revealedTriggeredRef = useRef(false);

  // Initialize dispersed starting coordinates & far zoom camera once on mount
  useEffect(() => {
    elapsedRef.current = 0;
    revealedTriggeredRef.current = false;
    userInteractedRef.current = false;

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      currentPositions[idx] = (Math.random() - 0.5) * 140;
      currentPositions[idx + 1] = (Math.random() - 0.5) * 100;
      currentPositions[idx + 2] = (Math.random() - 0.5) * 160;
    }

    camera.position.set(0, 8, 250);
    camera.lookAt(0, 0, 0);
    if (controlsRef.current) {
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
  }, [count, currentPositions, camera, controlsRef, userInteractedRef]);

  useFrame((state, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;

    const { isHolding } = useAppStore.getState();
    const speedMultiplier = isHolding ? 2.2 : 1.0;

    if (skipRequestedRef.current && elapsedRef.current < ZOOM_DURATION) {
      elapsedRef.current = ZOOM_DURATION;
      skipRequestedRef.current = false;
    }

    const dt = Math.min(delta, 0.05) * speedMultiplier;
    elapsedRef.current += dt;
    const elapsed = elapsedRef.current;

    const zoomProgress = clamp01(elapsed / ZOOM_DURATION);
    const revealElapsed = Math.max(0, elapsed - ZOOM_DURATION);

    // Trigger Stage 2 right after the 6-second zoom completes (or on tap skip)
    if (elapsed >= ZOOM_DURATION && !revealedTriggeredRef.current) {
      revealedTriggeredRef.current = true;
      onRevealComplete();
    }

    // Continuous X & Z axis cinematic rotation loop (active during and after animation)
    const rotRamp = easeInOutCubic(clamp01(elapsed / 2.2));
    mesh.rotation.x =
      rotRamp * (Math.sin(elapsed * 0.42) * 0.32 + Math.sin(elapsed * 0.21) * 0.1);
    mesh.rotation.z =
      rotRamp * (Math.cos(elapsed * 0.31) * 0.16 + Math.sin(elapsed * 0.16) * 0.06);
    mesh.updateMatrixWorld();

    // Scale camera distance cleanly on portrait aspect ratios so the 76-unit emblem fits uncropped
    const aspect = camera instanceof THREE.PerspectiveCamera ? camera.aspect : 1;
    const portraitScale = aspect < 1.15 ? Math.min(2.35, 1.15 / Math.max(aspect, 0.42)) : 1;
    const targetZ = 68 * portraitScale;
    const startZ = 250 * (aspect < 1.15 ? Math.min(1.65, portraitScale * 0.78) : 1);
    const swayScale = 1 / Math.max(1, portraitScale * 0.85);

    // Smooth 6-second zoom-in + seamless post-reveal XZ cinematic camera loop
    if (!userInteractedRef.current) {
      if (elapsed <= ZOOM_DURATION) {
        const eased = easeInOutCubic(zoomProgress);
        const camZ = THREE.MathUtils.lerp(startZ, targetZ, eased);
        const camY = THREE.MathUtils.lerp(8, 0, eased);
        const camX = Math.sin(zoomProgress * Math.PI) * 14 * swayScale;
        camera.position.set(camX, camY, camZ);
        camera.lookAt(0, 0, 0);
        if (controlsRef.current) {
          controlsRef.current.target.set(0, 0, 0);
        }
      } else {
        const loopT = elapsed - ZOOM_DURATION;
        const camX = Math.sin(loopT * 0.35) * 18 * swayScale;
        const camY = Math.sin(loopT * 0.25) * 5;
        const camZ = targetZ - (1 - Math.cos(loopT * 0.35)) * 7;
        camera.position.set(camX, camY, camZ);
        camera.lookAt(0, 0, 0);
        if (controlsRef.current) {
          controlsRef.current.target.set(0, 0, 0);
        }
      }
    }

    // Mouse 3D projection aligned to rotated mesh plane (repel-only mode)
    let hasMouseHit = false;
    if (pointerNdcRef.current.x <= 1 && pointerNdcRef.current.x >= -1) {
      plane.normal.set(0, 0, 1).applyQuaternion(mesh.quaternion);
      plane.constant = 0;
      state.raycaster.setFromCamera(pointerNdcRef.current, state.camera);
      const hit = state.raycaster.ray.intersectPlane(plane, mouse3D);
      if (hit) {
        mesh.worldToLocal(mouse3D);
        hasMouseHit = true;
      }
    }

    const { logoPositions, logoColors, staggerDelays } = logoTargetsRef.current;
    const mouseInfluenceRadius = 5.2;
    const lerpSpeed = elapsed < 1.5 ? 0.08 : 0.12;

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      const srcIdx = Math.min(ODESSY_PARTICLE_COUNT - 1, i * stride) * 3;
      const sx = ODESSY_POS_DATA[srcIdx];
      const sy = ODESSY_POS_DATA[srcIdx + 1];
      const sz = ODESSY_POS_DATA[srcIdx + 2];

      const sr = ODESSY_COL_DATA[srcIdx] / 255;
      const sg = ODESSY_COL_DATA[srcIdx + 1] / 255;
      const sb = ODESSY_COL_DATA[srcIdx + 2] / 255;

      const zoomWaveZ = Math.sin(elapsed * 1.4 + i * 0.015) * (1 - zoomProgress * 0.5) * 0.6;
      targetVec.set(sx, sy, sz + zoomWaveZ);
      pColor.setRGB(sr, sg, sb);

      // Stage 2: After 6.0s zoom-in finishes, morph particles into the logo emblem with its colors
      if (revealElapsed > 0) {
        const localMorph = clamp01((revealElapsed - staggerDelays[i]) / 1.15);
        if (localMorph > 0) {
          const easedMorph = easeInOutCubic(localMorph);
          const arcLift = Math.sin(easedMorph * Math.PI) * 6.5 * (i % 2 === 0 ? 1 : -1);
          const idleFloat =
            localMorph >= 1 ? Math.sin(elapsed * 1.6 + i * 0.02) * 0.12 : 0;

          logoVec.set(
            logoPositions[idx],
            logoPositions[idx + 1] + idleFloat,
            logoPositions[idx + 2] + arcLift
          );
          targetVec.lerp(logoVec, easedMorph);

          targetColor.setRGB(
            logoColors[idx],
            logoColors[idx + 1],
            logoColors[idx + 2]
          );
          pColor.lerp(targetColor, easedMorph);
        }
      }

      // Pointer repel force field
      if (hasMouseHit) {
        const d = targetVec.distanceTo(mouse3D);
        if (d < mouseInfluenceRadius) {
          const falloff = (mouseInfluenceRadius - d) / mouseInfluenceRadius;
          dirVec.copy(targetVec).sub(mouse3D).normalize();
          const strength = falloff * falloff * 5.5;
          targetVec.addScaledVector(dirVec, strength);
          targetVec.z += falloff * 2.0;
        }
      }

      const cx = currentPositions[idx] + (targetVec.x - currentPositions[idx]) * lerpSpeed;
      const cy = currentPositions[idx + 1] + (targetVec.y - currentPositions[idx + 1]) * lerpSpeed;
      const cz = currentPositions[idx + 2] + (targetVec.z - currentPositions[idx + 2]) * lerpSpeed;

      currentPositions[idx] = cx;
      currentPositions[idx + 1] = cy;
      currentPositions[idx + 2] = cz;

      dummy.position.set(cx, cy, cz);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
      mesh.setColorAt(i, pColor);
    }

    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[geometry, material, count]}
      frustumCulled={false}
    />
  );
}

export function OdysseyCanvas() {
  const setOdysseyStage2 = useAppStore((state) => state.setOdysseyStage2);
  const odysseyStage2 = useAppStore((state) => state.odysseyStage2);
  const setIsHolding = useAppStore((state) => state.setIsHolding);
  const [contextLost, setContextLost] = useState(false);
  const [isSoftwareGl, setIsSoftwareGl] = useState(false);

  const isMobile = useMemo(() => isMobileViewport(), []);
  const controlsRef = useRef<OrbitControlsImpl | null>(null);
  const userInteractedRef = useRef(false);
  const skipRequestedRef = useRef(false);
  const bloomResolution = useMemo(() => {
    const scale = isMobile ? 0.5 : 1;
    const w = typeof window !== 'undefined' ? Math.round(window.innerWidth * scale) : 1280;
    const h = typeof window !== 'undefined' ? Math.round(window.innerHeight * scale) : 720;
    return new THREE.Vector2(w, h);
  }, [isMobile]);

  useEffect(() => {
    setOdysseyStage2(false);
  }, [setOdysseyStage2]);

  const handleRevealComplete = useCallback(() => {
    setIsHolding(false);
    setOdysseyStage2(true);
  }, [setIsHolding, setOdysseyStage2]);

  return (
    <div className="relative w-full h-full overflow-hidden bg-black text-white font-mono select-none">
      <Canvas
        camera={{ position: [0, 8, 250], fov: 60, near: 0.1, far: 1500 }}
        dpr={isMobile ? [1, 1.25] : [1, 1.5]}
        onCreated={({ gl }) => {
          try {
            const rawGl = gl.getContext();
            const dbg = rawGl.getExtension('WEBGL_debug_renderer_info');
            const rendererStr = dbg
              ? String(rawGl.getParameter(dbg.UNMASKED_RENDERER_WEBGL))
              : String(rawGl.getParameter(rawGl.RENDERER));
            if (/SwiftShader|llvmpipe|Software|Microsoft Basic Render/i.test(rendererStr)) {
              setIsSoftwareGl(true);
            }
          } catch {
            // Ignore renderer query failure
          }

          const dom = gl.domElement;
          dom.addEventListener('webglcontextlost', (e) => {
            e.preventDefault();
            setContextLost(true);
          });
          dom.addEventListener('webglcontextrestored', () => {
            setContextLost(false);
          });
        }}
      >
        <color attach="background" args={['#000000']} />
        <ParticleSwarm
          onRevealComplete={handleRevealComplete}
          userInteractedRef={userInteractedRef}
          controlsRef={controlsRef}
          skipRequestedRef={skipRequestedRef}
          isMobile={isMobile}
        />
        <OrbitControls
          ref={controlsRef}
          autoRotate={false}
          enableZoom={false}
          enablePan={false}
          enableDamping
          dampingFactor={0.05}
          minDistance={22}
          maxDistance={460}
          onStart={() => {
            userInteractedRef.current = true;
          }}
        />
        {!isSoftwareGl && (
          <Effects disableGamma>
            <unrealBloomPass
              args={[bloomResolution, 0.55, 0.35, 0.25]}
              threshold={0.25}
              strength={0.55}
              radius={0.35}
            />
            <shaderPass args={[COMPOSITE_BG_SHADER]} />
          </Effects>
        )}
      </Canvas>

      {/* Stage 1 Intro Controls (accessible on touch & mobile while scroll is locked) */}
      {!odysseyStage2 && !contextLost && (
        <div
          className="absolute inset-x-0 bottom-6 sm:bottom-8 z-20 flex flex-wrap items-center justify-center gap-3 px-4 pointer-events-none"
          style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        >
          <button
            type="button"
            onPointerDown={(e) => {
              e.currentTarget.setPointerCapture?.(e.pointerId);
              setIsHolding(true);
            }}
            onPointerUp={() => setIsHolding(false)}
            onPointerCancel={() => setIsHolding(false)}
            onLostPointerCapture={() => setIsHolding(false)}
            onContextMenu={(e) => e.preventDefault()}
            className="pointer-events-auto min-h-[42px] px-4 py-2 border border-white/25 hover:border-mint-leaf bg-black/75 backdrop-blur-md text-[10px] tracking-[0.2em] uppercase text-white/85 hover:text-mint-leaf touch-none select-none transition-colors cursor-pointer"
          >
            HOLD TO ACCELERATE
          </button>
          <button
            type="button"
            onClick={() => {
              skipRequestedRef.current = true;
              setIsHolding(false);
              setOdysseyStage2(true);
            }}
            className="pointer-events-auto min-h-[42px] px-4 py-2 border border-mint-leaf/50 bg-mint-leaf/15 hover:bg-mint-leaf hover:text-black text-[10px] tracking-[0.2em] uppercase text-mint-leaf transition-colors cursor-pointer"
          >
            ENTER ODYSSEY &rarr;
          </button>
        </div>
      )}

      {contextLost && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-black text-center p-8">
          <div className="border border-mint-leaf/40 bg-black p-6 max-w-md space-y-3">
            <div className="text-xs text-mint-leaf tracking-[0.25em]">WEBGL CONTEXT PAUSED</div>
            <p className="text-xs text-white/75 leading-relaxed">
              Graphics hardware context was interrupted. Refresh to reinitialize the scene.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
