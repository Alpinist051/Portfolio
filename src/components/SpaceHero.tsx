import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Text, Billboard, MeshReflectorMaterial } from "@react-three/drei";
import { useRef, useMemo, Suspense } from "react";
import * as THREE from "three";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

// Elegant Stage Floor with reflections
const StageFloor = () => {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
      <planeGeometry args={[40, 30]} />
      <MeshReflectorMaterial
        blur={[300, 100]}
        resolution={1024}
        mixBlur={1}
        mixStrength={50}
        roughness={0.7}
        depthScale={1.2}
        minDepthThreshold={0.4}
        maxDepthThreshold={1.4}
        color="#0a0a0f"
        metalness={0.8}
        mirror={0.5}
      />
    </mesh>
  );
};

// Stage Curtains
const Curtain = ({ position, rotation = [0, 0, 0], color = "#1a0a15" }: { 
  position: [number, number, number]; 
  rotation?: [number, number, number];
  color?: string;
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      // Subtle curtain movement
      meshRef.current.position.x = position[0] + Math.sin(state.clock.elapsedTime * 0.3) * 0.02;
    }
  });

  return (
    <mesh ref={meshRef} position={position} rotation={rotation} castShadow>
      <planeGeometry args={[8, 12, 20, 40]} />
      <meshStandardMaterial 
        color={color} 
        roughness={0.9} 
        metalness={0.1}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

// Animated Sweeping Spotlight Beam
const SweepingSpotlight = ({ 
  basePosition, 
  color, 
  speed = 0.5, 
  swingAngle = 0.6,
  phase = 0 
}: {
  basePosition: [number, number, number];
  color: string;
  speed?: number;
  swingAngle?: number;
  phase?: number;
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const beamRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      const swing = Math.sin(state.clock.elapsedTime * speed + phase) * swingAngle;
      groupRef.current.rotation.z = swing;
    }
    if (beamRef.current) {
      // Pulse the beam opacity
      const material = beamRef.current.material as THREE.MeshBasicMaterial;
      material.opacity = 0.08 + Math.sin(state.clock.elapsedTime * 2 + phase) * 0.03;
    }
  });

  return (
    <group position={basePosition}>
      {/* Spotlight fixture */}
      <mesh>
        <cylinderGeometry args={[0.2, 0.3, 0.5, 16]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.2} />
      </mesh>
      {/* Lens glow */}
      <mesh position={[0, -0.3, 0]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.8} />
      </mesh>
      
      {/* Animated beam group */}
      <group ref={groupRef}>
        {/* Light cone beam - visible volumetric effect */}
        <mesh ref={beamRef} position={[0, -6, 0]} rotation={[0, 0, 0]}>
          <coneGeometry args={[3, 12, 32, 1, true]} />
          <meshBasicMaterial 
            color={color} 
            transparent 
            opacity={0.1} 
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
        {/* Inner bright core */}
        <mesh position={[0, -6, 0]}>
          <coneGeometry args={[1.5, 12, 32, 1, true]} />
          <meshBasicMaterial 
            color={color} 
            transparent 
            opacity={0.15} 
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
        {/* The actual spotlight */}
        <spotLight
          position={[0, -0.5, 0]}
          angle={0.4}
          penumbra={0.9}
          intensity={2}
          color={color}
          distance={15}
          castShadow
        />
      </group>
    </group>
  );
};

