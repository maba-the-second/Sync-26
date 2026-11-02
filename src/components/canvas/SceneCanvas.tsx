import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import { CameraRig } from './CameraRig';
import { WorldScene } from './WorldScene';

export function SceneCanvas() {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 45 }} gl={{ stencil: true, antialias: true }}>
      <color attach="background" args={['#050505']} />
      <fog attach="fog" args={['#050505', 5, 14]} />

      <ambientLight intensity={0.6} color="#ffffff" />
      <directionalLight position={[5, 5, 5]} intensity={2.2} color="#ffffff" />
      <pointLight position={[-4, -3, 2]} intensity={2.0} color="#41D2A2" />
      <pointLight position={[3, -2, -2]} intensity={1.4} color="#178966" />

      <Suspense fallback={null}>
        <Environment preset="city" />
      </Suspense>

      <CameraRig />
      <WorldScene />
    </Canvas>
  );
}
