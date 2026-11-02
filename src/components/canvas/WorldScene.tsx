import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, useMask, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { useAppStore } from '../../store/useAppStore';
import { PortalMask } from './PortalMask';

export function WorldScene() {
  const sentinelGroupRef = useRef<THREE.Group>(null!);
  const holoGhostRef = useRef<THREE.Group>(null!);
  const orbitalRingRef = useRef<THREE.Mesh>(null!);

  // Inverted mask so the outer shell gets peeled away where the portal mask expands
  const outerWorldStencil = useMask(1, true);

  useFrame((state, delta) => {
    const scroll = useAppStore.getState().scrollProgress;
    const t = state.clock.elapsedTime;

    if (sentinelGroupRef.current) {
      sentinelGroupRef.current.rotation.y = THREE.MathUtils.lerp(
        sentinelGroupRef.current.rotation.y,
        state.pointer.x * 0.35 - scroll * Math.PI * 0.6,
        0.06
      );
      sentinelGroupRef.current.rotation.x = THREE.MathUtils.lerp(
        sentinelGroupRef.current.rotation.x,
        -state.pointer.y * 0.2 + scroll * 0.4,
        0.06
      );
    }

    if (holoGhostRef.current) {
      holoGhostRef.current.position.y = 0.35 + Math.sin(t * 1.6) * 0.12;
      holoGhostRef.current.rotation.y = -0.35 + state.pointer.x * 0.45 + Math.sin(t * 0.7) * 0.08;
      holoGhostRef.current.rotation.z = Math.cos(t * 0.9) * 0.05;
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

      {/* FOREGROUND SENTINEL / CYBERNETIC CORE (Center-Left like KPR character bust) */}
      <group ref={sentinelGroupRef} position={[-0.35, -0.1, 0]}>
        <Float speed={1.4} rotationIntensity={0.25} floatIntensity={0.4}>
          {/* Sculpted Faceted Cybernetic Head / Core */}
          <mesh position={[0, 0.15, 0]}>
            <icosahedronGeometry args={[1.25, 1]} />
            <meshStandardMaterial
              color="#14181d"
              emissive="#043826"
              emissiveIntensity={0.35}
              metalness={0.85}
              roughness={0.22}
              flatShading
              {...outerWorldStencil}
            />
          </mesh>

          {/* Cybernetic Collar / Visor Ridge */}
          <mesh position={[0, -0.75, 0.2]} rotation={[0.3, 0, 0]}>
            <torusKnotGeometry args={[0.72, 0.2, 100, 24]} />
            <meshStandardMaterial
              color="#0D6F51"
              emissive="#043826"
              emissiveIntensity={0.45}
              metalness={0.9}
              roughness={0.18}
              {...outerWorldStencil}
            />
          </mesh>

          {/* Glowing Cybernetic Ear/Temple Node (Matches KPR cybernetic temple ring) */}
          <mesh position={[0.92, 0.35, 0.55]} rotation={[0, 0.6, 0]}>
            <torusGeometry args={[0.14, 0.03, 16, 48]} />
            <meshBasicMaterial color="#41D2A2" {...outerWorldStencil} />
          </mesh>
        </Float>
      </group>

      {/* RIGHT-SIDE NEON-MINT HOLOGRAPHIC APPARITION (Matches KPRverse green skull/projection) */}
      <group ref={holoGhostRef} position={[1.45, 0.35, -0.6]}>
        <Float speed={2.2} rotationIntensity={0.4} floatIntensity={0.6}>
          {/* Outer Glowing Mint Hologram Shell */}
          <mesh>
            <icosahedronGeometry args={[1.05, 2]} />
            <MeshDistortMaterial
              color="#41D2A2"
              emissive="#178966"
              emissiveIntensity={1.1}
              distort={0.28}
              speed={2.2}
              transparent
              opacity={0.38}
              roughness={0.1}
              metalness={0.3}
            />
          </mesh>

          {/* Inner Crisp Holographic Wireframe */}
          <mesh scale={1.08}>
            <dodecahedronGeometry args={[0.95, 1]} />
            <meshBasicMaterial
              color="#D6F8ED"
              wireframe
              transparent
              opacity={0.32}
            />
          </mesh>
        </Float>
      </group>

      {/* Subtle Orbital Telemetry Ring */}
      <mesh ref={orbitalRingRef} position={[-0.2, -0.1, 0]}>
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