// Elegant Podium/Lectern
const Podium = () => {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      // Subtle hover animation
      groupRef.current.position.y = -1.3 + Math.sin(state.clock.elapsedTime * 0.8) * 0.02;
    }
  });

  return (
    <group ref={groupRef} position={[0, -1.3, 0]}>
      {/* Main podium body */}
      <mesh position={[0, 0.4, 0]}>
        <boxGeometry args={[0.8, 1.2, 0.5]} />
        <meshStandardMaterial color="#0a0a12" metalness={0.7} roughness={0.3} />
      </mesh>
      
      {/* Top surface - angled reading surface */}
      <mesh position={[0, 1.05, 0.05]} rotation={[-0.2, 0, 0]}>
        <boxGeometry args={[0.85, 0.05, 0.55]} />
        <meshStandardMaterial color="#0d0d15" metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* Gold trim - top */}
      <mesh position={[0, 1, 0.28]}>
        <boxGeometry args={[0.82, 0.03, 0.03]} />
        <meshStandardMaterial color="#c9a227" metalness={0.95} roughness={0.1} />
      </mesh>
      
      {/* Gold trim - front vertical */}
      <mesh position={[0, 0.4, 0.26]}>
        <boxGeometry args={[0.03, 1.1, 0.03]} />
        <meshStandardMaterial color="#c9a227" metalness={0.95} roughness={0.1} />
      </mesh>
      
      {/* Side gold accents */}
      <mesh position={[-0.38, 0.4, 0.1]}>
        <boxGeometry args={[0.03, 0.8, 0.03]} />
        <meshStandardMaterial color="#c9a227" metalness={0.95} roughness={0.1} />
      </mesh>
      <mesh position={[0.38, 0.4, 0.1]}>
        <boxGeometry args={[0.03, 0.8, 0.03]} />
        <meshStandardMaterial color="#c9a227" metalness={0.95} roughness={0.1} />
      </mesh>
      
      {/* Base */}
      <mesh position={[0, -0.25, 0]}>
        <boxGeometry args={[1, 0.1, 0.7]} />
        <meshStandardMaterial color="#080810" metalness={0.6} roughness={0.4} />
      </mesh>
      
      {/* Microphone */}
      <group position={[0.25, 1.3, 0.1]}>
        <mesh>
          <cylinderGeometry args={[0.015, 0.015, 0.4, 8]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.22, 0]}>
          <sphereGeometry args={[0.04, 16, 16]} />
          <meshStandardMaterial color="#2a2a2a" metalness={0.8} roughness={0.3} />
        </mesh>
        {/* Mic light indicator */}
        <mesh position={[0, 0.15, 0.02]}>
          <sphereGeometry args={[0.008, 8, 8]} />
          <meshBasicMaterial color="#00ff00" />
        </mesh>
      </group>
      
      {/* Glowing logo/emblem on front */}
      <mesh position={[0, 0.5, 0.26]}>
        <circleGeometry args={[0.15, 32]} />
        <meshBasicMaterial color="#00d4ff" transparent opacity={0.3} />
      </mesh>
      <mesh position={[0, 0.5, 0.265]}>
        <ringGeometry args={[0.12, 0.15, 32]} />
        <meshBasicMaterial color="#00d4ff" transparent opacity={0.6} />
      </mesh>
      
      {/* Podium light */}
      <pointLight position={[0, 1.5, 0.5]} intensity={0.5} color="#fff5e6" distance={3} />
    </group>
  );
};

// Stage Smoke/Haze Effect
const StageHaze = () => {
  const count = 40;
  const meshRef = useRef<THREE.Points>(null);
  
  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      // Spread across the stage floor
      positions[i * 3] = (Math.random() - 0.5) * 18;
      positions[i * 3 + 1] = -1.8 + Math.random() * 0.8;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 12 - 2;
      sizes[i] = 0.5 + Math.random() * 1.5;
    }
    return { positions, sizes };
  }, []);

  useFrame((state) => {
    if (meshRef.current) {
      const positions = meshRef.current.geometry.attributes.position.array as Float32Array;
      
      for (let i = 0; i < count; i++) {
        // Slow drifting movement
        positions[i * 3] += Math.sin(state.clock.elapsedTime * 0.2 + i) * 0.003;
        positions[i * 3 + 1] += Math.sin(state.clock.elapsedTime * 0.3 + i * 0.5) * 0.002;
        positions[i * 3 + 2] += Math.cos(state.clock.elapsedTime * 0.15 + i) * 0.002;
        
        // Reset if drifted too far
        if (positions[i * 3] > 10) positions[i * 3] = -10;
        if (positions[i * 3] < -10) positions[i * 3] = 10;
      }
      meshRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={particles.positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial 
        size={2}
        color="#ffffff"
        transparent
        opacity={0.06}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

// Volumetric haze layer
const HazeLayer = ({ y, opacity = 0.04 }: { y: number; opacity?: number }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.5;
      meshRef.current.position.z = Math.cos(state.clock.elapsedTime * 0.08) * 0.3;
    }
  });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, y, -2]}>
      <planeGeometry args={[25, 20]} />
      <meshBasicMaterial 
        color="#aabbcc"
        transparent 
        opacity={opacity}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

