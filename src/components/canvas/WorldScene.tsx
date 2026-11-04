import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, useMask, Edges } from '@react-three/drei';
import * as THREE from 'three';
import { useAppStore } from '../../store/useAppStore';
import { PortalMask } from './PortalMask';

/**
 * Generates a non-indexed, flat-faceted hexagonal crystal spire geometry
 * with pointed top and bottom pyramidal terminations.
 */
export function createCrystalSpireGeometry(
  radiusTop = 0.45,
  radiusBottom = 0.36,
  bodyHeight = 1.5,
  tipTopHeight = 0.7,
  tipBottomHeight = 0.5,
  sides = 6
): THREE.BufferGeometry {
  const positions: number[] = [];
  const halfBody = bodyHeight / 2;

  const topApex: [number, number, number] = [0, halfBody + tipTopHeight, 0];
  const bottomApex: [number, number, number] = [0, -halfBody - tipBottomHeight, 0];

  const topRing: [number, number, number][] = [];
  const bottomRing: [number, number, number][] = [];

  for (let i = 0; i < sides; i++) {
    const angle = (i / sides) * Math.PI * 2;
    // Slight deterministic facet asymmetry for authentic crystal cut proportions
    const facetScale = i % 2 === 0 ? 1.05 : 0.94;
    const cos = Math.cos(angle) * facetScale;
    const sin = Math.sin(angle) * facetScale;

    topRing.push([cos * radiusTop, halfBody, sin * radiusTop]);
    bottomRing.push([cos * radiusBottom, -halfBody, sin * radiusBottom]);
  }

  const pushTri = (
    a: [number, number, number],
    b: [number, number, number],
    c: [number, number, number]
  ) => {
    positions.push(a[0], a[1], a[2], b[0], b[1], b[2], c[0], c[1], c[2]);
  };

  for (let i = 0; i < sides; i++) {
    const next = (i + 1) % sides;
    const tCurr = topRing[i];
    const tNext = topRing[next];
    const bCurr = bottomRing[i];
    const bNext = bottomRing[next];

    // Top pyramidal termination facet
    pushTri(topApex, tNext, tCurr);

    // Prism body trapezoidal facet (split into 2 coplanar triangles)
    pushTri(tCurr, tNext, bNext);
    pushTri(tCurr, bNext, bCurr);

    // Bottom pyramidal termination facet
    pushTri(bottomApex, bCurr, bNext);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.computeVertexNormals();
  return geometry;
}

const SECONDARY_SHARDS: {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  color: string;
  emissive: string;
}[] = [
  {
    position: [-0.46, -0.18, 0.16],
    rotation: [0.18, 0.4, 0.48],
    scale: [0.58, 0.68, 0.58],
    color: '#0D6F51',
    emissive: '#043826',
  },
  {
    position: [0.48, -0.14, 0.14],
    rotation: [0.15, -0.5, -0.44],
    scale: [0.54, 0.64, 0.54],
    color: '#178966',
    emissive: '#043826',
  },
  {
    position: [-0.26, -0.32, -0.34],
    rotation: [-0.38, 0.25, 0.28],
    scale: [0.46, 0.55, 0.46],
    color: '#043826',
    emissive: '#0D6F51',
  },
  {
    position: [0.3, -0.3, -0.32],
    rotation: [-0.34, -0.3, -0.32],
    scale: [0.48, 0.52, 0.48],
    color: '#0D6F51',
    emissive: '#043826',
  },
  {
    position: [0.06, -0.38, 0.4],
    rotation: [0.52, 0.12, -0.14],
    scale: [0.4, 0.45, 0.4],
    color: '#178966',
    emissive: '#0D6F51',
  },
];

export function WorldScene() {
  const crystalClusterRef = useRef<THREE.Group>(null!);
  const holoCrystalRef = useRef<THREE.Group>(null!);
  const orbitalRingRef = useRef<THREE.Mesh>(null!);

  // Inverted mask so the outer crystal shell gets peeled away where the portal mask expands
  const outerWorldStencil = useMask(1, true);

  const mainCrystalGeo = useMemo(
    () => createCrystalSpireGeometry(0.46, 0.36, 1.55, 0.75, 0.55, 6),
    []
  );
  const shardCrystalGeo = useMemo(
    () => createCrystalSpireGeometry(0.36, 0.24, 1.25, 0.6, 0.4, 6),
    []
  );
  const holoCrystalGeo = useMemo(
    () => createCrystalSpireGeometry(0.42, 0.34, 1.15, 0.62, 0.52, 6),
    []
  );

  useFrame((state, delta) => {
    const scroll = useAppStore.getState().scrollProgress;
    const t = state.clock.elapsedTime;

    if (crystalClusterRef.current) {
      crystalClusterRef.current.rotation.y = THREE.MathUtils.lerp(
        crystalClusterRef.current.rotation.y,
        state.pointer.x * 0.4 - scroll * Math.PI * 0.75 + t * 0.12,
        0.06
      );
      crystalClusterRef.current.rotation.x = THREE.MathUtils.lerp(
        crystalClusterRef.current.rotation.x,
        -state.pointer.y * 0.22 + scroll * 0.35,
        0.06
      );
    }

    if (holoCrystalRef.current) {
      holoCrystalRef.current.position.y = 0.25 + Math.sin(t * 1.6) * 0.12;
      holoCrystalRef.current.rotation.y = -0.35 + state.pointer.x * 0.45 + t * 0.35;
      holoCrystalRef.current.rotation.z = Math.cos(t * 0.9) * 0.08;
    }

    if (orbitalRingRef.current) {
      orbitalRingRef.current.rotation.z -= delta * 0.15;
      orbitalRingRef.current.rotation.x = Math.PI / 2.3 + scroll * 0.8;
    }
  });

  return (
    <group>
      {/* Stencil Portal & Hidden Breach World */}
      <PortalMask />

      {/* FOREGROUND PRIMARY EMERALD-MINT CRYSTAL CLUSTER */}
      <group ref={crystalClusterRef} position={[-0.35, -0.05, 0]}>
        <Float speed={1.5} rotationIntensity={0.22} floatIntensity={0.42}>
          {/* Central Monolith Crystal Spire */}
          <mesh geometry={mainCrystalGeo} position={[0, 0.1, 0]}>
            <meshPhysicalMaterial
              color="#0D6F51"
              emissive="#043826"
              emissiveIntensity={0.55}
              metalness={0.3}
              roughness={0.12}
              clearcoat={1}
              clearcoatRoughness={0.06}
              reflectivity={1}
              flatShading
              {...outerWorldStencil}
            />
            <Edges threshold={12} color="#41D2A2" />
          </mesh>

          {/* Secondary Intersecting Crystal Shards */}
          {SECONDARY_SHARDS.map((shard, idx) => (
            <mesh
              key={idx}
              geometry={shardCrystalGeo}
              position={shard.position}
              rotation={shard.rotation}
              scale={shard.scale}
            >
              <meshPhysicalMaterial
                color={shard.color}
                emissive={shard.emissive}
                emissiveIntensity={0.45}
                metalness={0.35}
                roughness={0.15}
                clearcoat={1}
                clearcoatRoughness={0.08}
                flatShading
                {...outerWorldStencil}
              />
              <Edges threshold={12} color="#41D2A2" />
            </mesh>
          ))}

          {/* Orbiting Floating Micro-Crystal Shards */}
          <mesh
            geometry={shardCrystalGeo}
            position={[-0.95, 0.55, 0.35]}
            rotation={[0.4, 0.8, 0.6]}
            scale={[0.18, 0.24, 0.18]}
          >
            <meshStandardMaterial
              color="#41D2A2"
              emissive="#178966"
              emissiveIntensity={0.8}
              flatShading
              {...outerWorldStencil}
            />
          </mesh>
          <mesh
            geometry={shardCrystalGeo}
            position={[0.88, 0.42, 0.45]}
            rotation={[-0.3, 0.5, -0.5]}
            scale={[0.15, 0.22, 0.15]}
          >
            <meshStandardMaterial
              color="#D6F8ED"
              emissive="#41D2A2"
              emissiveIntensity={0.9}
              flatShading
              {...outerWorldStencil}
            />
          </mesh>
        </Float>
      </group>

      {/* RIGHT-SIDE NEON-MINT HOLOGRAPHIC CRYSTAL SHARD */}
      <group ref={holoCrystalRef} position={[1.45, 0.25, -0.6]}>
        <Float speed={2.2} rotationIntensity={0.35} floatIntensity={0.55}>
          {/* Outer Translucent Mint Crystal Shell */}
          <mesh geometry={holoCrystalGeo}>
            <meshPhysicalMaterial
              color="#41D2A2"
              emissive="#178966"
              emissiveIntensity={0.95}
              transparent
              opacity={0.42}
              roughness={0.08}
              metalness={0.2}
              clearcoat={1}
              flatShading
            />
            <Edges threshold={12} color="#D6F8ED" />
          </mesh>

          {/* Inner Crisp Holographic Crystal Wireframe */}
          <mesh geometry={holoCrystalGeo} scale={0.78}>
            <meshBasicMaterial
              color="#D6F8ED"
              wireframe
              transparent
              opacity={0.35}
            />
          </mesh>
        </Float>
      </group>

      {/* Subtle Orbital Telemetry Ring */}
      <mesh ref={orbitalRingRef} position={[-0.25, -0.1, 0]}>
        <torusGeometry args={[2.35, 0.006, 16, 128]} />
        <meshBasicMaterial
          color="#41D2A2"
          transparent
          opacity={0.3}
          {...outerWorldStencil}
        />
      </mesh>
    </group>
  );
}
