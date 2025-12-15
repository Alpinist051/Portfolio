import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Stars, Float, Text } from "@react-three/drei";
import { useRef, useMemo } from "react";
import * as THREE from "three";
import { motion } from "framer-motion";

// Floating holographic screen component
function HoloScreen({ position, rotation, scale, color, content }: { 
  position: [number, number, number]; 
  rotation: [number, number, number];
  scale: number;
  color: string;
  content: string;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y += Math.sin(state.clock.elapsedTime + position[0]) * 0.001;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
      <group position={position} rotation={rotation}>
        <mesh ref={meshRef} scale={scale}>
          <planeGeometry args={[2, 1.2]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.5}
            transparent
            opacity={0.15}
            side={THREE.DoubleSide}
          />
        </mesh>
        {/* Screen border glow */}
        <mesh scale={scale}>
          <planeGeometry args={[2.05, 1.25]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.3}
            side={THREE.DoubleSide}
          />
        </mesh>
        {/* Text on screen */}
        <Text
          position={[0, 0, 0.01]}
          fontSize={0.08 * scale}
          color={color}
          anchorX="center"
          anchorY="middle"
          maxWidth={1.8 * scale}
        >
          {content}
        </Text>
      </group>
    </Float>
  );
}

// Moving light particles
function LightParticles() {
  const particlesRef = useRef<THREE.Points>(null);
  const count = 200;

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 30;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < count; i++) {
        positions[i * 3 + 1] += Math.sin(state.clock.elapsedTime + i) * 0.002;
        positions[i * 3] += Math.cos(state.clock.elapsedTime + i * 0.5) * 0.001;
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
        size={0.05}
        color="#00d4ff"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

// Camera animation
function CameraRig() {
  const { camera } = useThree();
  
  useFrame((state) => {
    camera.position.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.5;
    camera.position.y = Math.cos(state.clock.elapsedTime * 0.1) * 0.3;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

function Scene() {
  const screens = [
    { position: [-3, 1.5, -5] as [number, number, number], rotation: [0, 0.3, 0] as [number, number, number], scale: 1.2, color: "#00d4ff", content: "AI/ML SOLUTIONS" },
    { position: [3, 2, -6] as [number, number, number], rotation: [0, -0.2, 0] as [number, number, number], scale: 1, color: "#ff00aa", content: "FULL STACK DEV" },
    { position: [-2, -1, -4] as [number, number, number], rotation: [0.1, 0.2, 0] as [number, number, number], scale: 0.8, color: "#00ff88", content: "NEURAL NETWORKS" },
    { position: [2.5, -0.5, -5] as [number, number, number], rotation: [-0.1, -0.3, 0] as [number, number, number], scale: 0.9, color: "#ffaa00", content: "DATA ENGINEERING" },
    { position: [-4, 0, -7] as [number, number, number], rotation: [0, 0.4, 0] as [number, number, number], scale: 1.1, color: "#aa00ff", content: "CLOUD SYSTEMS" },
    { position: [4, 1, -8] as [number, number, number], rotation: [0, -0.35, 0] as [number, number, number], scale: 1.3, color: "#00ffff", content: "LLM FINE-TUNING" },
    { position: [0, 2.5, -6] as [number, number, number], rotation: [-0.2, 0, 0] as [number, number, number], scale: 0.7, color: "#ff6600", content: "RAG SYSTEMS" },
    { position: [-1, -2, -5] as [number, number, number], rotation: [0.15, 0.1, 0] as [number, number, number], scale: 0.85, color: "#ff0066", content: "MULTI-AGENT AI" },
  ];

  return (
    <>
      <CameraRig />
      <ambientLight intensity={0.1} />
      <pointLight position={[0, 0, 5]} intensity={0.5} color="#00d4ff" />
      <pointLight position={[-5, 3, -5]} intensity={0.3} color="#ff00aa" />
      <pointLight position={[5, -2, -5]} intensity={0.3} color="#00ff88" />
      
      <Stars
        radius={100}
        depth={50}
        count={5000}
        factor={4}
        saturation={0}
        fade
        speed={0.5}
      />
      
      <LightParticles />
      
      {screens.map((screen, i) => (
        <HoloScreen key={i} {...screen} />
      ))}

      {/* Central fog effect */}
      <fog attach="fog" args={["#0a0a15", 5, 30]} />
    </>
  );
}

const SpaceHero = () => {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Three.js Canvas */}
      <div className="absolute inset-0">
        <Canvas
          camera={{ position: [0, 0, 8], fov: 60 }}
          gl={{ antialias: true, alpha: true }}
        >
          <Scene />
        </Canvas>
      </div>

      {/* Overlay gradient */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background/30 via-transparent to-background" />

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
