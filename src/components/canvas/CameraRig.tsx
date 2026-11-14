import { useFrame } from '@react-three/fiber';
import { useAppStore } from '../../store/useAppStore';
import { clampedDelta, damp, LAMBDA } from './frameUtils';

export function CameraRig() {
  useFrame((state, frameDelta) => {
    const delta = clampedDelta(frameDelta);
    const scroll = useAppStore.getState().scrollProgress;

    // Move camera forward on Z axis based on scroll, plus subtle mouse parallax
    state.camera.position.z = damp(
      state.camera.position.z,
      5 - scroll * 3.2,
      LAMBDA.smooth,
      delta
    );
    state.camera.position.x = damp(
      state.camera.position.x,
      state.pointer.x * 0.6,
      LAMBDA.smooth,
      delta
    );
    state.camera.position.y = damp(
      state.camera.position.y,
      state.pointer.y * 0.6,
      LAMBDA.smooth,
      delta
    );
    state.camera.lookAt(0, 0, 0);
  });

  return null;
}
