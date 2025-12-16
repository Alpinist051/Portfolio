import { motion } from "framer-motion";
import { useEffect, useState, useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import * as THREE from "three";

// Single Meteor with trail
const Meteor = ({ delay, speed, startPos }: { delay: number; speed: number; startPos: [number, number, number] }) => {
  const ref = useRef<THREE.Group>(null);
  const [active, setActive] = useState(false);
  const progress = useRef(0);
  const tailLength = 3 + Math.random() * 2;

  useEffect(() => {
    const timeout = setTimeout(() => setActive(true), delay * 1000);
    return () => clearTimeout(timeout);
  }, [delay]);

  useFrame((_, delta) => {
    if (!ref.current || !active) return;
    
    progress.current += delta * speed;
    
    // Move diagonally down-left
    ref.current.position.x = startPos[0] - progress.current * 15;
    ref.current.position.y = startPos[1] - progress.current * 10;
    ref.current.position.z = startPos[2];

    // Reset when off screen
    if (progress.current > 3) {
      progress.current = 0;
      ref.current.position.set(startPos[0], startPos[1], startPos[2]);
    }
  });

  if (!active) return null;

  const points: [number, number, number][] = [
    [0, 0, 0],
    [tailLength * 0.6, tailLength * 0.4, 0],
  ];

  return (
    <group ref={ref} position={startPos}>
      <Line
        points={points}
        color="#ffffff"
        lineWidth={1.5}
        transparent
        opacity={0.9}
      />
      <Line
        points={[[0.1, 0.1, 0], [tailLength * 0.4, tailLength * 0.25, 0]]}
        color="#aaaaaa"
        lineWidth={0.8}
        transparent
        opacity={0.5}
      />
    </group>
  );
};

// Meteor shower effect
const MeteorShower = () => {
  const meteors = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => ({
      id: i,
      delay: Math.random() * 3,
      speed: 0.8 + Math.random() * 0.6,
      startPos: [
        15 + Math.random() * 20,
        10 + Math.random() * 15,
        -5 - Math.random() * 10,
      ] as [number, number, number],
    }));
  }, []);

  return (
    <>
      {meteors.map((meteor) => (
        <Meteor key={meteor.id} {...meteor} />
      ))}
    </>
  );
};

const LoadingScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [hasStarted, setHasStarted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isShaking, setIsShaking] = useState(false);
  const [shakeIntensity, setShakeIntensity] = useState(0);
  const [isFinalEffect, setIsFinalEffect] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [lightningFlash, setLightningFlash] = useState(false);
  const [lightningPosition, setLightningPosition] = useState({ x: 50, y: 30 });
  const [completionFlash, setCompletionFlash] = useState(false);
  const triggeredMilestones = useRef<Set<number>>(new Set());
  const timeoutsRef = useRef<number[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Initialize audio context on user interaction
  const initAudio = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    audioContextRef.current.resume();
    return audioContextRef.current;
  };

  // ==================== CRAZY WAR AUDIO SYSTEM ====================

  // AIR RAID SIREN - haunting warning
  const playAirRaidSiren = (duration: number = 3) => {
    const ctx = initAudio();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sawtooth';
    // Sweeping frequency for siren effect
    const startFreq = 400;
    const endFreq = 800;
    const now = ctx.currentTime;
    
    // Create sweeping siren
    for (let i = 0; i < duration * 2; i++) {
      const t = i * 0.5;
      if (i % 2 === 0) {
        osc.frequency.setValueAtTime(startFreq, now + t);
        osc.frequency.linearRampToValueAtTime(endFreq, now + t + 0.5);
      } else {
        osc.frequency.setValueAtTime(endFreq, now + t);
        osc.frequency.linearRampToValueAtTime(startFreq, now + t + 0.5);
      }
    }
    
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.25, now + 0.3);
    gain.gain.setValueAtTime(0.25, now + duration - 0.5);
    gain.gain.exponentialRampToValueAtTime(0.01, now + duration);
    
    // Add distortion for grit
    const distortion = ctx.createWaveShaper();
    const curve = new Float32Array(256);
    for (let i = 0; i < 256; i++) {
      curve[i] = Math.tanh((i / 128 - 1) * 2);
    }
    distortion.curve = curve;
    
    osc.connect(distortion);
    distortion.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + duration);
  };

  // MACHINE GUN BURST - rapid fire chaos
  const playMachineGun = (bursts: number = 8) => {
    const ctx = initAudio();
    const now = ctx.currentTime;
    
    for (let i = 0; i < bursts; i++) {
      const delay = i * 0.08 + Math.random() * 0.02;
      
      // Sharp crack
      const crackOsc = ctx.createOscillator();
      const crackGain = ctx.createGain();
      crackOsc.type = 'square';
      crackOsc.frequency.setValueAtTime(800, now + delay);
      crackOsc.frequency.exponentialRampToValueAtTime(100, now + delay + 0.03);
      crackGain.gain.setValueAtTime(0.3, now + delay);
      crackGain.gain.exponentialRampToValueAtTime(0.01, now + delay + 0.05);
      crackOsc.connect(crackGain);
      crackGain.connect(ctx.destination);
      crackOsc.start(now + delay);
      crackOsc.stop(now + delay + 0.05);
      
      // Noise burst
      const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.03, ctx.sampleRate);
      const noiseData = noiseBuffer.getChannelData(0);
      for (let j = 0; j < noiseData.length; j++) {
        noiseData[j] = (Math.random() * 2 - 1) * Math.pow(1 - j / noiseData.length, 2);
      }
      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = noiseBuffer;
      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.4, now + delay);
      noiseGain.gain.exponentialRampToValueAtTime(0.01, now + delay + 0.04);
      const highPass = ctx.createBiquadFilter();
      highPass.type = 'highpass';
      highPass.frequency.value = 2000;
      noiseSource.connect(highPass);
      highPass.connect(noiseGain);
      noiseGain.connect(ctx.destination);
      noiseSource.start(now + delay);
      noiseSource.stop(now + delay + 0.04);
    }
  };

  // HELICOPTER ROTOR - ominous approach
  const playHelicopter = (duration: number = 2) => {
    const ctx = initAudio();
    const now = ctx.currentTime;
    
    // Rotor thump
    const rotorOsc = ctx.createOscillator();
    const rotorGain = ctx.createGain();
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    
    lfo.frequency.value = 20; // Rotor speed
    lfoGain.gain.value = 50;
    lfo.connect(lfoGain);
    lfoGain.connect(rotorOsc.frequency);
    
    rotorOsc.type = 'sawtooth';
    rotorOsc.frequency.value = 80;
    rotorGain.gain.setValueAtTime(0, now);
    rotorGain.gain.linearRampToValueAtTime(0.2, now + 0.5);
    rotorGain.gain.setValueAtTime(0.2, now + duration - 0.5);
    rotorGain.gain.exponentialRampToValueAtTime(0.01, now + duration);
    
    const lowPass = ctx.createBiquadFilter();
    lowPass.type = 'lowpass';
    lowPass.frequency.value = 200;
    
    rotorOsc.connect(lowPass);
    lowPass.connect(rotorGain);
    rotorGain.connect(ctx.destination);
    
    lfo.start(now);
    rotorOsc.start(now);
    lfo.stop(now + duration);
    rotorOsc.stop(now + duration);
  };

  // MASSIVE EXPLOSION - earth-shaking blast
  const playMassiveExplosion = (intensity: number = 1) => {
    const ctx = initAudio();
    const now = ctx.currentTime;
    const duration = 3 * intensity;
    
    // Layer 1: Sub-bass foundation shake
    const subOsc = ctx.createOscillator();
    const subGain = ctx.createGain();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(30, now);
    subOsc.frequency.exponentialRampToValueAtTime(10, now + duration);
    subGain.gain.setValueAtTime(0.8 * intensity, now);
    subGain.gain.exponentialRampToValueAtTime(0.01, now + duration);
    subOsc.connect(subGain);
    subGain.connect(ctx.destination);
    subOsc.start(now);
    subOsc.stop(now + duration);
    
    // Layer 2: Mid explosion body
    const midOsc = ctx.createOscillator();
    const midGain = ctx.createGain();
    midOsc.type = 'sawtooth';
    midOsc.frequency.setValueAtTime(100, now);
    midOsc.frequency.exponentialRampToValueAtTime(30, now + 0.5);
    midGain.gain.setValueAtTime(0.5 * intensity, now);
    midGain.gain.exponentialRampToValueAtTime(0.01, now + 0.8);
    const midDist = ctx.createWaveShaper();
    const curve = new Float32Array(256);
    for (let i = 0; i < 256; i++) curve[i] = Math.tanh((i / 128 - 1) * 8);
    midDist.curve = curve;
    midOsc.connect(midDist);
    midDist.connect(midGain);
    midGain.connect(ctx.destination);
    midOsc.start(now);
    midOsc.stop(now + 0.8);
    
    // Layer 3: Sharp initial crack
    const crackBuffer = ctx.createBuffer(2, ctx.sampleRate * 0.1, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const data = crackBuffer.getChannelData(ch);
      for (let i = 0; i < data.length; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / data.length, 0.5) * 2;
      }
    }
    const crackSource = ctx.createBufferSource();
    crackSource.buffer = crackBuffer;
    const crackGain = ctx.createGain();
    crackGain.gain.setValueAtTime(0.6 * intensity, now);
    crackGain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
    crackSource.connect(crackGain);
    crackGain.connect(ctx.destination);
    crackSource.start(now);
    crackSource.stop(now + 0.15);
    
    // Layer 4: Debris and rumble
    const debrisBuffer = ctx.createBuffer(2, ctx.sampleRate * duration, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const data = debrisBuffer.getChannelData(ch);
      for (let i = 0; i < data.length; i++) {
        const env = Math.pow(1 - i / data.length, 0.3);
        const rumble = Math.sin(i / 500) * 0.5;
        data[i] = ((Math.random() * 2 - 1) + rumble) * env;
      }
    }
    const debrisSource = ctx.createBufferSource();
    debrisSource.buffer = debrisBuffer;
    const debrisLowPass = ctx.createBiquadFilter();
    debrisLowPass.type = 'lowpass';
    debrisLowPass.frequency.setValueAtTime(300, now);
    debrisLowPass.frequency.exponentialRampToValueAtTime(50, now + duration);
    const debrisGain = ctx.createGain();
    debrisGain.gain.setValueAtTime(0.5 * intensity, now);
    debrisGain.gain.exponentialRampToValueAtTime(0.01, now + duration);
    debrisSource.connect(debrisLowPass);
    debrisLowPass.connect(debrisGain);
    debrisGain.connect(ctx.destination);
    debrisSource.start(now);
    debrisSource.stop(now + duration);
  };

  // MORTAR WHISTLE - incoming projectile
  const playMortarWhistle = () => {
    const ctx = initAudio();
    const now = ctx.currentTime;
    const duration = 1.5;
    
    const whistleOsc = ctx.createOscillator();
    const whistleGain = ctx.createGain();
    whistleOsc.type = 'sine';
    whistleOsc.frequency.setValueAtTime(2000, now);
    whistleOsc.frequency.exponentialRampToValueAtTime(200, now + duration);
    whistleGain.gain.setValueAtTime(0.01, now);
    whistleGain.gain.linearRampToValueAtTime(0.35, now + duration * 0.7);
    whistleGain.gain.exponentialRampToValueAtTime(0.01, now + duration);
    whistleOsc.connect(whistleGain);
    whistleGain.connect(ctx.destination);
    whistleOsc.start(now);
    whistleOsc.stop(now + duration);
    
    // Explosion at end
    setTimeout(() => playMassiveExplosion(0.8), duration * 900);
  };

  // APOCALYPTIC DRONE - dark atmosphere
  const playApocalypticDrone = () => {
    const ctx = initAudio();
    const now = ctx.currentTime;
    const duration = 4;
    
    // Multiple detuned oscillators
    const freqs = [40, 41, 80, 81, 120];
    freqs.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = i < 2 ? 'sine' : 'sawtooth';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.1, now + 1);
      gain.gain.setValueAtTime(0.1, now + duration - 1);
      gain.gain.exponentialRampToValueAtTime(0.01, now + duration);
      
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 150;
      
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + duration);
    });
  };

  // HEAVY IMPACT - metal clash
  const playHeavyImpact = (intensity: number = 1) => {
    const ctx = initAudio();
    const now = ctx.currentTime;
    
    // Metal clang
    const metalOsc = ctx.createOscillator();
    const metalGain = ctx.createGain();
    metalOsc.type = 'square';
    metalOsc.frequency.setValueAtTime(300 * intensity, now);
    metalOsc.frequency.exponentialRampToValueAtTime(50, now + 0.3);
    metalGain.gain.setValueAtTime(0.6 * intensity, now);
    metalGain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
    
    const dist = ctx.createWaveShaper();
    const curve = new Float32Array(256);
    for (let i = 0; i < 256; i++) curve[i] = Math.tanh((i / 128 - 1) * 10);
    dist.curve = curve;
    
    metalOsc.connect(dist);
    dist.connect(metalGain);
    metalGain.connect(ctx.destination);
    metalOsc.start(now);
    metalOsc.stop(now + 0.4);
    
    // Sub thud
    const thudOsc = ctx.createOscillator();
    const thudGain = ctx.createGain();
    thudOsc.type = 'sine';
    thudOsc.frequency.setValueAtTime(60, now);
    thudOsc.frequency.exponentialRampToValueAtTime(20, now + 0.5);
    thudGain.gain.setValueAtTime(0.8 * intensity, now);
    thudGain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);
    thudOsc.connect(thudGain);
    thudGain.connect(ctx.destination);
    thudOsc.start(now);
    thudOsc.stop(now + 0.6);
  };

  // ==================== WAR ZONE EFFECTS ====================

  // Initial war chaos on start
  useEffect(() => {
    if (!hasStarted) return;
    
    // Air raid siren starts
    const sirenTimeout = setTimeout(() => {
      playAirRaidSiren(4);
    }, 200);
    
    // Apocalyptic drone atmosphere
    const droneTimeout = setTimeout(() => {
      playApocalypticDrone();
    }, 500);
    
    // Initial explosion
    const explosionTimeout = setTimeout(() => {
      playMassiveExplosion(0.7);
    }, 800);
    
    // Random war sounds loop
    const warInterval = setInterval(() => {
      const rand = Math.random();
      if (rand < 0.25) {
        playMachineGun(5 + Math.floor(Math.random() * 10));
      } else if (rand < 0.45) {
        playMortarWhistle();
      } else if (rand < 0.6) {
        playHelicopter(1.5 + Math.random());
      } else if (rand < 0.75) {
        playMassiveExplosion(0.3 + Math.random() * 0.5);
      }
    }, 1500 + Math.random() * 1000);
    
    return () => {
      clearTimeout(sirenTimeout);
      clearTimeout(droneTimeout);
      clearTimeout(explosionTimeout);
      clearInterval(warInterval);
    };
  }, [hasStarted]);

  // Lightning triggers massive explosions
  useEffect(() => {
    if (!hasStarted) return;
    
    const triggerLightning = () => {
      setLightningPosition({ 
        x: 20 + Math.random() * 60, 
        y: 10 + Math.random() * 40 
      });
      setLightningFlash(true);
      setTimeout(() => setLightningFlash(false), 150);
      setTimeout(() => {
        setLightningFlash(true);
        setTimeout(() => setLightningFlash(false), 80);
      }, 200);
      
      // Explosion on flash
      setTimeout(() => {
        playMassiveExplosion(0.5 + Math.random() * 0.5);
      }, 50);
    };

    const interval = setInterval(() => {
      if (Math.random() > 0.5) {
        triggerLightning();
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [hasStarted]);

  const setManagedTimeout = (fn: () => void, ms: number) => {
    const id = window.setTimeout(fn, ms);
    timeoutsRef.current.push(id);
    return id;
  };

  // Trigger shake at specific milestone
  const triggerMilestoneShake = (milestone: number, intensity: number, duration: number) => {
    if (triggeredMilestones.current.has(milestone)) return;
    triggeredMilestones.current.add(milestone);

    setIsShaking(true);
    setShakeIntensity(intensity);
    playHeavyImpact(intensity / 5);
    playMachineGun(6);

    setManagedTimeout(() => {
      if (milestone !== 100) {
        setIsShaking(false);
        setShakeIntensity(0);
      }
    }, duration);
  };

  useEffect(() => {
    if (!hasStarted) return;
    
    const interval = window.setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + 2;

        // Milestone 1: Light shake at 35%
        if (newProgress >= 34 && newProgress <= 38) {
          triggerMilestoneShake(35, 4, 400);
        }

        // Milestone 2: Medium shake at 80%
        if (newProgress >= 78 && newProgress <= 82) {
          triggerMilestoneShake(80, 8, 500);
        }

        // Milestone 3: Heavy shake at 99%
        if (newProgress >= 98 && newProgress < 100) {
          triggerMilestoneShake(99, 12, 600);
        }

        // Stop at 100
        if (newProgress >= 100) {
          window.clearInterval(interval);
          return 100;
        }

        return newProgress;
      });
    }, 100);

    return () => {
      window.clearInterval(interval);
      timeoutsRef.current.forEach((id) => window.clearTimeout(id));
      timeoutsRef.current = [];
    };
  }, [hasStarted]);

  // When reaching 100%, trigger dramatic flash and transition
  useEffect(() => {
    if (progress !== 100 || isFinalEffect) return;

    setIsFinalEffect(true);
    
    // Dramatic completion flash sequence
    setCompletionFlash(true);
    playMassiveExplosion(1.5);
    playAirRaidSiren(2);
    
    setTimeout(() => {
      setCompletionFlash(false);
      setTimeout(() => {
        setCompletionFlash(true);
        playMassiveExplosion(1.2);
        setTimeout(() => {
          setCompletionFlash(false);
          setIsExiting(true);
          playHeavyImpact(3);
        }, 100);
      }, 150);
    }, 150);

    // Complete after exit animation
    setManagedTimeout(() => {
      onComplete();
    }, 1200);
  }, [progress, isFinalEffect, onComplete]);

  // Generate shake transform
  const shakeStyle = isShaking
    ? {
        transform: `translate(${(Math.random() - 0.5) * shakeIntensity}px, ${(Math.random() - 0.5) * shakeIntensity}px) rotate(${(Math.random() - 0.5) * shakeIntensity * 0.3}deg)`,
      }
    : {};

  return (
    <motion.div
      initial={{ opacity: 1, scale: 1 }}
      animate={{
        opacity: isExiting ? 0 : 1,
        scale: isExiting ? 1.1 : 1,
        filter: isExiting ? "blur(10px)" : "blur(0px)",
      }}
      transition={{ duration: isExiting ? 1 : 0.8, ease: "easeInOut" }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background overflow-hidden"
      style={shakeStyle}
    >
      {/* Click to Start Overlay */}
      {!hasStarted && (
        <motion.div
          className="absolute inset-0 z-[60] flex flex-col items-center justify-center cursor-pointer bg-background/90 backdrop-blur-sm"
          onClick={() => {
            initAudio();
            setHasStarted(true);
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="flex flex-col items-center gap-6"
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="w-24 h-24 rounded-full border-2 border-primary/50 flex items-center justify-center">
              <motion.div
                className="w-0 h-0 border-l-[20px] border-l-primary border-y-[12px] border-y-transparent ml-2"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </div>
            <h2 className="font-display text-2xl tracking-widest text-foreground/80">CLICK TO INITIALIZE</h2>
            <p className="text-sm text-muted-foreground tracking-wider">ENGAGE AUDIO SYSTEMS</p>
          </motion.div>
        </motion.div>
      )}

      {/* Dramatic completion flash overlay */}
      {completionFlash && (
        <motion.div
          className="absolute inset-0 z-50 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0.8, 1, 0] }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          style={{
            background: 'radial-gradient(circle at center, hsl(var(--primary)) 0%, hsl(var(--secondary) / 0.8) 30%, hsl(var(--background)) 70%)',
          }}
        />
      )}

      {/* 3D Space Background with Meteors */}
      <div className="absolute inset-0">
        <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
          <color attach="background" args={["#050510"]} />
          <fog attach="fog" args={["#050510", 20, 80]} />
          <ambientLight intensity={0.1} />
          <MeteorShower />
        </Canvas>
      </div>

      {/* Animated fog layers - reactive to shake */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Lightning flash overlay */}
        <motion.div
          className="absolute inset-0 z-20"
          style={{
            background: `radial-gradient(ellipse 60% 40% at ${lightningPosition.x}% ${lightningPosition.y}%, hsl(var(--primary) / 0.6) 0%, hsl(var(--secondary) / 0.3) 30%, transparent 70%)`,
          }}
          animate={{
            opacity: lightningFlash ? [0, 1, 0.3, 0] : 0,
          }}
          transition={{ duration: 0.15, ease: "easeOut" }}
        />

        {/* Lightning bolt effect */}
        {lightningFlash && (
          <motion.div
            className="absolute z-20"
            style={{
              left: `${lightningPosition.x}%`,
              top: `${lightningPosition.y}%`,
              width: '2px',
              height: '150px',
              background: 'linear-gradient(180deg, hsl(var(--primary)) 0%, hsl(var(--secondary)) 50%, transparent 100%)',
              filter: 'blur(1px)',
              boxShadow: '0 0 20px hsl(var(--primary)), 0 0 40px hsl(var(--secondary))',
              transform: `rotate(${15 + Math.random() * 30}deg)`,
            }}
            initial={{ opacity: 0, scaleY: 0 }}
            animate={{ opacity: [0, 1, 0], scaleY: [0, 1, 1] }}
            transition={{ duration: 0.1 }}
          />
        )}

        {/* Bottom fog layer - slow drift, intensifies on shake */}
        <motion.div
          className="absolute -bottom-20 -left-20 -right-20 h-[60%]"
          style={{
            background: isShaking 
              ? 'radial-gradient(ellipse 120% 80% at 50% 100%, hsl(var(--primary) / 0.35) 0%, hsl(var(--secondary) / 0.2) 40%, transparent 70%)'
              : 'radial-gradient(ellipse 120% 80% at 50% 100%, hsl(var(--primary) / 0.15) 0%, hsl(var(--secondary) / 0.08) 40%, transparent 70%)',
            filter: isShaking ? 'blur(30px)' : 'blur(40px)',
          }}
          animate={{ 
            x: isShaking ? [-50, 50, -50] : [-30, 30, -30],
            scaleX: isShaking ? [1, 1.3, 1] : [1, 1.1, 1],
            opacity: isShaking ? [0.6, 0.9, 0.6] : [0.4, 0.5, 0.4],
          }}
          transition={{ 
            duration: isShaking ? 0.3 : 15, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        />
        
        {/* Mid fog layer - medium drift, pulses on shake */}
        <motion.div
          className="absolute top-1/3 -left-40 -right-40 h-[50%]"
          style={{
            background: isShaking
              ? 'radial-gradient(ellipse 100% 60% at 30% 50%, hsl(var(--primary) / 0.3) 0%, transparent 60%)'
              : 'radial-gradient(ellipse 100% 60% at 30% 50%, hsl(var(--primary) / 0.12) 0%, transparent 60%)',
            filter: isShaking ? 'blur(40px)' : 'blur(60px)',
          }}
          animate={{ 
            x: isShaking ? [60, -60, 60] : [40, -40, 40],
            y: isShaking ? [-40, 40, -40] : [-20, 20, -20],
            opacity: isShaking ? [0.5, 0.8, 0.5] : [0.3, 0.4, 0.3],
          }}
          transition={{ 
            duration: isShaking ? 0.25 : 20, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        />
        
        {/* Top fog wisps - swirls on shake */}
        <motion.div
          className="absolute -top-20 -left-20 -right-20 h-[40%]"
          style={{
            background: isShaking
              ? 'radial-gradient(ellipse 80% 100% at 70% 0%, hsl(var(--secondary) / 0.25) 0%, transparent 50%)'
              : 'radial-gradient(ellipse 80% 100% at 70% 0%, hsl(var(--secondary) / 0.1) 0%, transparent 50%)',
            filter: isShaking ? 'blur(35px)' : 'blur(50px)',
          }}
          animate={{ 
            x: isShaking ? [-40, 60, -40] : [-20, 40, -20],
            opacity: isShaking ? [0.4, 0.7, 0.4] : [0.2, 0.35, 0.2],
            rotate: isShaking ? [-5, 5, -5] : 0,
          }}
          transition={{ 
            duration: isShaking ? 0.2 : 12, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        />

        {/* Floating fog particles - chaotic on shake */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: 150 + i * 50,
              height: 80 + i * 30,
              left: `${10 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
              background: isShaking
                ? `radial-gradient(ellipse, hsl(var(--primary) / ${0.15 + i * 0.02}) 0%, transparent 70%)`
                : `radial-gradient(ellipse, hsl(var(--primary) / ${0.06 + i * 0.01}) 0%, transparent 70%)`,
              filter: isShaking ? 'blur(20px)' : 'blur(30px)',
            }}
            animate={{
              x: isShaking ? [0, 50 - i * 15, -30 + i * 10, 0] : [0, 30 - i * 10, 0],
              y: isShaking ? [0, 30 - i * 8, -20 + i * 5, 0] : [0, 15 - i * 5, 0],
              opacity: isShaking ? [0.5, 0.9, 0.6, 0.5] : [0.3, 0.5, 0.3],
              scale: isShaking ? [1, 1.2, 0.9, 1] : 1,
            }}
            transition={{
              duration: isShaking ? 0.4 : 8 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: isShaking ? i * 0.05 : i * 0.5,
            }}
          />
        ))}

        {/* Extra turbulent fog during shake */}
        {isShaking && (
          <>
            <motion.div
              className="absolute inset-0"
              style={{
                background: 'radial-gradient(circle at 30% 70%, hsl(var(--primary) / 0.2) 0%, transparent 40%)',
                filter: 'blur(25px)',
              }}
              animate={{
                x: [-30, 30, -30],
                y: [20, -20, 20],
                opacity: [0.3, 0.7, 0.3],
              }}
              transition={{ duration: 0.2, repeat: Infinity }}
            />
            <motion.div
              className="absolute inset-0"
              style={{
                background: 'radial-gradient(circle at 70% 30%, hsl(var(--secondary) / 0.2) 0%, transparent 40%)',
                filter: 'blur(25px)',
              }}
              animate={{
                x: [20, -20, 20],
                y: [-30, 30, -30],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{ duration: 0.25, repeat: Infinity }}
            />
          </>
        )}
      </div>

      {/* Overlay gradient for depth - brightens with lightning */}
      <motion.div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, hsl(var(--background) / 0.2) 50%, hsl(var(--background) / 0.6) 100%)',
        }}
        animate={{
          opacity: lightningFlash ? 0.3 : 1,
        }}
        transition={{ duration: 0.1 }}
      />

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
