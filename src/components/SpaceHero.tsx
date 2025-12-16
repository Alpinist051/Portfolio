import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Text, Billboard, Environment } from "@react-three/drei";
import { useRef, useMemo, Suspense, forwardRef } from "react";
import * as THREE from "three";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

// Detailed 3D Scientist Character
const ScientistModel = () => {
  const groupRef = useRef<THREE.Group>(null);
  
  // Subtle breathing animation
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.02 - 1.2;
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.02;
    }
  });

  return (
    <group ref={groupRef} position={[0, -1.2, 2]} scale={1.1}>
      {/* Head */}
      <mesh position={[0, 1.65, 0]}>
        <sphereGeometry args={[0.22, 32, 32]} />
        <meshStandardMaterial color="#d4a574" roughness={0.7} metalness={0.1} />
      </mesh>
      
      {/* Hair - dark brown, styled back */}
      <mesh position={[0, 1.78, -0.05]}>
        <sphereGeometry args={[0.2, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.6]} />
        <meshStandardMaterial color="#1a1209" roughness={0.9} />
      </mesh>
      <mesh position={[0, 1.72, -0.12]}>
        <boxGeometry args={[0.35, 0.1, 0.15]} />
        <meshStandardMaterial color="#1a1209" roughness={0.9} />
      </mesh>
      {/* Side hair */}
      <mesh position={[-0.18, 1.68, -0.02]}>
        <boxGeometry args={[0.06, 0.15, 0.18]} />
        <meshStandardMaterial color="#1a1209" roughness={0.9} />
      </mesh>
      <mesh position={[0.18, 1.68, -0.02]}>
        <boxGeometry args={[0.06, 0.15, 0.18]} />
        <meshStandardMaterial color="#1a1209" roughness={0.9} />
      </mesh>
      
      {/* Ears */}
      <mesh position={[-0.22, 1.65, 0]}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial color="#d4a574" roughness={0.7} />
      </mesh>
      <mesh position={[0.22, 1.65, 0]}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial color="#d4a574" roughness={0.7} />
      </mesh>
      
      {/* Glasses frame */}
      <mesh position={[-0.08, 1.68, 0.18]}>
        <torusGeometry args={[0.06, 0.008, 16, 32]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0.08, 1.68, 0.18]}>
        <torusGeometry args={[0.06, 0.008, 16, 32]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Glasses lenses */}
      <mesh position={[-0.08, 1.68, 0.19]}>
        <circleGeometry args={[0.055, 32]} />
        <meshStandardMaterial color="#87ceeb" transparent opacity={0.3} metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[0.08, 1.68, 0.19]}>
        <circleGeometry args={[0.055, 32]} />
        <meshStandardMaterial color="#87ceeb" transparent opacity={0.3} metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Glasses bridge */}
      <mesh position={[0, 1.68, 0.18]}>
        <boxGeometry args={[0.04, 0.01, 0.01]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Glasses arms */}
      <mesh position={[-0.16, 1.68, 0.08]} rotation={[0, 0.3, 0]}>
        <boxGeometry args={[0.12, 0.008, 0.008]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0.16, 1.68, 0.08]} rotation={[0, -0.3, 0]}>
        <boxGeometry args={[0.12, 0.008, 0.008]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* Neck */}
      <mesh position={[0, 1.4, 0]}>
        <cylinderGeometry args={[0.08, 0.1, 0.15, 16]} />
        <meshStandardMaterial color="#d4a574" roughness={0.7} />
      </mesh>
      
      {/* Lab coat - torso */}
      <mesh position={[0, 1.05, 0]}>
        <cylinderGeometry args={[0.22, 0.28, 0.6, 16]} />
        <meshStandardMaterial color="#f0f0f0" roughness={0.6} />
      </mesh>
      
      {/* Lab coat collar */}
      <mesh position={[-0.1, 1.3, 0.08]} rotation={[0.3, 0.2, 0.4]}>
        <boxGeometry args={[0.12, 0.15, 0.03]} />
        <meshStandardMaterial color="#f5f5f5" roughness={0.6} />
      </mesh>
      <mesh position={[0.1, 1.3, 0.08]} rotation={[0.3, -0.2, -0.4]}>
        <boxGeometry args={[0.12, 0.15, 0.03]} />
        <meshStandardMaterial color="#f5f5f5" roughness={0.6} />
      </mesh>
      
      {/* Shirt underneath - visible at neck */}
      <mesh position={[0, 1.28, 0.06]}>
        <boxGeometry args={[0.12, 0.08, 0.02]} />
        <meshStandardMaterial color="#2563eb" roughness={0.5} />
      </mesh>
      
      {/* Lab coat lower part */}
      <mesh position={[0, 0.55, 0]}>
        <cylinderGeometry args={[0.28, 0.32, 0.5, 16]} />
        <meshStandardMaterial color="#f0f0f0" roughness={0.6} />
      </mesh>
      
      {/* Lab coat tail/back */}
      <mesh position={[0, 0.2, -0.1]}>
        <boxGeometry args={[0.5, 0.6, 0.08]} />
        <meshStandardMaterial color="#e8e8e8" roughness={0.6} />
      </mesh>
      
      {/* Pocket on lab coat */}
      <mesh position={[-0.15, 1, 0.22]}>
        <boxGeometry args={[0.1, 0.12, 0.02]} />
        <meshStandardMaterial color="#e0e0e0" roughness={0.7} />
      </mesh>
      {/* Pen in pocket */}
      <mesh position={[-0.15, 1.05, 0.24]}>
        <cylinderGeometry args={[0.008, 0.008, 0.08, 8]} />
        <meshStandardMaterial color="#1a1aff" roughness={0.3} metalness={0.5} />
      </mesh>
      
      {/* ID badge */}
      <mesh position={[0.18, 1.1, 0.23]}>
        <boxGeometry args={[0.06, 0.08, 0.01]} />
        <meshStandardMaterial color="#ffffff" roughness={0.5} />
      </mesh>
      <mesh position={[0.18, 1.15, 0.23]}>
        <cylinderGeometry args={[0.015, 0.015, 0.02, 8]} />
        <meshStandardMaterial color="#c0c0c0" metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* Arms - left */}
      <group position={[-0.32, 1.15, 0]} rotation={[0.1, 0, 0.15]}>
        <mesh position={[0, -0.15, 0]}>
          <cylinderGeometry args={[0.07, 0.06, 0.35, 12]} />
          <meshStandardMaterial color="#f0f0f0" roughness={0.6} />
        </mesh>
        <mesh position={[0, -0.4, 0.05]} rotation={[0.3, 0, 0]}>
          <cylinderGeometry args={[0.055, 0.05, 0.3, 12]} />
          <meshStandardMaterial color="#f0f0f0" roughness={0.6} />
        </mesh>
        {/* Hand */}
        <mesh position={[0, -0.58, 0.12]}>
          <sphereGeometry args={[0.045, 16, 16]} />
          <meshStandardMaterial color="#d4a574" roughness={0.7} />
        </mesh>
      </group>
      
      {/* Arms - right */}
      <group position={[0.32, 1.15, 0]} rotation={[0.1, 0, -0.15]}>
        <mesh position={[0, -0.15, 0]}>
          <cylinderGeometry args={[0.07, 0.06, 0.35, 12]} />
          <meshStandardMaterial color="#f0f0f0" roughness={0.6} />
        </mesh>
        <mesh position={[0, -0.4, 0.05]} rotation={[0.3, 0, 0]}>
          <cylinderGeometry args={[0.055, 0.05, 0.3, 12]} />
          <meshStandardMaterial color="#f0f0f0" roughness={0.6} />
        </mesh>
        {/* Hand */}
        <mesh position={[0, -0.58, 0.12]}>
          <sphereGeometry args={[0.045, 16, 16]} />
          <meshStandardMaterial color="#d4a574" roughness={0.7} />
        </mesh>
      </group>
      
      {/* Pants */}
      <mesh position={[-0.1, 0.05, 0]}>
        <cylinderGeometry args={[0.1, 0.09, 0.5, 12]} />
        <meshStandardMaterial color="#1a1a2e" roughness={0.8} />
      </mesh>
      <mesh position={[0.1, 0.05, 0]}>
        <cylinderGeometry args={[0.1, 0.09, 0.5, 12]} />
        <meshStandardMaterial color="#1a1a2e" roughness={0.8} />
      </mesh>
      
      {/* Lower legs */}
      <mesh position={[-0.1, -0.35, 0]}>
        <cylinderGeometry args={[0.08, 0.07, 0.4, 12]} />
        <meshStandardMaterial color="#1a1a2e" roughness={0.8} />
      </mesh>
      <mesh position={[0.1, -0.35, 0]}>
        <cylinderGeometry args={[0.08, 0.07, 0.4, 12]} />
        <meshStandardMaterial color="#1a1a2e" roughness={0.8} />
      </mesh>
      
      {/* Shoes */}
      <mesh position={[-0.1, -0.6, 0.03]}>
        <boxGeometry args={[0.1, 0.06, 0.18]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.5} metalness={0.3} />
      </mesh>
      <mesh position={[0.1, -0.6, 0.03]}>
        <boxGeometry args={[0.1, 0.06, 0.18]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.5} metalness={0.3} />
      </mesh>
    </group>
  );
};

