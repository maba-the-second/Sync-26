import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useAppStore } from '../../store/useAppStore';

export function CameraRig() {
  useFrame((state) => {
    const scroll = useAppStore.getState().scrollProgress;

    // Move camera forward on Z axis based on scroll, plus subtle mouse parallax
    state.camera.position.z = THREE.MathUtils.lerp(
      state.camera.position.z,
      5 - scroll * 3.2,
      0.05
    );
    state.camera.position.x = THREE.MathUtils.lerp(
      state.camera.position.x,
      state.pointer.x * 0.6,
      0.05
    );
    state.camera.position.y = THREE.MathUtils.lerp(
      state.camera.position.y,
      state.pointer.y * 0.6,
      0.05
    );
    state.camera.lookAt(0, 0, 0);
  });

  return null;
}
