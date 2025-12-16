import { Canvas, useFrame } from "@react-three/fiber";
import { MeshReflectorMaterial } from "@react-three/drei";
import { useRef, Suspense } from "react";
import * as THREE from "three";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

// Detailed Human Figure
const HumanFigure = () => {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      // Subtle breathing animation
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.6) * 0.015;
    }
  });

  const skinColor = "#e8c4a0";
  const hairColor = "#1a1209";
  const shirtColor = "#1a1a2e";
  const pantsColor = "#0f0f18";

  return (
    <group ref={groupRef} position={[0, -0.8, 0]} scale={1.3}>
      {/* Head */}
      <mesh position={[0, 1.7, 0]} castShadow>
        <sphereGeometry args={[0.18, 32, 32]} />
        <meshStandardMaterial color={skinColor} roughness={0.6} metalness={0.1} />
      </mesh>
      
      {/* Hair */}
      <mesh position={[0, 1.82, -0.03]}>
        <sphereGeometry args={[0.16, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
        <meshStandardMaterial color={hairColor} roughness={0.9} />
      </mesh>
      <mesh position={[0, 1.76, -0.1]}>
        <boxGeometry args={[0.3, 0.08, 0.12]} />
        <meshStandardMaterial color={hairColor} roughness={0.9} />
      </mesh>
      <mesh position={[-0.15, 1.72, 0]}>
        <boxGeometry args={[0.05, 0.12, 0.14]} />
        <meshStandardMaterial color={hairColor} roughness={0.9} />
      </mesh>
      <mesh position={[0.15, 1.72, 0]}>
        <boxGeometry args={[0.05, 0.12, 0.14]} />
        <meshStandardMaterial color={hairColor} roughness={0.9} />
      </mesh>
      
      {/* Ears */}
      <mesh position={[-0.18, 1.7, 0]}>
        <sphereGeometry args={[0.03, 12, 12]} />
        <meshStandardMaterial color={skinColor} roughness={0.6} />
      </mesh>
      <mesh position={[0.18, 1.7, 0]}>
        <sphereGeometry args={[0.03, 12, 12]} />
        <meshStandardMaterial color={skinColor} roughness={0.6} />
      </mesh>
      
      {/* Neck */}
      <mesh position={[0, 1.48, 0]} castShadow>
        <cylinderGeometry args={[0.06, 0.07, 0.12, 12]} />
        <meshStandardMaterial color={skinColor} roughness={0.6} />
      </mesh>
      
      {/* Torso */}
      <mesh position={[0, 1.15, 0]} castShadow>
        <cylinderGeometry args={[0.18, 0.22, 0.55, 16]} />
        <meshStandardMaterial color={shirtColor} roughness={0.7} metalness={0.1} />
      </mesh>
      
      {/* Shoulders */}
      <mesh position={[-0.22, 1.35, 0]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color={shirtColor} roughness={0.7} />
      </mesh>
      <mesh position={[0.22, 1.35, 0]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color={shirtColor} roughness={0.7} />
      </mesh>
      
      {/* Arms - Left */}
      <group position={[-0.28, 1.25, 0]} rotation={[0.08, 0, 0.12]}>
        <mesh position={[0, -0.15, 0]} castShadow>
          <cylinderGeometry args={[0.055, 0.05, 0.3, 12]} />
          <meshStandardMaterial color={shirtColor} roughness={0.7} />
        </mesh>
        <mesh position={[0, -0.38, 0.03]} rotation={[0.2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.045, 0.04, 0.25, 12]} />
          <meshStandardMaterial color={shirtColor} roughness={0.7} />
        </mesh>
        <mesh position={[0, -0.52, 0.08]}>
          <sphereGeometry args={[0.035, 12, 12]} />
          <meshStandardMaterial color={skinColor} roughness={0.6} />
        </mesh>
      </group>
      
      {/* Arms - Right */}
      <group position={[0.28, 1.25, 0]} rotation={[0.08, 0, -0.12]}>
        <mesh position={[0, -0.15, 0]} castShadow>
          <cylinderGeometry args={[0.055, 0.05, 0.3, 12]} />
          <meshStandardMaterial color={shirtColor} roughness={0.7} />
        </mesh>
        <mesh position={[0, -0.38, 0.03]} rotation={[0.2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.045, 0.04, 0.25, 12]} />
          <meshStandardMaterial color={shirtColor} roughness={0.7} />
        </mesh>
        <mesh position={[0, -0.52, 0.08]}>
          <sphereGeometry args={[0.035, 12, 12]} />
          <meshStandardMaterial color={skinColor} roughness={0.6} />
        </mesh>
      </group>
      
      {/* Lower torso */}
      <mesh position={[0, 0.75, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.18, 0.25, 16]} />
        <meshStandardMaterial color={pantsColor} roughness={0.8} />
      </mesh>
      
      {/* Legs - Left */}
      <mesh position={[-0.08, 0.45, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.07, 0.35, 12]} />
        <meshStandardMaterial color={pantsColor} roughness={0.8} />
      </mesh>
      <mesh position={[-0.08, 0.15, 0]} castShadow>
        <cylinderGeometry args={[0.065, 0.055, 0.3, 12]} />
        <meshStandardMaterial color={pantsColor} roughness={0.8} />
      </mesh>
      
      {/* Legs - Right */}
      <mesh position={[0.08, 0.45, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.07, 0.35, 12]} />
        <meshStandardMaterial color={pantsColor} roughness={0.8} />
      </mesh>
      <mesh position={[0.08, 0.15, 0]} castShadow>
        <cylinderGeometry args={[0.065, 0.055, 0.3, 12]} />
        <meshStandardMaterial color={pantsColor} roughness={0.8} />
      </mesh>
      
      {/* Shoes */}
      <mesh position={[-0.08, -0.02, 0.02]} castShadow>
        <boxGeometry args={[0.08, 0.04, 0.14]} />
        <meshStandardMaterial color="#050508" roughness={0.4} metalness={0.2} />
      </mesh>
      <mesh position={[0.08, -0.02, 0.02]} castShadow>
        <boxGeometry args={[0.08, 0.04, 0.14]} />
        <meshStandardMaterial color="#050508" roughness={0.4} metalness={0.2} />
      </mesh>
    </group>
  );
};

// Dramatic Spotlight Beam
const SpotlightBeam = ({ 
  position, 
  targetY = -2,
  color, 
  intensity = 3,
  angle = 0.3
}: {
  position: [number, number, number];
  targetY?: number;
  color: string;
  intensity?: number;
  angle?: number;
}) => {
  const beamRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (beamRef.current) {
      const material = beamRef.current.material as THREE.MeshBasicMaterial;
      material.opacity = 0.06 + Math.sin(state.clock.elapsedTime * 1.5) * 0.02;
    }
  });

  const beamHeight = position[1] - targetY;
  const beamRadius = Math.tan(angle) * beamHeight;

  return (
    <group position={position}>
      {/* Volumetric light beam */}
      <mesh ref={beamRef} position={[0, -beamHeight / 2, 0]}>
        <coneGeometry args={[beamRadius, beamHeight, 32, 1, true]} />
        <meshBasicMaterial 
          color={color} 
          transparent 
          opacity={0.08}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      
      {/* Inner bright core */}
      <mesh position={[0, -beamHeight / 2, 0]}>
        <coneGeometry args={[beamRadius * 0.4, beamHeight, 32, 1, true]} />
        <meshBasicMaterial 
          color={color} 
          transparent 
          opacity={0.12}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      
      {/* The actual spotlight */}
      <spotLight
        position={[0, 0, 0]}
        angle={angle}
        penumbra={0.8}
        intensity={intensity}
        color={color}
        distance={15}
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
    </group>
  );
};

// Reflective Floor
const Floor = () => {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.85, 0]} receiveShadow>
      <planeGeometry args={[30, 20]} />
      <MeshReflectorMaterial
        blur={[400, 100]}
        resolution={1024}
        mixBlur={1}
        mixStrength={80}
        roughness={0.5}
        depthScale={1.5}
        minDepthThreshold={0.4}
        maxDepthThreshold={1.4}
        color="#080810"
        metalness={0.9}
        mirror={0.6}
      />
    </mesh>
  );
};