// Exhibition Hall Environment
const ExhibitionHall = () => {
  return (
    <group>
      {/* Floor - polished dark surface */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.8, 0]} receiveShadow>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial 
          color="#0a0a12" 
          metalness={0.95} 
          roughness={0.15}
        />
      </mesh>
      
      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 8, 0]}>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#050508" roughness={1} />
      </mesh>
      
      {/* Back wall */}
      <mesh position={[0, 3, -12]}>
        <planeGeometry args={[50, 15]} />
        <meshStandardMaterial color="#080810" roughness={0.9} />
      </mesh>
      
      {/* Side walls */}
      <mesh position={[-15, 3, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[30, 15]} />
        <meshStandardMaterial color="#060610" roughness={0.9} />
      </mesh>
      <mesh position={[15, 3, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[30, 15]} />
        <meshStandardMaterial color="#060610" roughness={0.9} />
      </mesh>
      
      {/* Exhibition display stands */}
      {[-6, -3, 0, 3, 6].map((x, i) => (
        <group key={i} position={[x, -1.3, -6]}>
          <mesh>
            <cylinderGeometry args={[0.4, 0.5, 1, 16]} />
            <meshStandardMaterial color="#101018" metalness={0.7} roughness={0.3} />
          </mesh>
          <pointLight 
            position={[0, 1, 0]} 
            intensity={0.3} 
            color={["#ff00aa", "#00ff88", "#00d4ff", "#ffaa00", "#aa00ff"][i]} 
            distance={3} 
          />
        </group>
      ))}
    </group>
  );
};

