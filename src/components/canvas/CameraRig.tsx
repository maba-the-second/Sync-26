import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useAppStore } from '../../store/useAppStore';
import { clampedDelta, damp, isCoarseDevice, LAMBDA } from './frameUtils';

export function CameraRig() {
  const lookYRef = useRef(0);

  useFrame((state, frameDelta) => {
    const delta = clampedDelta(frameDelta);
    const { scrollProgress: scroll, activePage } = useAppStore.getState();
    const parallax = activePage === 'registrations' || isCoarseDevice() ? 0 : 0.6;
    const aspect =
      state.camera instanceof THREE.PerspectiveCamera ? state.camera.aspect : 1;
    const isPortraitReg = activePage === 'registrations' && aspect < 0.85;

    // Pull back on portrait viewports; pull back more on Registrations so the crystal shrinks cleanly inside the orbit
    const portraitPullback =
      aspect < 0.85 ? (0.85 - aspect) * (isPortraitReg ? 7.8 : 3.8) : 0;

    // Move camera forward on Z axis based on scroll, plus subtle mouse parallax
    state.camera.position.z = damp(
      state.camera.position.z,
      5 + portraitPullback - scroll * 3.2,
      LAMBDA.smooth,
      delta
    );
    state.camera.position.x = damp(
      state.camera.position.x,
      state.pointer.x * parallax,
      LAMBDA.smooth,
      delta
    );
    state.camera.position.y = damp(
      state.camera.position.y,
      state.pointer.y * parallax,
      LAMBDA.smooth,
      delta
    );
    // Slightly lift the shrunk crystal into the upper-middle of the mobile orbit
    lookYRef.current = damp(lookYRef.current, isPortraitReg ? -0.32 : 0, LAMBDA.smooth, delta);
    state.camera.lookAt(0, lookYRef.current, 0);
  });

  return null;
}
