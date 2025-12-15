import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Stars, Float, Billboard, Text } from "@react-three/drei";
import { useRef, useMemo, Suspense } from "react";
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
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y += Math.sin(state.clock.elapsedTime * 0.5 + position[0]) * 0.0008;
    }
  });

  return (
    <Float speed={0.8} rotationIntensity={0.1} floatIntensity={0.3}>
      <group ref={groupRef} position={position} rotation={rotation}>
        {/* Main screen background */}
        <mesh scale={scale}>
          <planeGeometry args={[4, 2.2]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.15}
            side={THREE.DoubleSide}
          />
        </mesh>
        {/* Screen border */}
        <mesh scale={scale}>
          <planeGeometry args={[4.1, 2.3]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.4}
            side={THREE.DoubleSide}
            wireframe
          />
        </mesh>
        {/* Glowing core */}
        <mesh scale={scale * 0.95}>
          <planeGeometry args={[3.8, 2]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.08}
            side={THREE.DoubleSide}
          />
        </mesh>
        {/* Main text */}
        <Billboard>
          <Text
            position={[0, subtext ? 0.2 : 0, 0.1]}
            fontSize={0.3 * scale}
            color={color}
            anchorX="center"
            anchorY="middle"
            maxWidth={3.5 * scale}
          >
            {content}
          </Text>
        </Billboard>
        {/* Subtext */}
        {subtext && (
          <Billboard>
            <Text
              position={[0, -0.35, 0.1]}
              fontSize={0.12 * scale}
              color={color}
              anchorX="center"
              anchorY="middle"
              maxWidth={3.5 * scale}
            >
              {subtext}
            </Text>
          </Billboard>
        )}
        {/* Top line decoration */}
        <mesh position={[0, 0.95 * scale, 0.05]} scale={scale}>
          <planeGeometry args={[3, 0.03]} />
          <meshBasicMaterial color={color} transparent opacity={0.6} />
        </mesh>
        {/* Bottom line decoration */}
        <mesh position={[0, -0.95 * scale, 0.05]} scale={scale}>
          <planeGeometry args={[3, 0.03]} />
          <meshBasicMaterial color={color} transparent opacity={0.6} />
        </mesh>
        {/* Point light for glow */}
        <pointLight position={[0, 0, 1]} intensity={0.5} color={color} distance={5} />
      </group>
    </Float>
  );
}

// 3D Human silhouette viewing the ads
function HumanSilhouette() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = -1.5 + Math.sin(state.clock.elapsedTime * 0.8) * 0.02;
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.05;
    }
  });

  return (
    <group ref={groupRef} position={[0, -1.5, 4]}>
      {/* Head */}
      <mesh position={[0, 1.6, 0]}>
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshStandardMaterial color="#080812" emissive="#00d4ff" emissiveIntensity={0.15} />
      </mesh>
      {/* Neck */}
      <mesh position={[0, 1.38, 0]}>
        <cylinderGeometry args={[0.07, 0.09, 0.12, 8]} />
        <meshStandardMaterial color="#080812" emissive="#00d4ff" emissiveIntensity={0.1} />
      </mesh>
      {/* Torso */}
      <mesh position={[0, 0.95, 0]}>
        <boxGeometry args={[0.45, 0.6, 0.22]} />
        <meshStandardMaterial color="#080812" emissive="#00d4ff" emissiveIntensity={0.1} />
      </mesh>
      {/* Shoulders */}
      <mesh position={[-0.32, 1.18, 0]}>
        <sphereGeometry args={[0.09, 8, 8]} />
        <meshStandardMaterial color="#080812" emissive="#ff00aa" emissiveIntensity={0.1} />
      </mesh>
      <mesh position={[0.32, 1.18, 0]}>
        <sphereGeometry args={[0.09, 8, 8]} />
        <meshStandardMaterial color="#080812" emissive="#00ff88" emissiveIntensity={0.1} />
      </mesh>
      {/* Arms */}
      <mesh position={[-0.38, 0.88, 0]} rotation={[0, 0, 0.12]}>
        <cylinderGeometry args={[0.05, 0.045, 0.45, 8]} />
        <meshStandardMaterial color="#080812" emissive="#ff00aa" emissiveIntensity={0.08} />
      </mesh>
      <mesh position={[0.38, 0.88, 0]} rotation={[0, 0, -0.12]}>
        <cylinderGeometry args={[0.05, 0.045, 0.45, 8]} />
        <meshStandardMaterial color="#080812" emissive="#00ff88" emissiveIntensity={0.08} />
      </mesh>
      {/* Rim lights */}
      <pointLight position={[0, 1.5, -0.4]} intensity={0.8} color="#00d4ff" distance={2} />
      <pointLight position={[-0.4, 1.3, 0.2]} intensity={0.4} color="#ff00aa" distance={1.5} />
      <pointLight position={[0.4, 1.3, 0.2]} intensity={0.4} color="#00ff88" distance={1.5} />
    </group>
  );
}

