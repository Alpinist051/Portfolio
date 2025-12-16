import { Suspense, useRef, useMemo } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import * as THREE from "three";
import { motion } from "framer-motion";
import faceImage from "@/assets/scientist-hero.png";

// Main portrait with 3D depth effect
const Portrait3D = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  
  const texture = useLoader(THREE.TextureLoader, faceImage);
  
  // Calculate aspect ratio from texture
  const aspect = useMemo(() => {
    if (texture.image) {
      return texture.image.width / texture.image.height;
    }
    return 1;
  }, [texture]);
  
  const height = 4.5;
  const width = height * aspect;
  
  useFrame((state) => {
    if (meshRef.current) {
      // Subtle breathing/presence animation
      meshRef.current.scale.x = 1 + Math.sin(state.clock.elapsedTime * 0.8) * 0.008;
      meshRef.current.scale.y = 1 + Math.sin(state.clock.elapsedTime * 0.5) * 0.005;
    }
    if (glowRef.current) {
      glowRef.current.scale.x = 1.1 + Math.sin(state.clock.elapsedTime * 0.6) * 0.02;
      glowRef.current.scale.y = 1.1 + Math.sin(state.clock.elapsedTime * 0.4) * 0.015;
    }
  });

  return (
    <group position={[0, 0.2, 0]}>
      {/* Back glow layer */}
      <mesh ref={glowRef} position={[0, 0, -0.1]}>
        <planeGeometry args={[width * 1.3, height * 1.3]} />
        <meshBasicMaterial 
          color="#ffffff"
          transparent
          opacity={0.08}
        />
      </mesh>
      
      {/* Magenta rim glow - left */}
      <mesh position={[-width * 0.45, 0, -0.05]}>
        <planeGeometry args={[width * 0.3, height * 1.1]} />
        <meshBasicMaterial 
          color="#ff00aa"
          transparent
          opacity={0.15}
        />
      </mesh>
      
      {/* Cyan rim glow - right */}
      <mesh position={[width * 0.45, 0, -0.05]}>
        <planeGeometry args={[width * 0.3, height * 1.1]} />
        <meshBasicMaterial 
          color="#00d4ff"
          transparent
          opacity={0.15}
        />
      </mesh>
      
      {/* Main portrait */}
      <mesh ref={meshRef}>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial 
          map={texture}
          transparent
          side={THREE.FrontSide}
          emissive="#ffffff"
          emissiveIntensity={0.05}
        />
      </mesh>
    </group>
  );
};

// Camera that rotates around the subject
const RotatingCamera = () => {
  const { camera } = useThree();
  
  useFrame((state) => {
    const time = state.clock.elapsedTime;
    const radius = 6;
    const rotationSpeed = 0.12;
    
    // Smooth orbital camera movement
    camera.position.x = Math.sin(time * rotationSpeed) * radius * 0.4;
    camera.position.z = 4 + Math.cos(time * rotationSpeed) * radius * 0.15;
    camera.position.y = 0.3 + Math.sin(time * 0.2) * 0.2;
    
    camera.lookAt(0, 0.2, 0);
  });
  
  return null;
};

// Spotlight beam visualization
const SpotlightBeam = ({ position, color, intensity = 1 }: { position: [number, number, number], color: string, intensity?: number }) => {
  const coneRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (coneRef.current && coneRef.current.material instanceof THREE.MeshBasicMaterial) {
      coneRef.current.material.opacity = 0.03 + Math.sin(state.clock.elapsedTime * 0.5 + position[0]) * 0.015;
    }
  });
  
  return (
    <group position={position}>
      <spotLight
        position={[0, 0, 0]}
        target-position={[0, 0, 0]}
        angle={0.5}
        penumbra={0.8}
        intensity={intensity * 2}
        color={color}
        distance={15}
      />
      {/* Visible light cone */}
      <mesh 
        ref={coneRef} 
        position={[0, -4, 0]} 
        rotation={[0, 0, 0]}
      >
        <coneGeometry args={[3, 8, 32, 1, true]} />
        <meshBasicMaterial 
          color={color} 
          transparent 
          opacity={0.04}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
};

// Floating particles
const Particles = () => {
  const particlesRef = useRef<THREE.Points>(null);
  
  const particleCount = 100;
  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 8;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 6 - 1;
    }
    return pos;
  }, []);
  
  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.02;
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3 + 1] += Math.sin(state.clock.elapsedTime + i) * 0.001;
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });
  
  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        color="#ffffff"
        transparent
        opacity={0.4}
        sizeAttenuation
      />
    </points>
  );
};

// Reflective floor
const Floor = () => {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.3, 0]} receiveShadow>
      <planeGeometry args={[30, 30]} />
      <meshStandardMaterial 
        color="#030305"
        roughness={0.15}
        metalness={0.9}
      />
    </mesh>
  );
};

const SpaceHero = () => {
  return (
    <section className="relative h-screen w-full overflow-hidden bg-[#020205]">
      <Canvas
        shadows
        camera={{ position: [0, 0.3, 5], fov: 40 }}
        className="absolute inset-0"
        gl={{ antialias: true, alpha: true }}
      >
        <fog attach="fog" args={['#020205', 8, 25]} />
        
        <Suspense fallback={null}>
          <RotatingCamera />
          
          {/* Main center spotlight */}
          <SpotlightBeam position={[0, 6, 2]} color="#fffaf5" intensity={1.5} />
          
          {/* Left magenta accent */}
          <SpotlightBeam position={[-4, 5, 1]} color="#ff00aa" intensity={1} />
          
          {/* Right cyan accent */}
          <SpotlightBeam position={[4, 5, 1]} color="#00d4ff" intensity={1} />
          
          {/* Back rim light */}
          <spotLight position={[0, 3, -3]} intensity={2} color="#ffd700" angle={0.6} />
          
          <ambientLight intensity={0.15} />
          
          <Portrait3D />
          <Particles />
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