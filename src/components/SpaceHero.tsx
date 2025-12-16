import { Suspense, useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { useGLTF, Environment } from "@react-three/drei";
import * as THREE from "three";
import { motion } from "framer-motion";
import faceImage from "@/assets/scientist-hero.png";

// 3D Human model with face decal
const HumanModel = () => {
  const groupRef = useRef<THREE.Group>(null);
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);
  
  // Load local model
  const { scene, animations } = useGLTF('/models/human.glb');
  
  // Load face texture
  const faceTexture = useLoader(THREE.TextureLoader, faceImage);
  
  // Clone and setup the scene
  const clonedScene = useMemo(() => {
    const clone = scene.clone();
    clone.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    return clone;
  }, [scene]);
  
  // Setup animations
  useEffect(() => {
    if (animations.length > 0) {
      mixerRef.current = new THREE.AnimationMixer(clonedScene);
      const action = mixerRef.current.clipAction(animations[0]);
      action.play();
    }
    return () => {
      mixerRef.current?.stopAllAction();
    };
  }, [animations, clonedScene]);
  
  // Animation loop
  useFrame((state, delta) => {
    // Update animation mixer
    mixerRef.current?.update(delta);
    
    if (groupRef.current) {
      // Subtle idle movement
      groupRef.current.position.y = -1.5 + Math.sin(state.clock.elapsedTime * 0.5) * 0.02;
    }
  });

  return (
    <group ref={groupRef} position={[0, -1.5, 0]} scale={[1.2, 1.2, 1.2]}>
      <primitive object={clonedScene} />
      
      {/* Face decal overlay on head */}
      <mesh position={[0, 1.7, 0.15]} rotation={[0, 0, 0]}>
        <planeGeometry args={[0.35, 0.45]} />
        <meshBasicMaterial 
          map={faceTexture} 
          transparent 
          opacity={0.92}
          depthWrite={false}
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
    const radius = 4;
    const rotationSpeed = 0.12;
    
    camera.position.x = Math.sin(time * rotationSpeed) * radius * 0.4;
    camera.position.z = 3.5 + Math.cos(time * rotationSpeed) * radius * 0.15;
    camera.position.y = 0.8 + Math.sin(time * 0.2) * 0.1;
    
    camera.lookAt(0, 0.5, 0);
  });
  
  return null;
};

// Spotlight beams
const SpotlightBeams = () => {
  return (
    <>
      {/* Main spotlight from above */}
      <spotLight
        position={[0, 8, 3]}
        angle={0.4}
        penumbra={0.6}
        intensity={3}
        color="#fffaf5"
        castShadow
      />
      
      {/* Left magenta accent */}
      <spotLight
        position={[-5, 5, 2]}
        angle={0.5}
        penumbra={0.8}
        intensity={2}
        color="#ff00aa"
      />
      
      {/* Right cyan accent */}
      <spotLight
        position={[5, 5, 2]}
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
        intensity={2.5}
        color="#ffd700"
      />
      
      <ambientLight intensity={0.2} />
    </>
  );
};

// Visible light cone effects
const LightCones = () => {
  const cone1Ref = useRef<THREE.Mesh>(null);
  const cone2Ref = useRef<THREE.Mesh>(null);
  const cone3Ref = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    const time = state.clock.elapsedTime;
    if (cone1Ref.current?.material instanceof THREE.MeshBasicMaterial) {
      cone1Ref.current.material.opacity = 0.04 + Math.sin(time * 0.5) * 0.015;
    }
    if (cone2Ref.current?.material instanceof THREE.MeshBasicMaterial) {
      cone2Ref.current.material.opacity = 0.03 + Math.sin(time * 0.6 + 1) * 0.01;
    }
    if (cone3Ref.current?.material instanceof THREE.MeshBasicMaterial) {
      cone3Ref.current.material.opacity = 0.03 + Math.sin(time * 0.7 + 2) * 0.01;
    }
  });
  
  return (
    <>
      {/* Main light cone */}
      <mesh ref={cone1Ref} position={[0, 4, 1]} rotation={[0.2, 0, 0]}>
        <coneGeometry args={[2.5, 8, 32, 1, true]} />
        <meshBasicMaterial 
          color="#fffaf5" 
          transparent 
          opacity={0.04}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      
      {/* Left magenta cone */}
      <mesh ref={cone2Ref} position={[-3, 3, 0]} rotation={[0.3, 0.4, 0]}>
        <coneGeometry args={[2, 6, 32, 1, true]} />
        <meshBasicMaterial 
          color="#ff00aa" 
          transparent 
          opacity={0.03}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      
      {/* Right cyan cone */}
      <mesh ref={cone3Ref} position={[3, 3, 0]} rotation={[0.3, -0.4, 0]}>
        <coneGeometry args={[2, 6, 32, 1, true]} />
        <meshBasicMaterial 
          color="#00d4ff" 
          transparent 
          opacity={0.03}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
    </>
  );
};

// Floating dust particles
const Particles = () => {
  const particlesRef = useRef<THREE.Points>(null);
  
  const particleCount = 150;
  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 1] = Math.random() * 6 - 1;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8 - 1;
    }
    return pos;
  }, []);
  
  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.015;
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
        size={0.025}
        color="#ffffff"
        transparent
        opacity={0.5}
        sizeAttenuation
      />
    </points>
  );
};

// Reflective floor
const Floor = () => {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]} receiveShadow>
      <planeGeometry args={[30, 30]} />
      <meshStandardMaterial 
        color="#030305"
        roughness={0.1}
        metalness={0.95}
      />
    </mesh>
  );
};

// Loading fallback
const Loader = () => {
  return (
    <mesh>
      <sphereGeometry args={[0.3, 16, 16]} />
      <meshBasicMaterial color="#00d4ff" wireframe />
    </mesh>
  );
};

const SpaceHero = () => {
  return (
    <section className="relative h-screen w-full overflow-hidden bg-[#020205]">
      <Canvas
        shadows
        camera={{ position: [0, 0.8, 4], fov: 45 }}
        className="absolute inset-0"
        gl={{ antialias: true, alpha: true }}
      >
        <fog attach="fog" args={['#020205', 6, 20]} />
        
        <Suspense fallback={<Loader />}>
          <RotatingCamera />
          <SpotlightBeams />
          <LightCones />
          <HumanModel />
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

// Preload the model
useGLTF.preload('/models/human.glb');

export default SpaceHero;