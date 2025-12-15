import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Stars, Float, Text } from "@react-three/drei";
import { useRef, useMemo } from "react";
import * as THREE from "three";
import { motion } from "framer-motion";

// Large holographic advertisement screen
function AdScreen({ position, rotation, scale, color, content, subtext }: { 
  position: [number, number, number]; 
  rotation: [number, number, number];
  scale: number;
  color: string;
  content: string;
  subtext?: string;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y += Math.sin(state.clock.elapsedTime * 0.5 + position[0]) * 0.0008;
    }
    if (glowRef.current && glowRef.current.material instanceof THREE.MeshBasicMaterial) {
      const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.1 + 0.9;
      glowRef.current.material.opacity = 0.15 * pulse;
    }
  });

  return (
    <Float speed={0.8} rotationIntensity={0.1} floatIntensity={0.3}>
      <group position={position} rotation={rotation}>
        {/* Main screen */}
        <mesh ref={meshRef} scale={scale}>
          <planeGeometry args={[3.5, 2]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.6}
            transparent
            opacity={0.12}
            side={THREE.DoubleSide}
          />
        </mesh>
        {/* Screen border glow */}
        <mesh ref={glowRef} scale={scale}>
          <planeGeometry args={[3.6, 2.1]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.25}
            side={THREE.DoubleSide}
          />
        </mesh>
        {/* Inner glow */}
        <mesh scale={scale * 0.95}>
          <planeGeometry args={[3.4, 1.9]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.05}
            side={THREE.DoubleSide}
          />
        </mesh>
        {/* Main text */}
        <Text
          position={[0, subtext ? 0.15 : 0, 0.02]}
          fontSize={0.18 * scale}
          color={color}
          anchorX="center"
          anchorY="middle"
          maxWidth={3 * scale}
          font="/fonts/orbitron.woff"
        >
          {content}
        </Text>
        {/* Subtext */}
        {subtext && (
          <Text
            position={[0, -0.25, 0.02]}
            fontSize={0.08 * scale}
            color={color}
            anchorX="center"
            anchorY="middle"
            maxWidth={3 * scale}
            fillOpacity={0.7}
          >
            {subtext}
          </Text>
        )}
        {/* Decorative lines */}
        <mesh position={[0, 0.85 * scale, 0.01]} scale={scale}>
          <planeGeometry args={[2.5, 0.02]} />
          <meshBasicMaterial color={color} transparent opacity={0.4} />
        </mesh>
        <mesh position={[0, -0.85 * scale, 0.01]} scale={scale}>
          <planeGeometry args={[2.5, 0.02]} />
          <meshBasicMaterial color={color} transparent opacity={0.4} />
        </mesh>
      </group>
    </Float>
  );
}

// 3D Human silhouette viewing the ads
function HumanSilhouette() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      // Subtle breathing motion
      groupRef.current.position.y = -2.8 + Math.sin(state.clock.elapsedTime * 0.8) * 0.03;
      // Slight head movement as if looking at screens
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.08;
    }
  });

  return (
    <group ref={groupRef} position={[0, -2.8, 2]}>
      {/* Head */}
      <mesh position={[0, 1.7, 0]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color="#0a0a15" emissive="#00d4ff" emissiveIntensity={0.05} />
      </mesh>
      {/* Neck */}
      <mesh position={[0, 1.45, 0]}>
        <cylinderGeometry args={[0.08, 0.1, 0.15, 8]} />
        <meshStandardMaterial color="#0a0a15" emissive="#00d4ff" emissiveIntensity={0.03} />
      </mesh>
      {/* Torso */}
      <mesh position={[0, 1, 0]}>
        <boxGeometry args={[0.5, 0.7, 0.25]} />
        <meshStandardMaterial color="#0a0a15" emissive="#00d4ff" emissiveIntensity={0.03} />
      </mesh>
      {/* Left shoulder */}
      <mesh position={[-0.35, 1.25, 0]}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshStandardMaterial color="#0a0a15" emissive="#00d4ff" emissiveIntensity={0.03} />
      </mesh>
      {/* Right shoulder */}
      <mesh position={[0.35, 1.25, 0]}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshStandardMaterial color="#0a0a15" emissive="#00d4ff" emissiveIntensity={0.03} />
      </mesh>
      {/* Left arm */}
      <mesh position={[-0.4, 0.95, 0]} rotation={[0, 0, 0.15]}>
        <cylinderGeometry args={[0.06, 0.05, 0.5, 8]} />
        <meshStandardMaterial color="#0a0a15" emissive="#00d4ff" emissiveIntensity={0.03} />
      </mesh>
      {/* Right arm */}
      <mesh position={[0.4, 0.95, 0]} rotation={[0, 0, -0.15]}>
        <cylinderGeometry args={[0.06, 0.05, 0.5, 8]} />
        <meshStandardMaterial color="#0a0a15" emissive="#00d4ff" emissiveIntensity={0.03} />
      </mesh>
      {/* Rim light effect */}
      <pointLight position={[0, 1.5, -0.5]} intensity={0.3} color="#00d4ff" distance={2} />
      <pointLight position={[-0.5, 1.5, 0]} intensity={0.15} color="#ff00aa" distance={1.5} />
      <pointLight position={[0.5, 1.5, 0]} intensity={0.15} color="#00ff88" distance={1.5} />
    </group>
  );
}