// Main Scene
function Scene() {
  return (
    <>
      {/* Very subtle ambient */}
      <ambientLight intensity={0.008} color="#1a1a2e" />
      
      {/* Main spotlight - warm white from above */}
      <SpotlightBeam 
        position={[0, 8, 2]} 
        color="#fff8f0" 
        intensity={4}
        angle={0.25}
      />
      
      {/* Left accent light - magenta/pink */}
      <SpotlightBeam 
        position={[-3, 7, 1]} 
        color="#ff00aa" 
        intensity={2}
        angle={0.35}
      />
      
      {/* Right accent light - cyan */}
      <SpotlightBeam 
        position={[3, 7, 1]} 
        color="#00d4ff" 
        intensity={2}
        angle={0.35}
      />
      
      {/* Back rim light - golden */}
      <spotLight
        position={[0, 4, -3]}
        angle={0.5}
        penumbra={1}
        intensity={1.5}
        color="#ffd700"
        castShadow
      />
      
      {/* Floor */}
      <Floor />
      
      {/* Human Figure */}
      <HumanFigure />
      
      {/* Deep fog */}
      <fog attach="fog" args={["#020205", 5, 20]} />
    </>
  );
}

const SpaceHero = () => {
  return (
    <section className="relative h-screen w-full overflow-hidden bg-[#020205]">
      {/* Three.js Canvas */}
      <div className="absolute inset-0">
        <Canvas
          camera={{ position: [0, 0.5, 4], fov: 50 }}
          gl={{ antialias: true, alpha: false }}
          shadows
        >
          <Suspense fallback={null}>
            <Scene />
          </Suspense>
        </Canvas>
      </div>

      {/* Subtle vignette */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(2,2,5,0.7)_70%,rgba(2,2,5,0.95)_100%)]" />

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
    </section>
  );
};

export default SpaceHero;