// Stage Spotlight (static)
const StageSpotlight = ({ position, target, color, intensity = 2 }: {
  position: [number, number, number];
  target: [number, number, number];
  color: string;
  intensity?: number;
}) => {
  return (
    <group>
      {/* Spotlight fixture */}
      <mesh position={position}>
        <cylinderGeometry args={[0.15, 0.25, 0.4, 16]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.2} />
      </mesh>
      {/* The light */}
      <spotLight
        position={position}
        target-position={target}
        angle={0.35}
        penumbra={0.8}
        intensity={intensity}
        color={color}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      {/* Light cone visualization */}
      <mesh position={position}>
        <coneGeometry args={[0.1, 0.3, 16, 1, true]} />
        <meshBasicMaterial color={color} transparent opacity={0.3} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
};

// Elegant Arch Frame
const StageArch = () => {
  return (
    <group position={[0, 3, -8]}>
      {/* Main arch top */}
      <mesh position={[0, 4, 0]}>
        <boxGeometry args={[18, 1.5, 0.8]} />
        <meshStandardMaterial color="#0d0d12" metalness={0.6} roughness={0.4} />
      </mesh>
      {/* Decorative trim */}
      <mesh position={[0, 3.1, 0.3]}>
        <boxGeometry args={[17, 0.15, 0.3]} />
        <meshStandardMaterial color="#c9a227" metalness={0.9} roughness={0.2} />
      </mesh>
      {/* Left pillar */}
      <mesh position={[-8.5, -1, 0]}>
        <boxGeometry args={[1, 10, 0.8]} />
        <meshStandardMaterial color="#0d0d12" metalness={0.6} roughness={0.4} />
      </mesh>
      {/* Right pillar */}
      <mesh position={[8.5, -1, 0]}>
        <boxGeometry args={[1, 10, 0.8]} />
        <meshStandardMaterial color="#0d0d12" metalness={0.6} roughness={0.4} />
      </mesh>
      {/* Gold accents on pillars */}
      <mesh position={[-8.5, 3.5, 0.3]}>
        <boxGeometry args={[0.8, 0.2, 0.3]} />
        <meshStandardMaterial color="#c9a227" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[8.5, 3.5, 0.3]}>
        <boxGeometry args={[0.8, 0.2, 0.3]} />
        <meshStandardMaterial color="#c9a227" metalness={0.9} roughness={0.2} />
      </mesh>
    </group>
  );
};

// Floating light particles for atmosphere
const StageParticles = () => {
  const count = 80;
  const meshRef = useRef<THREE.Points>(null);

  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = Math.random() * 8 - 2;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 15 - 3;
    }
    return positions;
  }, []);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.02;
      const positions = meshRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < count; i++) {
        positions[i * 3 + 1] += Math.sin(state.clock.elapsedTime + i) * 0.001;
      }
      meshRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={particles} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial 
        size={0.05} 
        color="#ffd700" 
        transparent 
        opacity={0.6} 
        sizeAttenuation 
        blending={THREE.AdditiveBlending} 
      />
    </points>
  );
};

