import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mask, useMask, Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { useAppStore } from '../../store/useAppStore';

const TARGET_VEC = new THREE.Vector3();

function createInnerCrystalLatticeGeometry(): THREE.BufferGeometry {
  const positions: number[] = [];
  const sides = 6;
  const radius = 0.62;
  const halfBody = 0.9;
  const topApex: [number, number, number] = [0, 1.75, 0];
  const bottomApex: [number, number, number] = [0, -1.65, 0];

  const topRing: [number, number, number][] = [];
  const bottomRing: [number, number, number][] = [];

  for (let i = 0; i < sides; i++) {
    const angle = (i / sides) * Math.PI * 2;
    topRing.push([Math.cos(angle) * radius, halfBody, Math.sin(angle) * radius]);
    bottomRing.push([Math.cos(angle) * (radius * 0.82), -halfBody, Math.sin(angle) * (radius * 0.82)]);
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
    pushTri(topApex, topRing[next], topRing[i]);
    pushTri(topRing[i], topRing[next], bottomRing[next]);
    pushTri(topRing[i], bottomRing[next], bottomRing[i]);
    pushTri(bottomApex, bottomRing[i], bottomRing[next]);
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.computeVertexNormals();
  return geo;
}

export function PortalMask() {
  const maskRef = useRef<THREE.Mesh>(null!);
  const ringRef = useRef<THREE.Mesh>(null!);
  const innerCoreRef = useRef<THREE.Mesh>(null!);

  // Anything with this stencil will ONLY render inside the <Mask id={1}> shape
  const innerWorldStencil = useMask(1, false);
  const innerCrystalGeo = useMemo(() => createInnerCrystalLatticeGeometry(), []);

  useFrame((state, delta) => {
    const isHolding = useAppStore.getState().isHolding;
    const scroll = useAppStore.getState().scrollProgress;
    // Subtle hover cursor lens when idle, full breach expansion when holding
    const targetScale = isHolding ? 3.8 : 0.42;

    TARGET_VEC.set(targetScale, targetScale, targetScale);

    const targetX = isHolding ? 0 : state.pointer.x * 1.6;
    const targetY = isHolding ? 0 : state.pointer.y * 1.1;

    if (maskRef.current) {
      maskRef.current.scale.lerp(TARGET_VEC, delta * 6);
      maskRef.current.position.x = THREE.MathUtils.lerp(maskRef.current.position.x, targetX, 0.12);
      maskRef.current.position.y = THREE.MathUtils.lerp(maskRef.current.position.y, targetY, 0.12);
      maskRef.current.rotation.z += delta * 0.5;
    }

    if (ringRef.current) {
      ringRef.current.scale.lerp(TARGET_VEC, delta * 6);
      ringRef.current.position.x = maskRef.current.position.x;
      ringRef.current.position.y = maskRef.current.position.y;
      ringRef.current.rotation.z -= delta * 0.8;
    }

    if (innerCoreRef.current) {
      innerCoreRef.current.rotation.y += delta * 0.9;
      innerCoreRef.current.rotation.x = scroll * Math.PI * 2;
    }
  });

  return (
    <group>
      {/* 1. THE PORTAL WINDOW (Cursor-tracking + Hold-expanding Stencil Mask) */}
      <Mask id={1} ref={maskRef} position={[0, 0, 1]}>
        <circleGeometry args={[1, 64]} />
      </Mask>

      {/* Portal Rim Glow */}
      <mesh ref={ringRef} position={[0, 0, 1]}>
        <ringGeometry args={[0.985, 1.012, 64]} />
        <meshBasicMaterial color="#41D2A2" transparent opacity={0.85} side={THREE.DoubleSide} />
      </mesh>

      {/* 2. THE HIDDEN CRYSTAL CORE (Only visible inside the stencil mask) */}
      <Float speed={3.5} rotationIntensity={1.6}>
        <mesh ref={innerCoreRef} geometry={innerCrystalGeo} position={[-0.35, 0.05, 0]}>
          <meshStandardMaterial
            color="#41D2A2"
            emissive="#178966"
            emissiveIntensity={1.25}
            wireframe
            {...innerWorldStencil}
          />
        </mesh>
      </Float>

      {/* Inner Radiant Crystal Heart */}
      <Float speed={2.5} rotationIntensity={1.2}>
        <mesh position={[-0.35, 0.05, 0]} scale={[0.55, 1.25, 0.55]}>
          <octahedronGeometry args={[0.95, 0]} />
          <meshPhysicalMaterial
            color="#D6F8ED"
            emissive="#41D2A2"
            emissiveIntensity={0.85}
            metalness={0.4}
            roughness={0.08}
            clearcoat={1}
            flatShading
            {...innerWorldStencil}
          />
        </mesh>
      </Float>

      <Sparkles
        count={70}
        scale={5}
        size={2.2}
        speed={0.6}
        color="#41D2A2"
      />
    </group>
  );
}
