import { Suspense, useRef } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import * as THREE from "three";
import { motion } from "framer-motion";
import faceTexture from "@/assets/scientist-hero.png";

// 3D Human Character with face texture
const HumanCharacter = () => {
  const groupRef = useRef<THREE.Group>(null);
  const mouthRef = useRef<THREE.Mesh>(null);
  
  // Load face texture
  const texture = useLoader(THREE.TextureLoader, faceTexture);
  
  // Breathing and talking animation
  useFrame((state) => {
    if (groupRef.current) {
      // Subtle breathing
      groupRef.current.scale.y = 1 + Math.sin(state.clock.elapsedTime * 0.5) * 0.01;
    }
    if (mouthRef.current) {
      // Talking animation
      mouthRef.current.scale.y = 0.3 + Math.sin(state.clock.elapsedTime * 4) * 0.15;
    }
  });

  return (
    <group ref={groupRef} position={[0, -1.5, 0]}>
      {/* Head with face texture */}
      <mesh position={[0, 2.8, 0]}>
        <sphereGeometry args={[0.45, 32, 32]} />
        <meshStandardMaterial color="#f0d0c0" roughness={0.7} />
      </mesh>
      
      {/* Face plane with user's face */}
      <mesh position={[0, 2.8, 0.4]} rotation={[0, 0, 0]}>
        <planeGeometry args={[0.8, 0.8]} />
        <meshStandardMaterial 
          map={texture} 
          transparent 
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Hair */}
      <mesh position={[0, 3.1, -0.1]}>
        <sphereGeometry args={[0.42, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.8} />
      </mesh>
      
      {/* Neck */}
      <mesh position={[0, 2.2, 0]}>
        <cylinderGeometry args={[0.12, 0.15, 0.3, 16]} />
        <meshStandardMaterial color="#f0d0c0" roughness={0.7} />
      </mesh>
      
      {/* Torso - Suit jacket */}
      <mesh position={[0, 1.3, 0]}>
        <cylinderGeometry args={[0.35, 0.45, 1.5, 16]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.3} metalness={0.1} />
      </mesh>
      
      {/* White shirt collar */}
      <mesh position={[0, 2.0, 0.1]}>
        <boxGeometry args={[0.25, 0.15, 0.1]} />
        <meshStandardMaterial color="#ffffff" roughness={0.5} />
      </mesh>
      
      {/* Bow tie */}
      <mesh position={[0, 1.9, 0.18]}>
        <boxGeometry args={[0.2, 0.08, 0.05]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.3} />
      </mesh>
      
      {/* Left shoulder */}
      <mesh position={[-0.5, 1.7, 0]}>
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.3} />
      </mesh>
      
      {/* Right shoulder */}
      <mesh position={[0.5, 1.7, 0]}>
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.3} />
      </mesh>
      
      {/* Left arm */}
      <mesh position={[-0.55, 1.2, 0.1]} rotation={[0.2, 0, 0.15]}>
        <cylinderGeometry args={[0.1, 0.08, 0.8, 16]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.3} />
      </mesh>
      
      {/* Right arm - adjusting tie */}
      <mesh position={[0.4, 1.4, 0.25]} rotation={[0.8, 0, -0.3]}>
        <cylinderGeometry args={[0.1, 0.08, 0.7, 16]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.3} />
      </mesh>
      
      {/* Left hand */}
      <mesh position={[-0.6, 0.75, 0.2]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="#f0d0c0" roughness={0.7} />
      </mesh>
      
      {/* Right hand near tie */}
      <mesh position={[0.15, 1.85, 0.35]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="#f0d0c0" roughness={0.7} />
      </mesh>
      
      {/* Animated mouth indicator (subtle glow) */}
      <mesh ref={mouthRef} position={[0, 2.65, 0.46]}>
        <planeGeometry args={[0.12, 0.05]} />
        <meshBasicMaterial color="#cc8888" transparent opacity={0.3} />
      </mesh>
    </group>
  );
};

// Rotating camera controller
const CameraController = () => {
  useFrame((state) => {
    const angle = state.clock.elapsedTime * 0.15;
    const radius = 5;
    state.camera.position.x = Math.sin(angle) * radius;
    state.camera.position.z = Math.cos(angle) * radius;
    state.camera.position.y = 1.5 + Math.sin(state.clock.elapsedTime * 0.3) * 0.3;
    state.camera.lookAt(0, 1.5, 0);
  });
  return null;
};

// Spotlight beams visualization
const SpotlightBeams = () => {
  return (
    <>
      {/* Main spotlight from above */}
      <spotLight
        position={[0, 8, 2]}
        angle={0.4}
        penumbra={0.5}
        intensity={3}
        color="#fffaf5"
        castShadow
      />
      
      {/* Left magenta light */}
      <spotLight
        position={[-5, 6, 0]}
        angle={0.5}
        penumbra={0.8}
        intensity={2}
        color="#ff00aa"
      />
      
      {/* Right cyan light */}
      <spotLight
        position={[5, 6, 0]}
        angle={0.5}
        penumbra={0.8}
        intensity={2}
        color="#00d4ff"
      />
      
      {/* Back rim light */}
      <spotLight
        position={[0, 4, -4]}
        angle={0.6}
        penumbra={0.5}
        intensity={2}
        color="#ffd700"
      />
      
      {/* Ambient fill */}
      <ambientLight intensity={0.1} />
    </>
  );
};

// Floor with reflection
const Floor = () => {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]} receiveShadow>
      <planeGeometry args={[20, 20]} />
      <meshStandardMaterial 
        color="#050505" 
        roughness={0.2} 
        metalness={0.8}
      />
    </mesh>
  );
};

const SpaceHero = () => {
  return (
    <section className="relative h-screen w-full overflow-hidden bg-[#020205]">
      {/* 3D Canvas */}
      <Canvas
        shadows
        camera={{ position: [0, 1.5, 5], fov: 45 }}
        className="absolute inset-0"
      >
        <fog attach="fog" args={['#020205', 5, 20]} />
        
        <Suspense fallback={null}>
          <CameraController />
          <SpotlightBeams />
          <HumanCharacter />
          <Floor />
          <Environment preset="night" />
        </Suspense>
      </Canvas>

      {/* Vignette overlay */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(2,2,5,0.7)_65%,rgba(2,2,5,0.95)_100%)]" />

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="flex flex-col items-center gap-2"
        >
          <span className="font-body text-xs tracking-widest text-muted-foreground">SCROLL</span>
          <div className="h-8 w-px bg-gradient-to-b from-primary to-transparent" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default SpaceHero;