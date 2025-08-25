import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface PanoramaSphereProps {
  imageUrl: string;
}

const PanoramaSphere: React.FC<PanoramaSphereProps> = ({ imageUrl }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const { scene } = useThree();
  
  useEffect(() => {
    if (!imageUrl) return;
    
    const loader = new THREE.TextureLoader();
    loader.load(
      imageUrl,
      (texture) => {
        texture.wrapS = THREE.RepeatWrapping;
        texture.repeat.x = -1;
        
        if (meshRef.current) {
          (meshRef.current.material as THREE.MeshBasicMaterial).map = texture;
          (meshRef.current.material as THREE.MeshBasicMaterial).needsUpdate = true;
        }
      },
      undefined,
      (error) => {
        console.error('Error loading panorama texture:', error);
      }
    );
  }, [imageUrl]);

  return (
    <mesh ref={meshRef} scale={[-1, 1, 1]}>
      <sphereGeometry args={[500, 60, 40]} />
      <meshBasicMaterial side={THREE.BackSide} />
    </mesh>
  );
};

interface PanoramaViewer360Props {
  imageUrl: string;
  className?: string;
  onFullscreen?: (isFullscreen: boolean) => void;
}

const PanoramaViewer360: React.FC<PanoramaViewer360Props> = ({ 
  imageUrl, 
  className = "",
  onFullscreen 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
      onFullscreen?.(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
      onFullscreen?.(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = Boolean(document.fullscreenElement);
      setIsFullscreen(isCurrentlyFullscreen);
      onFullscreen?.(isCurrentlyFullscreen);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, [onFullscreen]);

  useEffect(() => {
    if (imageUrl) {
      setIsLoading(true);
      const img = new Image();
      img.onload = () => setIsLoading(false);
      img.onerror = () => setIsLoading(false);
      img.src = imageUrl;
    }
  }, [imageUrl]);

  if (!imageUrl) {
    return (
      <div className={`bg-slate-200 flex items-center justify-center ${className}`}>
        <div className="text-center text-slate-500">
          <Icon name="Camera" size={48} className="mx-auto mb-4" />
          <p>Панорама не загружена</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className={`relative bg-black ${className}`}
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
          <div className="text-center text-white">
            <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full mx-auto mb-4"></div>
            <p>Загрузка панорамы...</p>
          </div>
        </div>
      )}
      
      <Canvas>
        <PerspectiveCamera makeDefault fov={75} position={[0, 0, 0.1]} />
        <PanoramaSphere imageUrl={imageUrl} />
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          enableDamping={true}
          dampingFactor={0.1}
          rotateSpeed={0.5}
          minDistance={0.1}
          maxDistance={10}
          target={[0, 0, 0]}
        />
      </Canvas>
      
      {/* Controls */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
        <Button
          size="sm"
          variant="secondary"
          onClick={toggleFullscreen}
          className="bg-black/50 hover:bg-black/70 text-white border-0"
        >
          <Icon name={isFullscreen ? "Minimize" : "Maximize"} size={16} />
        </Button>
      </div>
      
      {/* Instructions */}
      <div className="absolute bottom-4 left-4 z-20 text-white text-sm bg-black/50 rounded-lg px-3 py-2">
        <p>🖱️ Перетаскивайте для поворота • 🔍 Колёсико для зума</p>
      </div>
    </div>
  );
};

export default PanoramaViewer360;