// Moving light particles
function LightParticles() {
  const particlesRef = useRef<THREE.Points>(null);
  const count = 300;

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 40;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 40;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 40;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < count; i++) {
        positions[i * 3 + 1] += Math.sin(state.clock.elapsedTime + i) * 0.003;
        positions[i * 3] += Math.cos(state.clock.elapsedTime + i * 0.5) * 0.002;
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        color="#00d4ff"
        transparent
        opacity={0.5}
        sizeAttenuation
      />
    </points>
  );
}

// Camera animation
function CameraRig() {
  const { camera } = useThree();
  
  useFrame((state) => {
    camera.position.x = Math.sin(state.clock.elapsedTime * 0.08) * 0.8;
    camera.position.y = Math.cos(state.clock.elapsedTime * 0.1) * 0.4 + 0.5;
    camera.lookAt(0, 0, -2);
  });

  return null;
}

function Scene() {
  // Larger, more prominent ads arranged around center and bottom
  const screens = [
    // Center main ads
    { position: [0, 1, -8] as [number, number, number], rotation: [0, 0, 0] as [number, number, number], scale: 1.8, color: "#00d4ff", content: "AI/ML SOLUTIONS", subtext: "Neural Networks • Deep Learning • LLMs" },
    { position: [-4, 0.5, -7] as [number, number, number], rotation: [0, 0.35, 0] as [number, number, number], scale: 1.5, color: "#ff00aa", content: "FULL STACK DEV", subtext: "React • Node.js • Cloud Architecture" },
    { position: [4, 0.5, -7] as [number, number, number], rotation: [0, -0.35, 0] as [number, number, number], scale: 1.5, color: "#00ff88", content: "DATA SYSTEMS", subtext: "Pipelines • Analytics • Real-time Processing" },
    
    // Bottom row - larger immersive ads
    { position: [-3, -1.5, -5] as [number, number, number], rotation: [0.1, 0.25, 0] as [number, number, number], scale: 1.3, color: "#ffaa00", content: "NEURAL NETWORKS", subtext: "Custom Model Architecture" },
    { position: [0, -2, -6] as [number, number, number], rotation: [0.15, 0, 0] as [number, number, number], scale: 1.6, color: "#aa00ff", content: "MULTI-AGENT AI", subtext: "Autonomous Orchestration Systems" },
    { position: [3, -1.5, -5] as [number, number, number], rotation: [0.1, -0.25, 0] as [number, number, number], scale: 1.3, color: "#ff6600", content: "RAG SYSTEMS", subtext: "Knowledge Base Integration" },
    
    // Side floating ads
    { position: [-6, 1.5, -9] as [number, number, number], rotation: [0, 0.5, 0] as [number, number, number], scale: 1.2, color: "#00ffff", content: "LLM FINE-TUNING" },
    { position: [6, 1.5, -9] as [number, number, number], rotation: [0, -0.5, 0] as [number, number, number], scale: 1.2, color: "#ff0066", content: "CLOUD SYSTEMS" },
    
    // Background distant ads
    { position: [-5, 3, -12] as [number, number, number], rotation: [0, 0.3, 0.05] as [number, number, number], scale: 1.8, color: "#4488ff", content: "MLOPS PIPELINE" },
    { position: [5, 3, -12] as [number, number, number], rotation: [0, -0.3, -0.05] as [number, number, number], scale: 1.8, color: "#88ff44", content: "KUBERNETES" },
    { position: [0, 4, -14] as [number, number, number], rotation: [-0.1, 0, 0] as [number, number, number], scale: 2, color: "#ff44aa", content: "INNOVATION" },
  ];

  return (
    <>
      <CameraRig />
      <ambientLight intensity={0.08} />
      <pointLight position={[0, 2, 3]} intensity={0.6} color="#00d4ff" />
      <pointLight position={[-5, 3, -5]} intensity={0.4} color="#ff00aa" />
      <pointLight position={[5, -2, -5]} intensity={0.4} color="#00ff88" />
      <pointLight position={[0, -3, 0]} intensity={0.3} color="#aa00ff" />
      
      <Stars
        radius={100}
        depth={50}
        count={6000}
        factor={4}
        saturation={0}
        fade
        speed={0.3}
      />
      
      <LightParticles />
      
      {/* Human silhouette looking at ads */}
      <HumanSilhouette />
      
      {screens.map((screen, i) => (
        <AdScreen key={i} {...screen} />
      ))}

      {/* Atmospheric fog */}
      <fog attach="fog" args={["#050510", 8, 35]} />
    </>
  );
}

const SpaceHero = () => {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Three.js Canvas */}
      <div className="absolute inset-0">
        <Canvas
          camera={{ position: [0, 0, 10], fov: 65 }}
          gl={{ antialias: true, alpha: true }}
        >
          <Scene />
        </Canvas>
      </div>

      {/* Vignette overlay */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(5,5,16,0.4)_70%,rgba(5,5,16,0.8)_100%)]" />

      {/* Bottom gradient for content readability */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />

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
            Transforming complex problems into elegant, production-ready applications.
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
            <a
              href="#projects"
              className="rounded-lg border border-primary/50 bg-primary/10 px-8 py-3 font-display text-sm font-semibold tracking-wider text-primary transition-all hover:border-primary hover:bg-primary/20"
            >
              VIEW PROJECTS
            </a>
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

      {/* Scanlines overlay */}
      <div className="scanlines pointer-events-none absolute inset-0" />
    </section>
  );
};

export default SpaceHero;
