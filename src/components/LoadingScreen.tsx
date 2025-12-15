import { motion } from "framer-motion";
import { useEffect, useState, useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

// 3D Starfield with rotating camera
const StarField = () => {
  const ref = useRef<THREE.Points>(null);
  const cameraRef = useRef({ angle: 0 });

  const positions = useMemo(() => {
    const pos = new Float32Array(3000 * 3);
    for (let i = 0; i < 3000; i++) {
      const r = 50 + Math.random() * 100;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    return pos;
  }, []);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x += delta * 0.02;
      ref.current.rotation.y += delta * 0.03;
    }
    
    // Rotate camera for immersive effect
    cameraRef.current.angle += delta * 0.15;
    state.camera.position.x = Math.sin(cameraRef.current.angle) * 3;
    state.camera.position.y = Math.cos(cameraRef.current.angle * 0.5) * 2;
    state.camera.position.z = 5 + Math.sin(cameraRef.current.angle * 0.3) * 2;
    state.camera.lookAt(0, 0, 0);
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#00d4ff"
        size={0.15}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
};

// Secondary colored stars for depth
const ColoredStars = () => {
  const ref = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const pos = new Float32Array(500 * 3);
    for (let i = 0; i < 500; i++) {
      const r = 30 + Math.random() * 80;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    return pos;
  }, []);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta * 0.01;
      ref.current.rotation.z += delta * 0.02;
    }
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#ff00aa"
        size={0.2}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
};

// Nebula clouds
const Nebula = () => {
  const ref = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const pos = new Float32Array(200 * 3);
    for (let i = 0; i < 200; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 60;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 40;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 60 - 30;
    }
    return pos;
  }, []);

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.005;
    }
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#6633ff"
        size={1.5}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        opacity={0.3}
      />
    </Points>
  );
};

const LoadingScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [progress, setProgress] = useState(0);
  const [isShaking, setIsShaking] = useState(false);
  const [shakeIntensity, setShakeIntensity] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Create squeak sound using Web Audio API
  const playSqueak = () => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // Create oscillator for squeak sound
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // High-pitched squeak
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(2000, audioContext.currentTime + 0.1);
    oscillator.frequency.exponentialRampToValueAtTime(600, audioContext.currentTime + 0.2);
    oscillator.frequency.exponentialRampToValueAtTime(1500, audioContext.currentTime + 0.3);
    
    // Volume envelope
    gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.3, audioContext.currentTime + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
    
    oscillator.type = 'sine';
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.4);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        // Start cinematic effects at 85%
        if (prev >= 85 && prev < 100) {
          if (!isShaking) {
            setIsShaking(true);
            playSqueak();
          }
          // Increase shake intensity as we approach 100%
          setShakeIntensity(Math.min((prev - 85) / 15 * 12, 12));
        }
        
        if (prev >= 100) {
          clearInterval(interval);
          // Final intense shake and squeak
          setShakeIntensity(15);
          playSqueak();
          setTimeout(() => {
            setIsShaking(false);
            onComplete();
          }, 600);
          return 100;
        }
        return prev + 2;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [onComplete, isShaking]);

  // Generate shake transform
  const shakeStyle = isShaking
    ? {
        transform: `translate(${(Math.random() - 0.5) * shakeIntensity}px, ${(Math.random() - 0.5) * shakeIntensity}px) rotate(${(Math.random() - 0.5) * shakeIntensity * 0.3}deg)`,
      }
    : {};

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background overflow-hidden"
      style={shakeStyle}
    >
      {/* 3D Space Background */}
      <div className="absolute inset-0">
        <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
          <color attach="background" args={["#050510"]} />
          <fog attach="fog" args={["#050510", 50, 150]} />
          <ambientLight intensity={0.1} />
          <StarField />
          <ColoredStars />
          <Nebula />
        </Canvas>
      </div>

      {/* Overlay gradient for depth */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-background/30 to-background/80 pointer-events-none" />

      {/* Cinematic flash effect when shaking */}
      {isShaking && (
        <motion.div
          className="absolute inset-0 bg-primary/10 pointer-events-none z-20"
          animate={{ opacity: [0, 0.3, 0] }}
          transition={{ duration: 0.15, repeat: Infinity }}
        />
      )}

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center gap-12">
        {/* Logo / Title */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ 
            scale: isShaking ? [1, 1.02, 0.98, 1] : 1, 
            opacity: 1 
          }}
          transition={{ duration: isShaking ? 0.1 : 0.5, repeat: isShaking ? Infinity : 0 }}
          className="relative"
        >
          <h1 className="font-display text-5xl font-bold tracking-wider md:text-7xl">
            <span className="text-neon">INIT</span>
            <span className="text-foreground">_</span>
            <span className="text-neon-magenta">SYS</span>
          </h1>
          <motion.div
            className="absolute -inset-4 -z-10 rounded-lg bg-primary/5"
            animate={{ opacity: isShaking ? [0.3, 0.8, 0.3] : [0.3, 0.6, 0.3] }}
            transition={{ duration: isShaking ? 0.1 : 2, repeat: Infinity }}
          />
        </motion.div>

        {/* Status text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col items-center gap-4"
        >
          <p className="font-body text-sm tracking-widest text-muted-foreground">
            {progress >= 85 ? "FINALIZING BOOT SEQUENCE" : "ESTABLISHING NEURAL LINK"}
          </p>

          {/* Progress bar */}
          <div className="relative h-1 w-64 overflow-hidden rounded-full bg-muted/50 backdrop-blur-sm md:w-80">
            <motion.div
              className={`absolute inset-y-0 left-0 rounded-full ${
                isShaking 
                  ? "bg-gradient-to-r from-primary via-secondary to-accent" 
                  : "bg-gradient-to-r from-primary via-secondary to-primary"
              }`}
              style={{ width: `${progress}%` }}
              animate={isShaking ? { opacity: [1, 0.7, 1] } : {}}
              transition={{ duration: 0.1, repeat: isShaking ? Infinity : 0 }}
            />
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-foreground/20 to-transparent"
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: isShaking ? 0.3 : 1.5, repeat: Infinity }}
            />
          </div>

          {/* Progress percentage */}
          <div className="flex items-center gap-2 font-display text-xs tracking-wider text-muted-foreground">
            <span>{progress >= 85 ? "SYSTEM READY" : "LOADING PORTFOLIO"}</span>
            <motion.span 
              className="text-primary"
              animate={isShaking ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 0.1, repeat: isShaking ? Infinity : 0 }}
            >
              {progress}%
            </motion.span>
          </div>
        </motion.div>

        {/* Decorative elements */}
        <motion.div
          className="flex gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className={`h-2 w-2 rounded-full ${isShaking ? "bg-secondary" : "bg-primary"}`}
              animate={{
                scale: isShaking ? [1, 2, 1] : [1, 1.5, 1],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: isShaking ? 0.15 : 1,
                repeat: Infinity,
                delay: isShaking ? i * 0.03 : i * 0.15,
              }}
            />
          ))}
        </motion.div>
      </div>

      {/* Corner decorations */}
      <div className="absolute left-8 top-8 z-10 font-display text-xs text-muted-foreground opacity-50">
        <div>SYS.BOOT v2.4.1</div>
        <motion.div 
          className="text-primary"
          animate={isShaking ? { opacity: [1, 0.3, 1] } : {}}
          transition={{ duration: 0.1, repeat: isShaking ? Infinity : 0 }}
        >
          STATUS: {progress >= 85 ? "COMPLETING" : "ACTIVE"}
        </motion.div>
      </div>

      <div className="absolute bottom-8 right-8 z-10 text-right font-display text-xs text-muted-foreground opacity-50">
        <div>MATRIX.INIT</div>
        <motion.div 
          className="text-secondary"
          animate={isShaking ? { opacity: [1, 0.3, 1] } : {}}
          transition={{ duration: 0.1, repeat: isShaking ? Infinity : 0 }}
        >
          KERNEL: {progress >= 85 ? "SYNCING" : "LOADED"}
        </motion.div>
      </div>

      {/* Scan lines effect during shake */}
      {isShaking && (
        <div 
          className="absolute inset-0 pointer-events-none z-30"
          style={{
            background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)',
            animation: 'scanlines 0.1s linear infinite',
          }}
        />
      )}
    </motion.div>
  );
};

export default LoadingScreen;
