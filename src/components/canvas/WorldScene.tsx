import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useMask, Edges } from '@react-three/drei';
import * as THREE from 'three';
import { useAppStore } from '../../store/useAppStore';
import { PortalMask } from './PortalMask';
import { createPrismaticCrystalGeometry } from './rhombicBipyramid';
import { clampedDelta, damp, LAMBDA } from './frameUtils';

interface OrbitConfig {
  radius: number;
  count: number;
  spread: number;
  speed: number;
  tilt: [number, number, number];
  color: string;
  size: number;
}

const ORBIT_CONFIGS: OrbitConfig[] = [
  {
    radius: 1.28,
    count: 140,
    spread: 0.08,
    speed: 0.55,
    tilt: [0.42, 0.15, -0.35],
    color: '#D6F8ED',
    size: 0.032,
  },
  {
    radius: 1.72,
    count: 200,
    spread: 0.12,
    speed: -0.38,
    tilt: [-0.55, 0.25, 0.48],
    color: '#41D2A2',
    size: 0.028,
  },
  {
    radius: 2.22,
    count: 240,
    spread: 0.16,
    speed: 0.24,
    tilt: [1.18, -0.18, 0.22],
    color: '#178966',
    size: 0.025,
  },
];

function createOrbitParticleGeometry(radius: number, count: number, spread: number): THREE.BufferGeometry {
  const positions = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    // Deterministic pseudo-random offsets for smooth organic clustering along the ring
    const s1 = Math.sin(i * 12.9898) * 43758.5453;
    const s2 = Math.sin(i * 78.233) * 43758.5453;
    const s3 = Math.sin(i * 39.425) * 43758.5453;
    const r1 = s1 - Math.floor(s1) - 0.5;
    const r2 = s2 - Math.floor(s2) - 0.5;
    const r3 = s3 - Math.floor(s3) - 0.5;

    const angle = (i / count) * Math.PI * 2 + r1 * 0.15;
    const localRadius = radius + r2 * spread;
    const yOffset = r3 * (spread * 0.75);

    positions[i * 3] = Math.cos(angle) * localRadius;
    positions[i * 3 + 1] = yOffset;
    positions[i * 3 + 2] = Math.sin(angle) * localRadius;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  return geometry;
}

export function WorldScene() {
  const crystalRef = useRef<THREE.Group>(null!);
  const orbitGroupRef = useRef<THREE.Group>(null!);
  const orbitRefs = useRef<(THREE.Group | null)[]>([]);
  const outerSpinAngleRef = useRef(0);
  const outerSpinSpeedRef = useRef(0.22);

  // Inverted mask so the outer solid Prismatic Crystal peels away to reveal the inner mesh when holding the mouse
  const outerWorldStencil = useMask(1, true);

  // Prismatic Crystal with Pyramidal Caps: 14 vertices, 6 flat rectangular side walls + 12 triangular cap facets, regular hexagon cross-section
  const prismaticCrystalGeo = useMemo(
    () => createPrismaticCrystalGeometry(0.56, 1.65, 0.85),
    []
  );

  // Precompute particle ring geometries
  const orbitGeometries = useMemo(
    () => ORBIT_CONFIGS.map((cfg) => createOrbitParticleGeometry(cfg.radius, cfg.count, cfg.spread)),
    []
  );

  useFrame((state, frameDelta) => {
    const delta = clampedDelta(frameDelta);
    const { scrollProgress: scroll, isHolding: storeHolding, activePage } = useAppStore.getState();
    const isHolding = activePage !== 'home' && storeHolding;
    const t = state.clock.elapsedTime;

    // Smoothly accelerate the larger crystal spin when entering decrypt mode
    const targetOuterSpeed = isHolding ? 1.8 : 0.22;
    outerSpinSpeedRef.current = THREE.MathUtils.lerp(
      outerSpinSpeedRef.current,
      targetOuterSpeed,
      delta * 5
    );
    outerSpinAngleRef.current += delta * outerSpinSpeedRef.current;

    if (crystalRef.current) {
      crystalRef.current.position.y = Math.sin(t * 1.4) * 0.08;
      crystalRef.current.rotation.y = damp(
        crystalRef.current.rotation.y,
        state.pointer.x * 0.4 - scroll * Math.PI * 0.75 + outerSpinAngleRef.current,
        LAMBDA.snappy,
        delta
      );
      crystalRef.current.rotation.x = damp(
        crystalRef.current.rotation.x,
        -state.pointer.y * 0.22 + scroll * 0.35,
        LAMBDA.medium,
        delta
      );
    }

    // Rotate each particle orbit ring around its tilted axis (accelerates when holding mouse)
    const speedMultiplier = isHolding ? 2.4 : 1.0;
    ORBIT_CONFIGS.forEach((cfg, idx) => {
      const ring = orbitRefs.current[idx];
      if (ring) {
        ring.rotation.y += delta * cfg.speed * speedMultiplier;
      }
    });

    if (orbitGroupRef.current) {
      orbitGroupRef.current.position.y = Math.sin(t * 1.4) * 0.05;
      orbitGroupRef.current.rotation.y = damp(
        orbitGroupRef.current.rotation.y,
        state.pointer.x * 0.25 - scroll * Math.PI * 0.35,
        LAMBDA.smooth,
        delta
      );
      orbitGroupRef.current.rotation.x = damp(
        orbitGroupRef.current.rotation.x,
        -state.pointer.y * 0.15 + scroll * 0.2,
        LAMBDA.smooth,
        delta
      );
    }
  });

  return (
    <group>
      {/* Stencil Portal & Hidden Wireframe Mesh (revealed on mouse click & hold) */}
      <PortalMask />

      {/* PRIMARY PRISMATIC CRYSTAL WITH PYRAMIDAL CAPS (14 vertices, 20 facets, hexagonal cross-section) */}
      <group ref={crystalRef} position={[0, 0, 0]}>
        <mesh geometry={prismaticCrystalGeo}>
          <meshPhysicalMaterial
            color="#0D6F51"
            emissive="#043826"
            emissiveIntensity={0.6}
            metalness={0.3}
            roughness={0.1}
            clearcoat={1}
            clearcoatRoughness={0.05}
            reflectivity={1}
            flatShading
            {...outerWorldStencil}
          />
          {/* Threshold > 0 hides the coplanar diagonal inside the 6 rectangular side walls so they render as pure rectangles */}
          <Edges threshold={5} color="#41D2A2" />
        </mesh>
      </group>

      {/* MULTI-RING PARTICLE ORBITS AROUND THE CRYSTAL */}
      <group ref={orbitGroupRef} position={[0, 0, 0]}>
        {ORBIT_CONFIGS.map((cfg, idx) => (
          <group key={idx} rotation={cfg.tilt}>
            <group
              ref={(el) => {
                orbitRefs.current[idx] = el;
              }}
            >
              {/* Glowing Particle Stream */}
              <points geometry={orbitGeometries[idx]}>
                <pointsMaterial
                  color={cfg.color}
                  size={cfg.size}
                  transparent
                  opacity={0.85}
                  sizeAttenuation
                  depthWrite={false}
                  blending={THREE.AdditiveBlending}
                />
              </points>

              {/* Subtle Guide Ring along the Orbit Path */}
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[cfg.radius, 0.0025, 12, 128]} />
                <meshBasicMaterial
                  color={cfg.color}
                  transparent
                  opacity={0.18}
                  blending={THREE.AdditiveBlending}
                />
              </mesh>
            </group>
          </group>
        ))}
      </group>
    </group>
  );
}