// Floating particles
function FloatingParticles() {
  const count = 200;
  const mesh = useRef<THREE.Points>(null);

  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 50;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 50;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 50;
    }
    return positions;
  }, []);

  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.y = state.clock.elapsedTime * 0.02;
      mesh.current.rotation.x = state.clock.elapsedTime * 0.01;
    }
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={particles}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        color="#00d4ff"
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Camera subtle movement
function CameraAnimation() {
  const { camera } = useThree();
  
  useFrame((state) => {
    camera.position.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.5;
    camera.position.y = Math.cos(state.clock.elapsedTime * 0.08) * 0.3;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

function Scene() {
  const screens = [
    // Main center ads - large and prominent
    { position: [0, 1.5, -6] as [number, number, number], rotation: [0, 0, 0] as [number, number, number], scale: 1.4, color: "#00d4ff", content: "AI/ML SOLUTIONS", subtext: "Neural Networks • Deep Learning • LLMs" },
    { position: [-4, 0.8, -5] as [number, number, number], rotation: [0, 0.4, 0] as [number, number, number], scale: 1.2, color: "#ff00aa", content: "FULL STACK", subtext: "React • Node.js • Cloud" },
    { position: [4, 0.8, -5] as [number, number, number], rotation: [0, -0.4, 0] as [number, number, number], scale: 1.2, color: "#00ff88", content: "DATA SYSTEMS", subtext: "Pipelines • Analytics" },
    
    // Bottom row - immersive
    { position: [-2.5, -1.2, -4] as [number, number, number], rotation: [0.15, 0.2, 0] as [number, number, number], scale: 1.1, color: "#ffaa00", content: "NEURAL NETS" },
    { position: [0, -1.8, -5] as [number, number, number], rotation: [0.2, 0, 0] as [number, number, number], scale: 1.3, color: "#aa00ff", content: "MULTI-AGENT AI", subtext: "Autonomous Systems" },
    { position: [2.5, -1.2, -4] as [number, number, number], rotation: [0.15, -0.2, 0] as [number, number, number], scale: 1.1, color: "#ff6600", content: "RAG SYSTEMS" },
    
    // Far background
    { position: [-6, 2.5, -10] as [number, number, number], rotation: [0, 0.35, 0] as [number, number, number], scale: 1.5, color: "#4488ff", content: "MLOPS" },
    { position: [6, 2.5, -10] as [number, number, number], rotation: [0, -0.35, 0] as [number, number, number], scale: 1.5, color: "#88ff44", content: "KUBERNETES" },
    { position: [0, 3.5, -12] as [number, number, number], rotation: [-0.1, 0, 0] as [number, number, number], scale: 1.8, color: "#ff44aa", content: "INNOVATION" },
  ];

  return (
    <>
      <CameraAnimation />
      
      {/* Lighting */}
      <ambientLight intensity={0.15} />
      <pointLight position={[0, 5, 5]} intensity={1} color="#00d4ff" />
      <pointLight position={[-5, 2, 0]} intensity={0.6} color="#ff00aa" />
      <pointLight position={[5, 2, 0]} intensity={0.6} color="#00ff88" />
      
      {/* Stars background */}
      <Stars
        radius={80}
        depth={60}
        count={4000}
        factor={5}
        saturation={0}
        fade
        speed={0.5}
      />
      
      {/* Floating particles */}
      <FloatingParticles />
      
      {/* Human silhouette */}
      <HumanSilhouette />
      
      {/* Ad screens */}
      {screens.map((screen, i) => (
        <AdScreen key={i} {...screen} />
      ))}

      {/* Fog for depth */}
      <fog attach="fog" args={["#050510", 6, 25]} />
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
          <Suspense fallback={null}>
            <Scene />
          </Suspense>
        </Canvas>
      </div>

      {/* Vignette */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(5,5,16,0.5)_60%,rgba(5,5,16,0.9)_100%)]" />

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
      <div className="scanlines pointer-events-none absolute inset-0" />
    </section>
  );
};

export default SpaceHero;
