import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mask, useMask, Sparkles, Edges } from '@react-three/drei';
import * as THREE from 'three';
import { useAppStore } from '../../store/useAppStore';
import { createPrismaticCrystalGeometry } from './rhombicBipyramid';
import { clampedDelta, damp, LAMBDA } from './frameUtils';

const TARGET_VEC = new THREE.Vector3();

export function PortalMask() {
  const maskRef = useRef<THREE.Mesh>(null!);
  const ringRef = useRef<THREE.Mesh>(null!);
  const innerGroupRef = useRef<THREE.Group>(null!);
  const innerCoreMeshRef = useRef<THREE.Mesh>(null!);
  const outerSpinAngleRef = useRef(0);
  const outerSpinSpeedRef = useRef(0.22);
  const innerCoreSpeedRef = useRef(0.5);

  // Anything with this stencil will ONLY render inside the <Mask id={1}> shape
  const innerWorldStencil = useMask(1, false);
  const prismaticGeo = useMemo(() => createPrismaticCrystalGeometry(0.56, 1.65, 0.85), []);
  const innerCoreGeo = useMemo(() => createPrismaticCrystalGeometry(0.32, 1.15, 0.58), []);

  useFrame((state, frameDelta) => {
    const delta = clampedDelta(frameDelta);
    const { isHolding: storeHolding, activePage, scrollProgress: scroll } = useAppStore.getState();
    const isHolding = activePage !== 'home' && storeHolding;
    const t = state.clock.elapsedTime;

    // Closed (0) when idle (no cursor window); full breach expansion when clicking & holding mouse
    const targetScale = isHolding ? 3.8 : 0;

    TARGET_VEC.set(targetScale, targetScale, targetScale);

    if (maskRef.current) {
      maskRef.current.scale.lerp(TARGET_VEC, delta * 6);
      maskRef.current.position.x = damp(maskRef.current.position.x, 0, LAMBDA.snappy, delta);
      maskRef.current.position.y = damp(maskRef.current.position.y, 0, LAMBDA.snappy, delta);
      maskRef.current.rotation.z += delta * 0.5;
      maskRef.current.visible = maskRef.current.scale.x > 0.005;
    }

    if (ringRef.current) {
      ringRef.current.scale.lerp(TARGET_VEC, delta * 6);
      ringRef.current.position.x = maskRef.current.position.x;
      ringRef.current.position.y = maskRef.current.position.y;
      ringRef.current.rotation.z -= delta * 0.8;
      ringRef.current.visible = ringRef.current.scale.x > 0.005;
    }

    // Smoothly ramp up spin speed of the larger crystal in decrypt mode
    const targetOuterSpeed = isHolding ? 1.8 : 0.22;
    outerSpinSpeedRef.current = THREE.MathUtils.lerp(
      outerSpinSpeedRef.current,
      targetOuterSpeed,
      delta * 5
    );
    outerSpinAngleRef.current += delta * outerSpinSpeedRef.current;

    // Keep outer wireframe prismatic crystal synchronized with the outer solid crystal's rotation
    if (innerGroupRef.current) {
      const isVisible = maskRef.current ? maskRef.current.visible : false;
      innerGroupRef.current.visible = isVisible;
      if (isVisible) {
        innerGroupRef.current.position.y = Math.sin(t * 1.4) * 0.08;
        innerGroupRef.current.rotation.y = damp(
          innerGroupRef.current.rotation.y,
          state.pointer.x * 0.4 - scroll * Math.PI * 0.75 + outerSpinAngleRef.current,
          LAMBDA.snappy,
          delta
        );
        innerGroupRef.current.rotation.x = damp(
          innerGroupRef.current.rotation.x,
          -state.pointer.y * 0.22 + scroll * 0.35,
          LAMBDA.medium,
          delta
        );
      }
    }

    // Make the smaller crystal in the middle spin significantly faster than the larger crystal in decrypt mode
    if (innerCoreMeshRef.current) {
      const targetInnerSpeed = isHolding ? 5.5 : 0.45;
      innerCoreSpeedRef.current = THREE.MathUtils.lerp(
        innerCoreSpeedRef.current,
        targetInnerSpeed,
        delta * 6
      );
      innerCoreMeshRef.current.rotation.y += delta * innerCoreSpeedRef.current;
    }
  });

  return (
    <group>
      {/* 1. THE PORTAL WINDOW (Hold-expanding Stencil Mask, hidden when idle) */}
      <Mask id={1} ref={maskRef} position={[0, 0, 1]} scale={[0, 0, 0]}>
        <circleGeometry args={[1, 64]} />
      </Mask>

      {/* Portal Rim Glow */}
      <mesh ref={ringRef} position={[0, 0, 1]} scale={[0, 0, 0]}>
        <ringGeometry args={[0.985, 1.012, 64]} />
        <meshBasicMaterial color="#41D2A2" transparent opacity={0.85} side={THREE.DoubleSide} />
      </mesh>

      {/* 2. THE HIDDEN PRISMATIC CRYSTAL WIREFRAME & CORE (Visible on mouse click & hold) */}
      <group ref={innerGroupRef} position={[0, 0, 0]}>
        <mesh geometry={prismaticGeo}>
          <meshStandardMaterial
            color="#41D2A2"
            emissive="#178966"
            emissiveIntensity={1.35}
            wireframe
            {...innerWorldStencil}
          />
          <Edges threshold={5} color="#D6F8ED" />
        </mesh>

        {/* Inner Radiant Prismatic Crystal Heart (Spins faster than the outer crystal in decrypt mode) */}
        <mesh ref={innerCoreMeshRef} geometry={innerCoreGeo}>
          <meshPhysicalMaterial
            color="#D6F8ED"
            emissive="#41D2A2"
            emissiveIntensity={0.95}
            metalness={0.4}
            roughness={0.08}
            clearcoat={1}
            flatShading
            {...innerWorldStencil}
          />
        </mesh>
      </group>

      <Sparkles
        count={60}
        scale={5}
        size={2.0}
        speed={0.5}
        color="#41D2A2"
      />
    </group>
  );
}