// Holographic display screens
const HolographicScreen = ({ position, angle, color, content, subtext }: {
  position: [number, number, number];
  angle: number;
  color: string;
  content: string;
  subtext?: string;
}) => {
  return (
    <Float speed={0.8} rotationIntensity={0.02} floatIntensity={0.1}>
      <group position={position} rotation={[0, angle, 0]}>
        {/* Screen panel */}
        <mesh>
          <planeGeometry args={[3.5, 2.5]} />
          <meshBasicMaterial color={color} transparent opacity={0.08} side={THREE.DoubleSide} />
        </mesh>
        {/* Border glow */}
        <mesh position={[0, 0, -0.01]}>
          <planeGeometry args={[3.6, 2.6]} />
          <meshBasicMaterial color={color} transparent opacity={0.25} side={THREE.DoubleSide} />
        </mesh>
        {/* Text */}
        <Billboard>
          <Text
            position={[0, subtext ? 0.2 : 0, 0.05]}
            fontSize={0.35}
            color={color}
            anchorX="center"
            anchorY="middle"
          >
            {content}
          </Text>
        </Billboard>
        {subtext && (
          <Billboard>
            <Text
              position={[0, -0.3, 0.05]}
              fontSize={0.14}
              color={color}
              anchorX="center"
              anchorY="middle"
            >
              {subtext}
            </Text>
          </Billboard>
        )}
        {/* Screen light */}
        <pointLight position={[0, 0, 1]} intensity={0.4} color={color} distance={4} />
      </group>
    </Float>
  );
};

// Main Stage Scene
function StageScene() {
  const screens = [
    { position: [-5, 1, -4] as [number, number, number], angle: 0.4, color: "#00d4ff", content: "AI/ML SOLUTIONS", subtext: "Neural Networks • LLMs" },
    { position: [-2.5, 0.5, -5] as [number, number, number], angle: 0.2, color: "#ff00aa", content: "FULL STACK", subtext: "React • Node.js" },
    { position: [0, 1.2, -6] as [number, number, number], angle: 0, color: "#00ff88", content: "DATA SYSTEMS", subtext: "Analytics • Pipelines" },
    { position: [2.5, 0.5, -5] as [number, number, number], angle: -0.2, color: "#ffaa00", content: "MLOPS", subtext: "Kubernetes • Docker" },
    { position: [5, 1, -4] as [number, number, number], angle: -0.4, color: "#aa00ff", content: "CLOUD INFRA", subtext: "AWS • Scalable" },
  ];

  return (
    <>
      {/* Ambient lighting - very subtle */}
      <ambientLight intensity={0.02} color="#1a1a2e" />
      
      {/* Main center spotlight - warm white */}
      <StageSpotlight 
        position={[0, 8, 2]} 
        target={[0, 0, -2]} 
        color="#fff5e6" 
        intensity={3}
      />
      
      {/* Animated sweeping spotlights */}
      <SweepingSpotlight 
        basePosition={[-5, 9, 3]} 
        color="#ff00aa" 
        speed={0.4}
        swingAngle={0.5}
        phase={0}
      />
      <SweepingSpotlight 
        basePosition={[5, 9, 3]} 
        color="#00d4ff" 
        speed={0.35}
        swingAngle={0.5}
        phase={Math.PI}
      />
      <SweepingSpotlight 
        basePosition={[0, 10, -2]} 
        color="#c9a227" 
        speed={0.25}
        swingAngle={0.4}
        phase={Math.PI / 2}
      />
      
      {/* Side spotlights - colored (static) */}
      <StageSpotlight 
        position={[-6, 7, 0]} 
        target={[-2, 0, -3]} 
        color="#ff00aa" 
        intensity={1.5}
      />
      <StageSpotlight 
        position={[6, 7, 0]} 
        target={[2, 0, -3]} 
        color="#00d4ff" 
        intensity={1.5}
      />
      
      {/* Back lights */}
      <pointLight position={[-8, 4, -6]} intensity={0.5} color="#ff6600" distance={12} />
      <pointLight position={[8, 4, -6]} intensity={0.5} color="#00ff88" distance={12} />
      <pointLight position={[0, 5, -8]} intensity={0.8} color="#c9a227" distance={15} />
      
      {/* Stage floor with reflections */}
      <StageFloor />
      
      {/* Center podium */}
      <Podium />
      
      {/* Stage arch frame */}
      <StageArch />
      
      {/* Curtains - left side */}
      <Curtain position={[-10, 3, -6]} color="#1a0a15" />
      <Curtain position={[-11.5, 3, -5]} color="#150812" />
      
      {/* Curtains - right side */}
      <Curtain position={[10, 3, -6]} color="#1a0a15" />
      <Curtain position={[11.5, 3, -5]} color="#150812" />
      
      {/* Back curtain */}
      <mesh position={[0, 3, -10]}>
        <planeGeometry args={[25, 12]} />
        <meshStandardMaterial color="#0a0510" roughness={0.95} />
      </mesh>
      
      {/* Holographic screens */}
      {screens.map((screen, i) => (
        <HolographicScreen key={i} {...screen} />
      ))}
      
      {/* Stage smoke/haze effect */}
      <StageHaze />
      <HazeLayer y={-1.6} opacity={0.05} />
      <HazeLayer y={-1.4} opacity={0.03} />
      <HazeLayer y={-1.2} opacity={0.02} />
      
      {/* Atmospheric particles */}
      <StageParticles />
      
      {/* Subtle fog */}
      <fog attach="fog" args={["#050508", 8, 30]} />
    </>
  );
}

