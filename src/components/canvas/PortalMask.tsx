import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mask, useMask, Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { useAppStore } from '../../store/useAppStore';

const TARGET_VEC = new THREE.Vector3();

export function PortalMask() {
  const maskRef = useRef<THREE.Mesh>(null!);
  const ringRef = useRef<THREE.Mesh>(null!);
  const innerCoreRef = useRef<THREE.Mesh>(null!);

  // Anything with this stencil will ONLY render inside the <Mask id={1}> shape
  const innerWorldStencil = useMask(1, false);

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

      {/* 2. THE HIDDEN WORLD (Only visible inside the stencil mask) */}
      <Float speed={4} rotationIntensity={2}>
        <mesh ref={innerCoreRef} position={[-0.35, 0.05, 0]}>
          <icosahedronGeometry args={[1.38, 2]} />
          <meshStandardMaterial
            color="#41D2A2"
            emissive="#178966"
            emissiveIntensity={1.1}
            wireframe
            {...innerWorldStencil}
          />
        </mesh>
      </Float>

      {/* Inner Hidden Core Artifact */}
      <Float speed={2.5} rotationIntensity={1.5}>
        <mesh position={[-0.35, 0.05, 0]}>
          <octahedronGeometry args={[0.82, 1]} />
          <meshStandardMaterial
            color="#D6F8ED"
            emissive="#0D6F51"
            emissiveIntensity={0.6}
            metalness={0.9}
            roughness={0.1}
            wireframe
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