// Curved screen that wraps around the viewer
const CurvedScreen = forwardRef<THREE.Group, { 
  angle: number;
  color: string;
  content: string;
  subtext?: string;
  radius?: number;
  height?: number;
}>(({ angle, color, content, subtext, radius = 8, height = 3 }, ref) => {
  const x = Math.sin(angle) * radius;
  const z = -Math.cos(angle) * radius;
  const rotationY = angle;

  return (
    <Float speed={0.5} rotationIntensity={0.02} floatIntensity={0.1}>
      <group ref={ref} position={[x, 0, z]} rotation={[0, rotationY, 0]}>
        {/* Screen panel */}
        <mesh>
          <planeGeometry args={[4, height]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.12}
            side={THREE.DoubleSide}
          />
        </mesh>
        {/* Border glow */}
        <mesh position={[0, 0, -0.01]}>
          <planeGeometry args={[4.1, height + 0.1]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.3}
            side={THREE.DoubleSide}
          />
        </mesh>
        {/* Inner content area */}
        <mesh position={[0, 0, 0.01]}>
          <planeGeometry args={[3.8, height - 0.2]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.06}
            side={THREE.DoubleSide}
          />
        </mesh>
        {/* Text content */}
        <Billboard>
          <Text
            position={[0, subtext ? 0.3 : 0, 0.1]}
            fontSize={0.4}
            color={color}
            anchorX="center"
            anchorY="middle"
            maxWidth={3.5}
          >
            {content}
          </Text>
        </Billboard>
        {subtext && (
          <Billboard>
            <Text
              position={[0, -0.3, 0.1]}
              fontSize={0.15}
              color={color}
              anchorX="center"
              anchorY="middle"
              maxWidth={3.5}
            >
              {subtext}
            </Text>
          </Billboard>
        )}
        {/* Horizontal lines */}
        <mesh position={[0, height / 2 - 0.15, 0.02]}>
          <planeGeometry args={[3.5, 0.02]} />
          <meshBasicMaterial color={color} transparent opacity={0.5} />
        </mesh>
        <mesh position={[0, -height / 2 + 0.15, 0.02]}>
          <planeGeometry args={[3.5, 0.02]} />
          <meshBasicMaterial color={color} transparent opacity={0.5} />
        </mesh>
        {/* Screen glow light */}
        <pointLight position={[0, 0, 2]} intensity={0.8} color={color} distance={6} />
      </group>
    </Float>
  );
});
CurvedScreen.displayName = "CurvedScreen";

