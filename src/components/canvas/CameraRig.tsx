import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useAppStore } from '../../store/useAppStore';
import { clampedDelta, damp, isCoarseDevice, LAMBDA } from './frameUtils';

export function CameraRig() {
  useFrame((state, frameDelta) => {
    const delta = clampedDelta(frameDelta);
    const { scrollProgress: scroll, activePage } = useAppStore.getState();
    const parallax = activePage === 'registrations' || isCoarseDevice() ? 0 : 0.6;
    const aspect =
      state.camera instanceof THREE.PerspectiveCamera ? state.camera.aspect : 1;
    const isPortraitReg = activePage === 'registrations' && aspect < 0.85;

    // Pull back on portrait viewports; pull back on Registrations so the crystal and 3D particle rings fit inside the mobile orbit
    const portraitPullback =
      aspect < 0.85 ? (0.85 - aspect) * (isPortraitReg ? 9.4 : 3.8) : 0;

    // Keep fog distance relative to camera pullback so the mobile crystal & 3D orbit rings stay as vivid as desktop
    if (state.scene.fog instanceof THREE.Fog) {
      state.scene.fog.near = damp(state.scene.fog.near, 5 + portraitPullback, LAMBDA.smooth, delta);
      state.scene.fog.far = damp(state.scene.fog.far, 14 + portraitPullback, LAMBDA.smooth, delta);
    }

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
    state.camera.lookAt(0, 0, 0);
  });

  return null;
}
