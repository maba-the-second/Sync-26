import { Suspense, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import { setConsoleFunction } from 'three';
import { CameraRig } from './CameraRig';
import { WorldScene } from './WorldScene';
import { useAppStore } from '../../store/useAppStore';

setConsoleFunction((type, message, ...params) => {
  if (type === 'warn' && message.startsWith('THREE.Clock: This module has been deprecated')) return;
  console[type](message, ...params);
});
const IDLE_FPS = 30;
const ACTIVE_FPS = 60;

function FrameGovernor() {
  const invalidate = useThree((state) => state.invalidate);

  useEffect(() => {
    let raf = 0;
    let last = 0;

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);

      const targetFps = useAppStore.getState().isHolding ? ACTIVE_FPS : IDLE_FPS;
      if (now - last < 1000 / targetFps - 1) return;
      last = now;
      invalidate();
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [invalidate]);

  return null;
}

export function SceneCanvas() {
  return (
    <Canvas
      frameloop="demand"
      dpr={[1, 1.25]}
      camera={{ position: [0, 0, 5], fov: 45 }}
      gl={{ stencil: true, antialias: true, powerPreference: 'high-performance' }}
    >
      <color attach="background" args={['#050505']} />
      <fog attach="fog" args={['#050505', 5, 14]} />

      <ambientLight intensity={0.6} color="#ffffff" />
      <directionalLight position={[5, 5, 5]} intensity={2.2} color="#ffffff" />
      <pointLight position={[-4, -3, 2]} intensity={2.0} color="#41D2A2" />
      <pointLight position={[3, -2, -2]} intensity={1.4} color="#178966" />

      <Suspense fallback={null}>
        <Environment preset="city" />
      </Suspense>

      <FrameGovernor />
      <CameraRig />
      <WorldScene />
    </Canvas>
  );
}