// Bottom row screens
const BottomScreen = forwardRef<THREE.Group, { 
  angle: number;
  color: string;
  content: string;
  radius?: number;
}>(({ angle, color, content, radius = 6 }, ref) => {
  const x = Math.sin(angle) * radius;
  const z = -Math.cos(angle) * radius;
  const rotationY = angle;

  return (
    <Float speed={0.6} rotationIntensity={0.03} floatIntensity={0.15}>
      <group ref={ref} position={[x, -2.2, z]} rotation={[0.25, rotationY, 0]}>
        <mesh>
          <planeGeometry args={[3, 1.8]} />
          <meshBasicMaterial color={color} transparent opacity={0.1} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, 0, -0.01]}>
          <planeGeometry args={[3.1, 1.9]} />
          <meshBasicMaterial color={color} transparent opacity={0.25} side={THREE.DoubleSide} />
        </mesh>
        <Billboard>
          <Text position={[0, 0, 0.1]} fontSize={0.28} color={color} anchorX="center" anchorY="middle">
            {content}
          </Text>
        </Billboard>
        <pointLight position={[0, 0, 1.5]} intensity={0.5} color={color} distance={4} />
      </group>
    </Float>
  );
});
BottomScreen.displayName = "BottomScreen";

// Ambient floating particles in the dark room
const RoomParticles = forwardRef<THREE.Points>((_, ref) => {
  const count = 150;
  const meshRef = useRef<THREE.Points>(null);

  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 30;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 30;
    }
    return positions;
  }, []);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.008;
    }
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={particles} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.02} color="#00d4ff" transparent opacity={0.4} sizeAttenuation blending={THREE.AdditiveBlending} />
    </points>
  );
});
RoomParticles.displayName = "RoomParticles";

function Scene() {
  // Main curved screens arranged in a semicircle
  const mainScreens = [
    { angle: -0.6, color: "#ff00aa", content: "FULL STACK", subtext: "React • Node.js • Cloud" },
    { angle: -0.3, color: "#00ff88", content: "DATA SYSTEMS", subtext: "Analytics • Pipelines" },
    { angle: 0, color: "#00d4ff", content: "AI/ML SOLUTIONS", subtext: "Neural Networks • LLMs • Deep Learning" },
    { angle: 0.3, color: "#ffaa00", content: "MLOPS", subtext: "Kubernetes • Docker" },
    { angle: 0.6, color: "#aa00ff", content: "CLOUD INFRA", subtext: "AWS • Scalable Systems" },
  ];

  // Bottom row screens
  const bottomScreens = [
    { angle: -0.45, color: "#ff6600", content: "RAG SYSTEMS" },
    { angle: -0.15, color: "#00ffff", content: "LLM FINE-TUNING" },
    { angle: 0.15, color: "#ff44aa", content: "MULTI-AGENT AI" },
    { angle: 0.45, color: "#88ff44", content: "NEURAL NETS" },
  ];

  return (
    <>
      {/* Exhibition hall lighting - dramatic and subtle */}
      <ambientLight intensity={0.03} color="#0a1020" />
      
      {/* Main spotlight on scientist from above */}
      <spotLight
        position={[0, 6, 4]}
        angle={0.4}
        penumbra={0.8}
        intensity={1.5}
        color="#ffffff"
        castShadow
        target-position={[0, 0, 2]}
      />
      
      {/* Rim lights for dramatic effect */}
      <spotLight
        position={[-4, 3, 0]}
        angle={0.6}
        penumbra={1}
        intensity={0.8}
        color="#ff00aa"
      />
      <spotLight
        position={[4, 3, 0]}
        angle={0.6}
        penumbra={1}
        intensity={0.8}
        color="#00ff88"
      />
      
      {/* Back light */}
      <pointLight position={[0, 2, -2]} intensity={0.3} color="#00d4ff" />
      
      {/* Exhibition hall environment */}
      <ExhibitionHall />
      
      {/* 3D Scientist Model */}
      <ScientistModel />
      
      {/* Subtle dust particles */}
      <RoomParticles />
      
      {/* Main curved screen array */}
      {mainScreens.map((screen, i) => (
        <CurvedScreen key={i} {...screen} />
      ))}
      
      {/* Bottom screens */}
      {bottomScreens.map((screen, i) => (
        <BottomScreen key={i} {...screen} />
      ))}

      {/* Fog for atmosphere */}
      <fog attach="fog" args={["#020208", 4, 22]} />
    </>
  );
}

const SpaceHero = () => {
  return (
    <section className="relative h-screen w-full overflow-hidden bg-[#020208]">
      {/* Three.js Canvas - Exhibition hall with scientist */}
      <div className="absolute inset-0">
        <Canvas
          camera={{ position: [0, 0.5, 6], fov: 60 }}
          gl={{ antialias: true, alpha: false }}
          shadows
        >
          <Suspense fallback={null}>
            <Scene />
          </Suspense>
        </Canvas>
      </div>

      {/* Vignette effect */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(2,2,8,0.4)_50%,rgba(2,2,8,0.9)_100%)]" />

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

      {/* Scanlines */}
      <div className="scanlines pointer-events-none absolute inset-0 opacity-30" />
    </section>
  );
};

export default SpaceHero;