const SpaceHero = () => {
  return (
    <section className="relative h-screen w-full overflow-hidden bg-[#050508]">
      {/* Three.js Canvas - Elegant Stage */}
      <div className="absolute inset-0">
        <Canvas
          camera={{ position: [0, 1, 8], fov: 55 }}
          gl={{ antialias: true, alpha: false }}
          shadows
        >
          <Suspense fallback={null}>
            <StageScene />
          </Suspense>
        </Canvas>
      </div>

      {/* Subtle vignette */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(5,5,8,0.5)_60%,rgba(5,5,8,0.95)_100%)]" />
      
      {/* Top light beam effect */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-full w-[40%] -translate-x-1/2 bg-[radial-gradient(ellipse_at_top,rgba(255,245,230,0.08)_0%,transparent_50%)]" />

      {/* Content overlay */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="max-w-4xl"
        >
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mb-4 font-body text-sm tracking-[0.3em] text-primary"
          >
            SENIOR AI/ML & FULL STACK DEVELOPER
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="mb-6 font-display text-4xl font-bold leading-tight tracking-wider md:text-6xl lg:text-7xl"
          >
            <span className="text-neon">BUILDING</span>{" "}
            <span className="text-foreground">THE</span>
            <br />
            <span className="text-neon-magenta">FUTURE</span>{" "}
            <span className="text-foreground">OF TECH</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mx-auto mb-8 max-w-2xl font-body text-lg text-muted-foreground md:text-xl"
          >
            6+ years crafting intelligent systems, from neural networks to scalable full-stack solutions.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <a
              href="#contact"
              className="group relative overflow-hidden rounded-lg bg-primary px-8 py-3 font-display text-sm font-semibold tracking-wider text-primary-foreground transition-all hover:shadow-neon"
            >
              <span className="relative z-10">INITIATE CONTACT</span>
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-foreground/20 to-transparent transition-transform group-hover:translate-x-full" />
            </a>
            <Link
              to="/projects"
              className="rounded-lg border border-primary/50 bg-primary/10 px-8 py-3 font-display text-sm font-semibold tracking-wider text-primary transition-all hover:border-primary hover:bg-primary/20"
            >
              VIEW PROJECTS
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
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
      </div>

      {/* Subtle scanlines */}
      <div className="scanlines pointer-events-none absolute inset-0 opacity-20" />
    </section>
  );
};

export default SpaceHero;