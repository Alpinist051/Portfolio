import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useState, useRef, useEffect, useMemo } from "react";
import { Mic, MicOff, Video, VideoOff, Phone, PhoneOff, Volume2, VolumeX, MessageSquare, Zap, Users, Settings } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, useAnimations } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Speech Recognition API types
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onend: (() => void) | null;
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

declare var SpeechRecognition: {
  prototype: SpeechRecognition;
  new(): SpeechRecognition;
};

interface LipSyncAvatarProps {
  isSpeaking: boolean;
  audioLevel: number;
  mouthShape: 'closed' | 'slightlyOpen' | 'open' | 'wideOpen';
}

// Floating particles component
const FloatingParticles = ({ isSpeaking }: { isSpeaking: boolean }) => {
  const particlesRef = useRef<THREE.InstancedMesh>(null);
  const particleCount = 20;

  useFrame((state) => {
    if (particlesRef.current && isSpeaking) {
      const matrix = new THREE.Matrix4();
      for (let i = 0; i < particleCount; i++) {
        const time = state.clock.elapsedTime + i;
        const radius = 2 + Math.sin(time * 0.5) * 0.5;
        const angle = (i / particleCount) * Math.PI * 2 + time * 0.2;
        const height = Math.sin(time * 2 + i) * 0.3;

        matrix.setPosition(
          Math.cos(angle) * radius,
          height,
          Math.sin(angle) * radius
        );
        particlesRef.current.setMatrixAt(i, matrix);
      }
      particlesRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  if (!isSpeaking) return null;

  return (
    <instancedMesh ref={particlesRef} args={[undefined, undefined, particleCount]}>
      <sphereGeometry args={[0.02, 8, 8]} />
      <meshBasicMaterial color="#4A90E2" transparent opacity={0.6} />
    </instancedMesh>
  );
};

// Realistic Human Avatar Component
const Avatar3D = ({ isSpeaking, audioLevel, mouthShape }: LipSyncAvatarProps) => {
  const headRef = useRef<THREE.Mesh>(null);
  const faceRef = useRef<THREE.Group>(null);
  const leftEyeRef = useRef<THREE.Group>(null);
  const rightEyeRef = useRef<THREE.Group>(null);
  const mouthRef = useRef<THREE.Group>(null);
  const hairRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.InstancedMesh>(null);

  // Blend shape morph targets for lip sync
  const blendShapes = useRef({
    mouthOpen: 0,
    mouthWide: 0,
    jawOpen: 0,
    lipStretch: 0,
  });

  // Create optimized facial geometry
  const createFaceGeometry = () => {
    const geometry = new THREE.BufferGeometry();

    // Create a detailed but optimized face mesh
    const vertices = [];
    const indices = [];
    const uvs = [];

    // Face base - optimized for performance while maintaining detail
    const radius = 0.95;
    const widthSegments = 48; // Reduced for better performance
    const heightSegments = 48; // Reduced for better performance

    for (let lat = 0; lat <= heightSegments; lat++) {
      const theta = (lat * Math.PI) / heightSegments;
      const sinTheta = Math.sin(theta);
      const cosTheta = Math.cos(theta);

      for (let lon = 0; lon <= widthSegments; lon++) {
        const phi = (lon * 2 * Math.PI) / widthSegments;
        const sinPhi = Math.sin(phi);
        const cosPhi = Math.cos(phi);

        // Add some facial features deformation
        let x = radius * sinTheta * cosPhi;
        let y = radius * cosTheta;
        let z = radius * sinTheta * sinPhi;

        // Nose protrusion
        if (Math.abs(x) < 0.15 && y > -0.1 && y < 0.3 && z > 0.7) {
          z += 0.08;
          if (y < 0.1) y -= 0.02;
        }

        // Cheek bones
        const cheekDist = Math.sqrt(x * x + (y - 0.1) * (y - 0.1));
        if (cheekDist < 0.6 && z > 0.3) {
          x *= 1 + 0.05 * Math.exp(-cheekDist * cheekDist * 4);
        }

        // Chin definition
        if (y < -0.7 && Math.abs(x) < 0.3) {
          y -= 0.05;
        }

        vertices.push(x, y, z);
        uvs.push(lon / widthSegments, lat / heightSegments);
      }
    }

    // Generate indices
    for (let lat = 0; lat < heightSegments; lat++) {
      for (let lon = 0; lon < widthSegments; lon++) {
        const first = lat * (widthSegments + 1) + lon;
        const second = first + widthSegments + 1;

        indices.push(first, second, first + 1);
        indices.push(second, second + 1, first + 1);
      }
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();

    return geometry;
  };

  const faceGeometry = useMemo(() => createFaceGeometry(), []);

  useFrame((state) => {
    if (headRef.current) {
      // Natural head movement and subtle breathing
      const time = state.clock.elapsedTime;

      if (isSpeaking) {
        // More dynamic movement when speaking
        headRef.current.rotation.y = Math.sin(time * 1.5) * 0.03;
        headRef.current.position.y = Math.sin(time * 3) * 0.015 + Math.sin(time * 0.3) * 0.005; // Add breathing
        headRef.current.rotation.x = Math.sin(time * 2.2) * 0.02;
      } else {
        // Return to neutral with subtle breathing
        headRef.current.rotation.y *= 0.98;
        headRef.current.position.y = Math.sin(time * 0.3) * 0.003; // Subtle breathing animation
        headRef.current.rotation.x *= 0.98;
      }

      // Subtle breathing scale animation
      const breathScale = 1 + Math.sin(time * 0.5) * 0.002;
      headRef.current.scale.setScalar(breathScale);
    }

    // Eye blinking animation
    if (leftEyeRef.current && rightEyeRef.current) {
      const blinkTime = state.clock.elapsedTime * 0.8;
      if (Math.sin(blinkTime) > 0.95 && Math.random() < 0.3) {
        const blinkProgress = Math.sin(blinkTime * 15) * 0.9 + 0.1;
        leftEyeRef.current.scale.y = blinkProgress;
        rightEyeRef.current.scale.y = blinkProgress;
      } else {
        leftEyeRef.current.scale.y = THREE.MathUtils.lerp(leftEyeRef.current.scale.y, 1, 0.1);
        rightEyeRef.current.scale.y = THREE.MathUtils.lerp(rightEyeRef.current.scale.y, 1, 0.1);
      }
    }

    // Advanced lip sync animation
    if (mouthRef.current) {
      let mouthOpen = 0;
      let mouthWide = 0;
      let jawOpen = 0;
      let lipStretch = 0;

      switch (mouthShape) {
        case 'closed':
          mouthOpen = 0.1;
          mouthWide = 0.3;
          jawOpen = 0.05;
          break;
        case 'slightlyOpen':
          mouthOpen = 0.35;
          mouthWide = 0.4;
          jawOpen = 0.15;
          break;
        case 'open':
          mouthOpen = 0.6;
          mouthWide = 0.5;
          jawOpen = 0.25;
          lipStretch = 0.1;
          break;
        case 'wideOpen':
          mouthOpen = 0.9;
          mouthWide = 0.8;
          jawOpen = 0.4;
          lipStretch = 0.2;
          break;
      }

      // Smooth morphing
      blendShapes.current.mouthOpen = THREE.MathUtils.lerp(blendShapes.current.mouthOpen, mouthOpen, 0.15);
      blendShapes.current.mouthWide = THREE.MathUtils.lerp(blendShapes.current.mouthWide, mouthWide, 0.15);
      blendShapes.current.jawOpen = THREE.MathUtils.lerp(blendShapes.current.jawOpen, jawOpen, 0.15);
      blendShapes.current.lipStretch = THREE.MathUtils.lerp(blendShapes.current.lipStretch, lipStretch, 0.15);

      // Apply morphing to mouth geometry
      mouthRef.current.scale.y = 0.8 + blendShapes.current.mouthOpen * 0.4;
      mouthRef.current.scale.x = 0.9 + blendShapes.current.mouthWide * 0.3;
      mouthRef.current.position.y = -0.25 - blendShapes.current.jawOpen * 0.1;
    }

    // Animate particles
    if (particlesRef.current && isSpeaking) {
      const time = state.clock.elapsedTime;
      const matrix = new THREE.Matrix4();
      const particleCount = 25;

      for (let i = 0; i < particleCount; i++) {
        const angle = (i / particleCount) * Math.PI * 2 + time * 0.3;
        const radius = 1.8 + Math.sin(time * 0.7 + i) * 0.4;
        const height = Math.sin(time * 2.5 + i * 0.5) * 0.4;
        const wave = Math.sin(time * 3 + i * 0.3) * 0.2;

        matrix.setPosition(
          Math.cos(angle) * radius + wave,
          height + Math.sin(time * 1.8 + i) * 0.2,
          Math.sin(angle) * radius + wave
        );
        particlesRef.current.setMatrixAt(i, matrix);
      }
      particlesRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <group>
      {/* Enhanced particle system */}
      <FloatingParticles isSpeaking={isSpeaking} />

      {/* Main head group */}
      <group ref={headRef as unknown as React.RefObject<THREE.Group>}>
        {/* Face with realistic skin material */}
        <mesh ref={faceRef as unknown as React.RefObject<THREE.Mesh>} geometry={faceGeometry}>
          <meshStandardMaterial
            color="#F5D5A8"
            roughness={0.3}
            metalness={0.0}
            emissive={isSpeaking ? "#FFF8DC" : "#000000"}
            emissiveIntensity={isSpeaking ? 0.03 : 0}
            transparent={false}
            // Skin subsurface scattering approximation
            normalScale={new THREE.Vector2(0.5, 0.5)}
            // Add slight translucency for realistic skin
            opacity={0.98}
          />
        </mesh>

        {/* Eyes */}
        <group ref={leftEyeRef}>
          {/* Eye white */}
          <mesh position={[-0.25, 0.15, 0.85]}>
            <sphereGeometry args={[0.08, 12, 12]} />
            <meshStandardMaterial
              color="#FFFFFF"
              roughness={0.1}
              metalness={0.0}
            />
          </mesh>
          {/* Iris */}
          <mesh position={[-0.25, 0.15, 0.88]}>
            <sphereGeometry args={[0.045, 10, 10]} />
            <meshStandardMaterial
              color="#4A90E2"
              roughness={0.1}
              metalness={0.05}
              // Add slight wetness effect
              emissive="#4A90E2"
              emissiveIntensity={0.02}
            />
          </mesh>
          {/* Pupil */}
          <mesh position={[-0.25, 0.15, 0.905]}>
            <sphereGeometry args={[0.025, 6, 6]} />
            <meshStandardMaterial color="#000000" />
          </mesh>
        </group>

        <group ref={rightEyeRef}>
          {/* Eye white */}
          <mesh position={[0.25, 0.15, 0.85]}>
            <sphereGeometry args={[0.08, 12, 12]} />
            <meshStandardMaterial
              color="#FFFFFF"
              roughness={0.1}
              metalness={0.0}
            />
          </mesh>
          {/* Iris */}
          <mesh position={[0.25, 0.15, 0.88]}>
            <sphereGeometry args={[0.045, 10, 10]} />
            <meshStandardMaterial
              color="#4A90E2"
              roughness={0.1}
              metalness={0.05}
              // Add slight wetness effect
              emissive="#4A90E2"
              emissiveIntensity={0.02}
            />
          </mesh>
          {/* Pupil */}
          <mesh position={[0.25, 0.15, 0.905]}>
            <sphereGeometry args={[0.025, 6, 6]} />
            <meshStandardMaterial color="#000000" />
          </mesh>
        </group>

        {/* Eyebrows */}
        <mesh position={[-0.25, 0.35, 0.75]}>
          <boxGeometry args={[0.15, 0.02, 0.02]} />
          <meshStandardMaterial color="#3A3A3A" />
        </mesh>
        <mesh position={[0.25, 0.35, 0.75]}>
          <boxGeometry args={[0.15, 0.02, 0.02]} />
          <meshStandardMaterial color="#3A3A3A" />
        </mesh>

        {/* Nose */}
        <mesh position={[0, 0.05, 0.95]}>
          <coneGeometry args={[0.03, 0.08, 8]} />
          <meshStandardMaterial
            color="#E8B98A"
            roughness={0.8}
            metalness={0.0}
          />
        </mesh>

        {/* Nostrils */}
        <mesh position={[-0.015, -0.02, 0.98]}>
          <sphereGeometry args={[0.008, 6, 6]} />
          <meshStandardMaterial color="#2A2A2A" />
        </mesh>
        <mesh position={[0.015, -0.02, 0.98]}>
          <sphereGeometry args={[0.008, 6, 6]} />
          <meshStandardMaterial color="#2A2A2A" />
        </mesh>

        {/* Mouth */}
        <group ref={mouthRef}>
          {/* Upper lip */}
          <mesh position={[0, -0.15, 0.9]}>
            <boxGeometry args={[0.12, 0.02, 0.02]} />
            <meshStandardMaterial
              color="#D46A6A"
              roughness={0.9}
              metalness={0.0}
            />
          </mesh>
          {/* Lower lip */}
          <mesh position={[0, -0.25, 0.88]}>
            <boxGeometry args={[0.1, 0.02, 0.02]} />
            <meshStandardMaterial
              color="#C85555"
              roughness={0.9}
              metalness={0.0}
            />
          </mesh>
          {/* Inner mouth */}
          <mesh position={[0, -0.2, 0.85]}>
            <sphereGeometry args={[0.08, 12, 12]} />
            <meshStandardMaterial
              color="#FF6B9D"
              emissive={isSpeaking ? "#FF6B9D" : "#000000"}
              emissiveIntensity={isSpeaking ? 0.1 : 0}
            />
          </mesh>
        </group>

        {/* Hair */}
        <mesh ref={hairRef} position={[0, 0.4, 0]}>
          <sphereGeometry args={[0.95, 24, 24, 0, Math.PI * 2, 0, Math.PI / 2.2]} />
          <meshStandardMaterial
            color="#2C3E50"
            roughness={0.9}
            metalness={0.1}
          />
        </mesh>

        {/* Sideburns/Ears */}
        <mesh position={[-0.45, 0, 0]}>
          <cylinderGeometry args={[0.08, 0.06, 0.3, 8]} />
          <meshStandardMaterial
            color="#E8B98A"
            roughness={0.8}
            metalness={0.0}
          />
        </mesh>
        <mesh position={[0.45, 0, 0]}>
          <cylinderGeometry args={[0.08, 0.06, 0.3, 8]} />
          <meshStandardMaterial
            color="#E8B98A"
            roughness={0.8}
            metalness={0.0}
          />
        </mesh>
      </group>

      {/* Advanced lighting setup for realistic rendering */}
      <ambientLight intensity={0.2} color="#FFF8DC" />

      {/* Main key light */}
      <directionalLight
        position={[2, 3, 2]}
        intensity={1.2}
        color="#FFF8DC"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={15}
        shadow-camera-left={-3}
        shadow-camera-right={3}
        shadow-camera-top={3}
        shadow-camera-bottom={-3}
        shadow-bias={-0.0001}
      />

      {/* Fill light from the side */}
      <directionalLight
        position={[-2, 1, 1]}
        intensity={0.4}
        color="#FFB6C1"
      />

      {/* Rim light for definition */}
      <directionalLight
        position={[0, 2, -3]}
        intensity={0.3}
        color="#FFFFFF"
      />

      {/* Subtle bounce light from below */}
      <directionalLight
        position={[0, -2, 0]}
        intensity={0.2}
        color="#4A90E2"
      />

      {/* Accent point light for highlights */}
      <pointLight
        position={[3, 2, 3]}
        intensity={0.3}
        color="#FFF8DC"
        distance={10}
        decay={2}
      />

      {/* Environment light for overall illumination */}
      <hemisphereLight
        intensity={0.3}
        groundColor="#4A5D23"
        color="#87CEEB"
      />
    </group>
  );
};

const LipSyncAvatar = ({ isSpeaking, audioLevel, mouthShape }: LipSyncAvatarProps) => {
  return (
    <div className="relative h-80 w-full">
      <Canvas
        camera={{ position: [0, 0, 3], fov: 50 }}
        style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' }}
      >
        <Avatar3D isSpeaking={isSpeaking} audioLevel={audioLevel} mouthShape={mouthShape} />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          maxPolarAngle={Math.PI / 1.8}
          minPolarAngle={Math.PI / 2.2}
        />
      </Canvas>

      {isSpeaking && (
        <motion.div
          className="absolute -inset-2 rounded-lg border-2 border-primary"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      )}
    </div>
  );
};

const LipsyncPage = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [currentMessage, setCurrentMessage] = useState("");
  const [audioLevel, setAudioLevel] = useState(0);
  const [mouthShape, setMouthShape] = useState<'closed' | 'slightlyOpen' | 'open' | 'wideOpen'>('closed');

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        setTranscript(finalTranscript + interimTranscript);
        setCurrentMessage(interimTranscript);

        // Advanced phoneme-based lip sync
        if (interimTranscript.length > 0) {
          const lastChars = interimTranscript.slice(-3).toLowerCase();

          // Phoneme mapping for more realistic lip sync
          if (lastChars.match(/[mbp]/)) {
            setMouthShape('closed'); // Bilabial consonants
          } else if (lastChars.match(/[fv]/)) {
            setMouthShape('slightlyOpen'); // Labiodental
          } else if (lastChars.match(/[ao]/)) {
            setMouthShape('wideOpen'); // Open vowels
          } else if (lastChars.match(/[ei]/)) {
            setMouthShape('open'); // Close-mid vowels
          } else if (lastChars.match(/[ou]/)) {
            setMouthShape('open'); // Rounded vowels
          } else if (lastChars.match(/[tdnlsz]/)) {
            setMouthShape('slightlyOpen'); // Alveolar consonants
          } else if (lastChars.match(/[kg]/)) {
            setMouthShape('slightlyOpen'); // Velar consonants
          } else if (lastChars.match(/[w]/)) {
            setMouthShape('closed'); // Labial-velar
          } else if (lastChars.match(/[r]/)) {
            setMouthShape('slightlyOpen'); // Alveolar approximant
          } else if (lastChars.match(/[th]/)) {
            setMouthShape('open'); // Dental fricatives
          } else {
            // Default based on length and speaking rhythm
            const speakingSpeed = interimTranscript.length / (interimTranscript.split(' ').length + 1);
            if (speakingSpeed > 4) {
              setMouthShape('wideOpen');
            } else if (speakingSpeed > 2.5) {
              setMouthShape('open');
            } else {
              setMouthShape('slightlyOpen');
            }
          }
        }
      };

      recognitionRef.current.onend = () => {
        setMouthShape('closed');
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Audio level monitoring
  useEffect(() => {
    if (isRecording && streamRef.current) {
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const microphone = audioContextRef.current.createMediaStreamSource(streamRef.current);
      microphone.connect(analyserRef.current);
      analyserRef.current.fftSize = 256;

      const bufferLength = analyserRef.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const updateAudioLevel = () => {
        if (analyserRef.current) {
          analyserRef.current.getByteFrequencyData(dataArray);
          const average = dataArray.reduce((a, b) => a + b) / bufferLength;
          setAudioLevel(average / 255); // Normalize to 0-1
          requestAnimationFrame(updateAudioLevel);
        }
      };

      updateAudioLevel();
    }

    return () => {
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
    };
  }, [isRecording]);

  const toggleRecording = async () => {
    if (!isRecording) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: isVideoOn
        });
        streamRef.current = stream;

        if (recognitionRef.current) {
          recognitionRef.current.start();
        }

        setIsRecording(true);
        setIsConnected(true);
      } catch (error) {
        console.error('Error accessing microphone:', error);
        alert('Please allow microphone access to use the lip sync feature.');
      }
    } else {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      setIsRecording(false);
      setIsConnected(false);
      setTranscript("");
      setCurrentMessage("");
      setAudioLevel(0);
      setMouthShape('closed');
    }
  };

  const toggleVideo = async () => {
    if (!isVideoOn) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        // In a real implementation, you would handle the video stream here
        setIsVideoOn(true);
      } catch (error) {
        console.error('Error accessing camera:', error);
        alert('Please allow camera access to use video features.');
      }
    } else {
      setIsVideoOn(false);
    }
  };

  const toggleAudio = () => {
    setIsAudioOn(!isAudioOn);
    if (streamRef.current) {
      streamRef.current.getAudioTracks().forEach(track => {
        track.enabled = !isAudioOn;
      });
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      <section className="relative pb-20 pt-32">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/5 to-background" />

        {/* Grid pattern background */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(100, 100, 100, 0.15) 1px, transparent 1px),
              linear-gradient(90deg, rgba(100, 100, 100, 0.15) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />

        <div className="container relative z-10 mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12 text-center"
          >
            <Link
              to="/"
              className="mb-6 inline-flex items-center gap-2 font-body text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              Back to Home
            </Link>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/20"
            >
              <MessageSquare className="h-8 w-8 text-primary" />
            </motion.div>

            <h1 className="font-display text-4xl font-bold tracking-wider md:text-5xl">
              3D LIP <span className="text-neon">SYNC</span> PLATFORM
            </h1>
            <p className="mx-auto mt-4 max-w-2xl font-body text-muted-foreground">
              Interactive 3D avatar with real-time lip synchronization, audio-to-text conversion, and streaming conversation capabilities.
            </p>
          </motion.div>

          {/* Main Lip Sync Interface */}
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-8 lg:grid-cols-2">

              {/* Left Panel - Avatar and Controls */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="space-y-6"
              >
                {/* Avatar Section */}
                <div className="rounded-2xl border border-border bg-card p-6">
                  <h3 className="mb-4 font-display text-lg font-semibold text-foreground">3D Lip Sync Avatar</h3>
                  <div className="flex justify-center">
                    <div className="w-full max-w-md">
                      <LipSyncAvatar
                        isSpeaking={isRecording}
                        audioLevel={audioLevel}
                        mouthShape={mouthShape}
                      />
                    </div>
                  </div>
                  <div className="mt-4 text-center">
                    <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs ${
                      isConnected
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-gray-500/20 text-gray-400'
                    }`}>
                      <div className={`h-2 w-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-gray-400'}`} />
                      {isConnected ? 'Connected' : 'Disconnected'}
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">
                      Drag to rotate • Mouth syncs with your speech
                    </p>
                  </div>
                </div>

                {/* Control Panel */}
                <div className="rounded-2xl border border-border bg-card p-6">
                  <h3 className="mb-4 font-display text-lg font-semibold text-foreground">Controls</h3>
                  <div className="grid grid-cols-2 gap-4">

                    {/* Audio Toggle */}
                    <motion.button
                      onClick={toggleAudio}
                      className={`flex flex-col items-center gap-2 rounded-lg p-4 transition-all ${
                        isAudioOn
                          ? 'bg-primary/10 border border-primary/30'
                          : 'bg-muted/50 border border-border'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {isAudioOn ? (
                        <Volume2 className="h-6 w-6 text-primary" />
                      ) : (
                        <VolumeX className="h-6 w-6 text-muted-foreground" />
                      )}
                      <span className="font-body text-sm text-muted-foreground">Audio</span>
                    </motion.button>

                    {/* Video Toggle */}
                    <motion.button
                      onClick={toggleVideo}
                      className={`flex flex-col items-center gap-2 rounded-lg p-4 transition-all ${
                        isVideoOn
                          ? 'bg-primary/10 border border-primary/30'
                          : 'bg-muted/50 border border-border'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {isVideoOn ? (
                        <Video className="h-6 w-6 text-primary" />
                      ) : (
                        <VideoOff className="h-6 w-6 text-muted-foreground" />
                      )}
                      <span className="font-body text-sm text-muted-foreground">Video</span>
                    </motion.button>

                    {/* Record/Stop Button */}
                    <motion.button
                      onClick={toggleRecording}
                      className={`flex flex-col items-center gap-2 rounded-lg p-4 transition-all ${
                        isRecording
                          ? 'bg-red-500/10 border border-red-500/30'
                          : 'bg-green-500/10 border border-green-500/30'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {isRecording ? (
                        <>
                          <PhoneOff className="h-6 w-6 text-red-400" />
                          <span className="font-body text-sm text-red-400">Stop</span>
                        </>
                      ) : (
                        <>
                          <Phone className="h-6 w-6 text-green-400" />
                          <span className="font-body text-sm text-green-400">Start</span>
                        </>
                      )}
                    </motion.button>

                    {/* Settings */}
                    <motion.button
                      className="flex flex-col items-center gap-2 rounded-lg bg-muted/50 border border-border p-4 transition-all hover:bg-primary/10 hover:border-primary/30"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Settings className="h-6 w-6 text-muted-foreground" />
                      <span className="font-body text-sm text-muted-foreground">Settings</span>
                    </motion.button>
                  </div>
                </div>

                {/* Audio Level Indicator */}
                <div className="rounded-2xl border border-border bg-card p-6">
                  <h3 className="mb-4 font-display text-lg font-semibold text-foreground">Audio Level</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Level</span>
                      <span>{Math.round(audioLevel * 100)}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
                        style={{ width: `${audioLevel * 100}%` }}
                        transition={{ duration: 0.1 }}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Right Panel - Transcript and Features */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="space-y-6"
              >
                {/* Live Transcript */}
                <div className="rounded-2xl border border-border bg-card p-6">
                  <h3 className="mb-4 font-display text-lg font-semibold text-foreground">Live Transcript</h3>
                  <div className="min-h-[120px] rounded-lg bg-muted/30 p-4">
                    <div className="font-body text-sm leading-relaxed text-muted-foreground">
                      {transcript || "Start speaking to see live transcription..."}
                    </div>
                    {currentMessage && (
                      <motion.div
                        className="mt-2 font-body text-sm text-primary"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        {currentMessage}
                      </motion.div>
                    )}
                  </div>
                </div>

                {/* Features */}
                <div className="rounded-2xl border border-border bg-card p-6">
                  <h3 className="mb-4 font-display text-lg font-semibold text-foreground">Features</h3>
                  <div className="grid gap-4">
                    {[
                      {
                        icon: Mic,
                        title: "Audio-to-Text",
                        description: "Real-time speech recognition with live transcription"
                      },
                      {
                        icon: MessageSquare,
                        title: "3D Lip Sync Animation",
                        description: "Interactive 3D avatar with dynamic mouth movements synchronized with speech"
                      },
                      {
                        icon: Users,
                        title: "Real-time Conversation",
                        description: "Live streaming conversation with avatar responses"
                      },
                      {
                        icon: Zap,
                        title: "Audio Level Monitoring",
                        description: "Visual feedback for audio input levels and 3D head animation"
                      }
                    ].map((feature, index) => (
                      <motion.div
                        key={feature.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 * index }}
                        className="flex items-start gap-3 rounded-lg bg-muted/30 p-3"
                      >
                        <feature.icon className="mt-0.5 h-5 w-5 text-primary" />
                        <div>
                          <h4 className="font-display text-sm font-semibold text-foreground">{feature.title}</h4>
                          <p className="font-body text-xs text-muted-foreground">{feature.description}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Status */}
                <div className="rounded-2xl border border-border bg-card p-6">
                  <h3 className="mb-4 font-display text-lg font-semibold text-foreground">System Status</h3>
                  <div className="space-y-3">
                    {[
                      { label: "Speech Recognition", status: "webkitSpeechRecognition" in window || "SpeechRecognition" in window ? "Available" : "Not Supported" },
                      { label: "WebRTC", status: "RTCPeerConnection" in window ? "Available" : "Not Supported" },
                      { label: "Media Devices", status: "mediaDevices" in navigator ? "Available" : "Not Supported" },
                      { label: "Audio Context", status: "AudioContext" in window || "webkitAudioContext" in window ? "Available" : "Not Supported" },
                      { label: "WebGL", status: (() => {
                        try {
                          const canvas = document.createElement('canvas');
                          return canvas.getContext('webgl') || canvas.getContext('experimental-webgl') ? "Available" : "Not Supported";
                        } catch (e) {
                          return "Not Supported";
                        }
                      })() },
                      { label: "3D Rendering", status: "THREE" in window ? "Available" : "Available (React Three Fiber)" }
                    ].map((item, index) => (
                      <div key={item.label} className="flex items-center justify-between">
                        <span className="font-body text-sm text-muted-foreground">{item.label}</span>
                        <span className={`font-display text-xs px-2 py-1 rounded-full ${
                          item.status === "Available"
                            ? "bg-green-500/20 text-green-400"
                            : "bg-red-500/20 text-red-400"
                        }`}>
                          {item.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Instructions */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-12 rounded-2xl border border-border bg-card p-6"
            >
              <h3 className="mb-4 font-display text-lg font-semibold text-foreground">How to Use</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="mb-2 font-display text-base font-semibold text-primary">Getting Started</h4>
                  <ol className="list-decimal list-inside space-y-1 font-body text-sm text-muted-foreground">
                    <li>Click the "Start" button to begin the lip sync session</li>
                    <li>Allow microphone access when prompted</li>
                    <li>Start speaking to see the avatar's mouth move in sync</li>
                    <li>Watch the live transcript appear in real-time</li>
                  </ol>
                </div>
                <div>
                  <h4 className="mb-2 font-display text-base font-semibold text-primary">Features</h4>
                  <ul className="list-disc list-inside space-y-1 font-body text-sm text-muted-foreground">
                    <li>Interactive 3D avatar with real-time lip sync</li>
                    <li>Drag to rotate and explore the 3D model</li>
                    <li>Audio level visualization and head animation</li>
                    <li>Live speech-to-text transcription</li>
                    <li>WebGL-powered 3D rendering</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default LipsyncPage;