import { Canvas } from '@react-three/fiber';
import { OrbitControls, useTexture } from '@react-three/drei';
import { useRef, Suspense } from 'react';
import { Mesh } from 'three';

interface PanoramaSphereProps {
  imageUrl: string;
}

function PanoramaSphere({ imageUrl }: PanoramaSphereProps) {
  const meshRef = useRef<Mesh>(null);
  const texture = useTexture(imageUrl);
  
  return (
    <mesh ref={meshRef} scale={[-50, 50, 50]}>
      <sphereGeometry args={[1, 64, 32]} />
      <meshBasicMaterial map={texture} side={2} />
    </mesh>
  );
}

interface PanoramaViewerProps {
  imageUrl: string;
  className?: string;
}

export default function PanoramaViewer({ imageUrl, className = "" }: PanoramaViewerProps) {
  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 0], fov: 75 }}
        gl={{ antialias: true }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <PanoramaSphere imageUrl={imageUrl} />
          <OrbitControls
            enableZoom={true}
            enablePan={false}
            enableDamping={true}
            dampingFactor={0.1}
            rotateSpeed={0.3}
            minDistance={0.1}
            maxDistance={10}
            target={[0, 0, 0]}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}