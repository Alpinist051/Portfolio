import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Text, Billboard, Environment } from "@react-three/drei";
import { useRef, useMemo, Suspense } from "react";
import * as THREE from "three";
import { motion } from "framer-motion";

// Curved screen that wraps around the viewer
function CurvedScreen({ 
  angle, 
  color, 
  content, 
  subtext,
  radius = 8,
  height = 3
}: { 
  angle: number;
  color: string;
  content: string;
  subtext?: string;
  radius?: number;
  height?: number;
}) {
  const x = Math.sin(angle) * radius;
  const z = -Math.cos(angle) * radius;
  const rotationY = angle;

  return (
    <Float speed={0.5} rotationIntensity={0.02} floatIntensity={0.1}>
      <group position={[x, 0, z]} rotation={[0, rotationY, 0]}>
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
}

// Bottom row screens
function BottomScreen({ 
  angle, 
  color, 
  content,
  radius = 6
}: { 
  angle: number;
  color: string;
  content: string;
  radius?: number;
}) {
  const x = Math.sin(angle) * radius;
  const z = -Math.cos(angle) * radius;
  const rotationY = angle;

  return (
    <Float speed={0.6} rotationIntensity={0.03} floatIntensity={0.15}>
      <group position={[x, -2.2, z]} rotation={[0.25, rotationY, 0]}>
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
}

// Ambient floating particles in the dark room
function RoomParticles() {
  const count = 100;
  const mesh = useRef<THREE.Points>(null);

  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 25;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 15;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 25;
    }
    return positions;
  }, []);

  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.y = state.clock.elapsedTime * 0.01;
    }
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={particles} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.03} color="#00d4ff" transparent opacity={0.3} sizeAttenuation blending={THREE.AdditiveBlending} />
    </points>
  );
}

// Ground reflection
function GroundPlane() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -4, 0]}>
      <planeGeometry args={[50, 50]} />
      <meshStandardMaterial color="#050508" metalness={0.9} roughness={0.4} />
    </mesh>
  );
}

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
      {/* Dark room lighting */}
      <ambientLight intensity={0.02} />
      <pointLight position={[0, 5, 0]} intensity={0.3} color="#0a1020" />
      
      {/* Screen reflections on floor */}
      <GroundPlane />
      
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

      {/* Environment for reflections */}
      <Environment preset="night" />
      
      {/* Fog for atmosphere */}
      <fog attach="fog" args={["#020205", 5, 25]} />
    </>
  );
}

const SpaceHero = () => {
  return (
    <section className="relative h-screen w-full overflow-hidden bg-[#020205]">
      {/* Three.js Canvas - Dark room with screens */}
      <div className="absolute inset-0">
        <Canvas
          camera={{ position: [0, 0, 0], fov: 75 }}
          gl={{ antialias: true, alpha: false }}
        >
          <Suspense fallback={null}>
            <Scene />
          </Suspense>
        </Canvas>
      </div>

      {/* Human silhouette overlay - viewing from behind */}
      <div className="pointer-events-none absolute inset-0 flex items-end justify-center">
        <div className="relative h-[70%] w-full max-w-[500px]">
          {/* Head */}
          <div className="absolute left-1/2 top-[5%] h-[12%] w-[18%] -translate-x-1/2 rounded-full bg-gradient-to-b from-[#0a0a12] to-[#050508] shadow-[0_0_30px_rgba(0,212,255,0.1)]" />
          {/* Neck */}
          <div className="absolute left-1/2 top-[16%] h-[5%] w-[8%] -translate-x-1/2 bg-gradient-to-b from-[#0a0a12] to-[#080810]" />
          {/* Shoulders & upper body */}
          <div className="absolute left-1/2 top-[20%] h-[25%] w-[55%] -translate-x-1/2 rounded-t-[100px] bg-gradient-to-b from-[#0a0a12] via-[#080810] to-[#050508]" />
          {/* Left shoulder curve */}
          <div className="absolute left-[22%] top-[21%] h-[12%] w-[15%] rounded-full bg-gradient-to-br from-[#0c0c14] to-[#080810]" />
          {/* Right shoulder curve */}
          <div className="absolute right-[22%] top-[21%] h-[12%] w-[15%] rounded-full bg-gradient-to-bl from-[#0c0c14] to-[#080810]" />
          {/* Body */}
          <div className="absolute bottom-0 left-1/2 h-[55%] w-[60%] -translate-x-1/2 bg-gradient-to-b from-[#050508] to-[#020205]" />
          {/* Rim light effects */}
          <div className="absolute left-1/2 top-[5%] h-[12%] w-[18%] -translate-x-1/2 rounded-full opacity-30 shadow-[inset_-8px_0_15px_rgba(255,0,170,0.3),inset_8px_0_15px_rgba(0,255,136,0.3)]" />
          <div className="absolute left-[22%] top-[21%] h-[12%] w-[15%] rounded-full opacity-40 shadow-[inset_-5px_0_10px_rgba(255,0,170,0.4)]" />
          <div className="absolute right-[22%] top-[21%] h-[12%] w-[15%] rounded-full opacity-40 shadow-[inset_5px_0_10px_rgba(0,255,136,0.4)]" />
        </div>
      </div>

      {/* Vignette effect */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(2,2,5,0.3)_50%,rgba(2,2,5,0.85)_100%)]" />

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

      {/* Scanlines */}
      <div className="scanlines pointer-events-none absolute inset-0 opacity-50" />
    </section>
  );
};

export default SpaceHero;
