import { motion } from "framer-motion";
import { useState, useEffect, useRef, useCallback } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: { r: number; g: number; b: number };
}

interface StrokePoint {
  x: number;
  y: number;
}

const SpaceHero = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showVideo, setShowVideo] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>();

  const createParticle = useCallback((x: number, y: number): Particle => {
    const colors = [
      { r: 255, g: 220, b: 80 },
      { r: 255, g: 180, b: 50 },
      { r: 255, g: 120, b: 20 },
      { r: 255, g: 80, b: 0 },
      { r: 255, g: 255, b: 220 },
    ];
    
    return {
      x: x + (Math.random() - 0.5) * 12,
      y: y + (Math.random() - 0.5) * 12,
      vx: (Math.random() - 0.5) * 6,
      vy: -Math.random() * 8 - 4,
      life: 1,
      maxLife: 0.25 + Math.random() * 0.35,
      size: 4 + Math.random() * 10,
      color: colors[Math.floor(Math.random() * colors.length)],
    };
  }, []);

  // Define stroke paths for each letter (normalized 0-1 coordinates)
  const getLetterPaths = useCallback((letterWidth: number, letterHeight: number) => {
    const h = letterHeight;
    const w = letterWidth;
    
    return {
      'S': [
        // Top curve
        { x: w * 0.85, y: h * 0.15 },
        { x: w * 0.7, y: h * 0.05 },
        { x: w * 0.4, y: h * 0.05 },
        { x: w * 0.15, y: h * 0.15 },
        { x: w * 0.1, y: h * 0.3 },
        // Middle curve
        { x: w * 0.2, y: h * 0.45 },
        { x: w * 0.5, y: h * 0.5 },
        { x: w * 0.8, y: h * 0.55 },
        { x: w * 0.9, y: h * 0.7 },
        // Bottom curve
        { x: w * 0.85, y: h * 0.85 },
        { x: w * 0.6, y: h * 0.95 },
        { x: w * 0.3, y: h * 0.95 },
        { x: w * 0.1, y: h * 0.85 },
      ],
      'E': [
        // Vertical stroke
        { x: w * 0.15, y: h * 0.05 },
        { x: w * 0.15, y: h * 0.5 },
        { x: w * 0.15, y: h * 0.95 },
        // Bottom horizontal
        { x: w * 0.5, y: h * 0.95 },
        { x: w * 0.85, y: h * 0.95 },
        // Back to middle
        { x: w * 0.15, y: h * 0.5 },
        // Middle horizontal
        { x: w * 0.5, y: h * 0.5 },
        { x: w * 0.75, y: h * 0.5 },
        // Back to top
        { x: w * 0.15, y: h * 0.05 },
        // Top horizontal
        { x: w * 0.5, y: h * 0.05 },
        { x: w * 0.85, y: h * 0.05 },
      ],
      'N': [
        // Left vertical
        { x: w * 0.15, y: h * 0.95 },
        { x: w * 0.15, y: h * 0.5 },
        { x: w * 0.15, y: h * 0.05 },
        // Diagonal
        { x: w * 0.4, y: h * 0.35 },
        { x: w * 0.6, y: h * 0.65 },
        { x: w * 0.85, y: h * 0.95 },
        // Right vertical
        { x: w * 0.85, y: h * 0.5 },
        { x: w * 0.85, y: h * 0.05 },
      ],
      'I': [
        // Top serif
        { x: w * 0.2, y: h * 0.05 },
        { x: w * 0.5, y: h * 0.05 },
        { x: w * 0.8, y: h * 0.05 },
        // Vertical
        { x: w * 0.5, y: h * 0.05 },
        { x: w * 0.5, y: h * 0.5 },
        { x: w * 0.5, y: h * 0.95 },
        // Bottom serif
        { x: w * 0.2, y: h * 0.95 },
        { x: w * 0.8, y: h * 0.95 },
      ],
      'O': [
        // Circular path
        { x: w * 0.5, y: h * 0.05 },
        { x: w * 0.75, y: h * 0.1 },
        { x: w * 0.9, y: h * 0.25 },
        { x: w * 0.95, y: h * 0.5 },
        { x: w * 0.9, y: h * 0.75 },
        { x: w * 0.75, y: h * 0.9 },
        { x: w * 0.5, y: h * 0.95 },
        { x: w * 0.25, y: h * 0.9 },
        { x: w * 0.1, y: h * 0.75 },
        { x: w * 0.05, y: h * 0.5 },
        { x: w * 0.1, y: h * 0.25 },
        { x: w * 0.25, y: h * 0.1 },
        { x: w * 0.5, y: h * 0.05 },
      ],
      'R': [
        // Vertical stroke
        { x: w * 0.15, y: h * 0.95 },
        { x: w * 0.15, y: h * 0.5 },
        { x: w * 0.15, y: h * 0.05 },
        // Top curve
        { x: w * 0.4, y: h * 0.05 },
        { x: w * 0.7, y: h * 0.08 },
        { x: w * 0.85, y: h * 0.2 },
        { x: w * 0.85, y: h * 0.35 },
        { x: w * 0.7, y: h * 0.48 },
        { x: w * 0.4, y: h * 0.52 },
        { x: w * 0.15, y: h * 0.52 },
        // Leg
        { x: w * 0.4, y: h * 0.52 },
        { x: w * 0.6, y: h * 0.7 },
        { x: w * 0.85, y: h * 0.95 },
      ],
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d")!;
    
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
    };
    
    resize();
    window.addEventListener("resize", resize);

    const text = "SENIOR";
    const letters = text.split("");
    const fontSize = Math.min(window.innerWidth * 0.13, 150);
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    ctx.font = `bold ${fontSize}px "Space Grotesk", sans-serif`;
    const totalWidth = ctx.measureText(text).width;
    const letterSpacing = 12;
    
    // Calculate letter positions
    const letterData: { char: string; x: number; width: number; path: StrokePoint[] }[] = [];
    let currentX = centerX - totalWidth / 2 - (letterSpacing * (letters.length - 1)) / 2;
    
    const paths = getLetterPaths(fontSize * 0.7, fontSize);
    
    letters.forEach((letter) => {
      const width = ctx.measureText(letter).width;
      const letterPath = paths[letter as keyof typeof paths] || [];
      
      // Offset path points to letter position
      const offsetPath = letterPath.map(p => ({
        x: currentX + p.x,
        y: centerY - fontSize / 2 + p.y
      }));
      
      letterData.push({ char: letter, x: currentX, width, path: offsetPath });
      currentX += width + letterSpacing;
    });
    
    // Flatten all paths into one continuous path
    const allPoints: { point: StrokePoint; letterIndex: number }[] = [];
    letterData.forEach((data, letterIndex) => {
      data.path.forEach(point => {
        allPoints.push({ point, letterIndex });
      });
    });
    
    let lastTime = performance.now();
    const totalDuration = 2800;
    const startTime = performance.now();
    const revealedLetters = new Set<number>();
    
    const drawMetallicLetter = (
      letter: string,
      x: number,
      y: number,
      revealProgress: number,
      time: number
    ) => {
      if (revealProgress <= 0) return;
      
      ctx.save();
      
      const baseY = y;
      
      // Deep shadow layers for 3D depth
      for (let i = 5; i >= 1; i--) {
        ctx.fillStyle = `rgba(40, 15, 0, ${0.15 + (5 - i) * 0.05})`;
        ctx.font = `bold ${fontSize}px "Space Grotesk", sans-serif`;
        ctx.textBaseline = "middle";
        ctx.fillText(letter, x + i * 1.5, baseY + i * 2);
      }
      
      // Bronze/copper base layer
      const baseGradient = ctx.createLinearGradient(x, baseY - fontSize / 2, x, baseY + fontSize / 2);
      baseGradient.addColorStop(0, "#cd7f32");
      baseGradient.addColorStop(0.3, "#b87333");
      baseGradient.addColorStop(0.5, "#a0522d");
      baseGradient.addColorStop(0.7, "#8b4513");
      baseGradient.addColorStop(1, "#654321");
      
      ctx.fillStyle = baseGradient;
      ctx.fillText(letter, x + 2, baseY + 2);
      
      // Main metallic gold layer
      const metallicGradient = ctx.createLinearGradient(x, baseY - fontSize / 2, x + fontSize * 0.3, baseY + fontSize / 2);
      metallicGradient.addColorStop(0, "#fff8dc");
      metallicGradient.addColorStop(0.1, "#ffd700");
      metallicGradient.addColorStop(0.25, "#ffb347");
      metallicGradient.addColorStop(0.4, "#ff8c00");
      metallicGradient.addColorStop(0.55, "#ff6600");
      metallicGradient.addColorStop(0.7, "#ff4500");
      metallicGradient.addColorStop(0.85, "#cc3300");
      metallicGradient.addColorStop(1, "#8b0000");
      
      ctx.fillStyle = metallicGradient;
      ctx.fillText(letter, x, baseY);
      
      // Glossy top highlight (bevel effect)
      ctx.save();
      ctx.beginPath();
      const highlightHeight = fontSize * 0.35;
      ctx.rect(x - 20, baseY - fontSize / 2 - 10, fontSize * 2, highlightHeight);
      ctx.clip();
      
      const topShine = ctx.createLinearGradient(x, baseY - fontSize / 2, x, baseY - fontSize / 2 + highlightHeight);
      topShine.addColorStop(0, "rgba(255, 255, 255, 0.9)");
      topShine.addColorStop(0.3, "rgba(255, 255, 240, 0.6)");
      topShine.addColorStop(0.6, "rgba(255, 230, 180, 0.3)");
      topShine.addColorStop(1, "rgba(255, 200, 100, 0)");
      
      ctx.fillStyle = topShine;
      ctx.fillText(letter, x, baseY);
      ctx.restore();
      
      // Moving specular highlight
      const specularX = x + Math.sin(time * 0.002) * 20;
      const specularGradient = ctx.createRadialGradient(
        specularX, baseY - fontSize * 0.2, 0,
        specularX, baseY - fontSize * 0.2, fontSize * 0.4
      );
      specularGradient.addColorStop(0, "rgba(255, 255, 255, 0.5)");
      specularGradient.addColorStop(0.5, "rgba(255, 255, 200, 0.2)");
      specularGradient.addColorStop(1, "rgba(255, 220, 150, 0)");
      
      ctx.save();
      ctx.globalCompositeOperation = "overlay";
      ctx.fillStyle = specularGradient;
      ctx.fillText(letter, x, baseY);
      ctx.restore();
      
      // Edge highlight (rim light)
      ctx.strokeStyle = "rgba(255, 255, 220, 0.5)";
      ctx.lineWidth = 1.5;
      ctx.strokeText(letter, x - 0.5, baseY - 0.5);
      
      // Outer glow
      ctx.shadowColor = "rgba(255, 100, 0, 0.7)";
      ctx.shadowBlur = 30;
      ctx.fillStyle = "rgba(0,0,0,0)";
      ctx.fillText(letter, x, baseY);
      
      ctx.restore();
    };
    
    const animate = (currentTime: number) => {
      const deltaTime = (currentTime - lastTime) / 1000;
      lastTime = currentTime;
      
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / totalDuration, 1);
      
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      
      // Calculate current point index
      const currentPointIndex = Math.floor(progress * allPoints.length);
      
      // Track which letters should be fully revealed
      for (let i = 0; i <= currentPointIndex && i < allPoints.length; i++) {
        revealedLetters.add(allPoints[i].letterIndex);
      }
      
      // Draw revealed letters
      letterData.forEach((data, index) => {
        if (revealedLetters.has(index)) {
          drawMetallicLetter(data.char, data.x, centerY, 1, currentTime);
        }
      });
      
      // Draw flame at current stroke position
      if (progress < 1 && currentPointIndex < allPoints.length) {
        const currentData = allPoints[currentPointIndex];
        const flameX = currentData.point.x;
        const flameY = currentData.point.y;
        
        // Add particles
        for (let i = 0; i < 10; i++) {
          particlesRef.current.push(createParticle(flameX, flameY));
        }
        
        // Outer flame glow
        const outerGlow = ctx.createRadialGradient(flameX, flameY, 0, flameX, flameY, 100);
        outerGlow.addColorStop(0, "rgba(255, 200, 100, 0.6)");
        outerGlow.addColorStop(0.3, "rgba(255, 120, 0, 0.4)");
        outerGlow.addColorStop(0.6, "rgba(255, 60, 0, 0.2)");
        outerGlow.addColorStop(1, "rgba(200, 30, 0, 0)");
        
        ctx.fillStyle = outerGlow;
        ctx.beginPath();
        ctx.arc(flameX, flameY, 100, 0, Math.PI * 2);
        ctx.fill();
        
        // Main flame
        const flameGradient = ctx.createRadialGradient(flameX, flameY, 0, flameX, flameY, 50);
        flameGradient.addColorStop(0, "rgba(255, 255, 255, 1)");
        flameGradient.addColorStop(0.15, "rgba(255, 255, 200, 0.95)");
        flameGradient.addColorStop(0.35, "rgba(255, 220, 100, 0.8)");
        flameGradient.addColorStop(0.6, "rgba(255, 150, 50, 0.5)");
        flameGradient.addColorStop(1, "rgba(255, 80, 0, 0)");
        
        ctx.fillStyle = flameGradient;
        ctx.beginPath();
        ctx.arc(flameX, flameY, 50, 0, Math.PI * 2);
        ctx.fill();
        
        // Hot white core
        const coreGradient = ctx.createRadialGradient(flameX, flameY, 0, flameX, flameY, 15);
        coreGradient.addColorStop(0, "rgba(255, 255, 255, 1)");
        coreGradient.addColorStop(0.5, "rgba(255, 255, 255, 0.8)");
        coreGradient.addColorStop(1, "rgba(255, 255, 220, 0)");
        
        ctx.fillStyle = coreGradient;
        ctx.beginPath();
        ctx.arc(flameX, flameY, 15, 0, Math.PI * 2);
        ctx.fill();
      }
      
      // Update and draw particles
      particlesRef.current = particlesRef.current.filter(particle => {
        particle.life -= deltaTime / particle.maxLife;
        if (particle.life <= 0) return false;
        
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vy -= 0.25;
        particle.vx *= 0.96;
        particle.size *= 0.94;
        
        const alpha = particle.life * 0.9;
        
        const particleGradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.size
        );
        particleGradient.addColorStop(0, `rgba(${particle.color.r}, ${particle.color.g}, ${particle.color.b}, ${alpha})`);
        particleGradient.addColorStop(0.5, `rgba(${particle.color.r}, ${particle.color.g}, ${particle.color.b}, ${alpha * 0.5})`);
        particleGradient.addColorStop(1, `rgba(${particle.color.r}, ${particle.color.g}, ${particle.color.b}, 0)`);
        
        ctx.fillStyle = particleGradient;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        
        return true;
      });
      
      if (progress < 1 || particlesRef.current.length > 0) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setAnimationComplete(true);
        setTimeout(() => setShowVideo(true), 300);
      }
    };
    
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      window.removeEventListener("resize", resize);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [createParticle, getLetterPaths]);

  return (
    <section className="relative h-screen w-full overflow-hidden bg-[#020205]">
      <div className="absolute inset-0 bg-gradient-to-b from-[#020205] via-[#0a0a15] to-[#020205]" />

      {showVideo && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} className="absolute inset-0 z-0">
          <video autoPlay muted loop playsInline className="h-full w-full object-cover opacity-60">
            <source src="https://cdn.pixabay.com/video/2020/05/25/40130-424930032_large.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-t from-[#020205] via-transparent to-[#020205]/80" />
        </motion.div>
      )}

      <canvas ref={canvasRef} className="absolute inset-0 z-10" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: animationComplete ? 1 : 0, y: animationComplete ? 0 : 20 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="absolute left-1/2 top-[60%] -translate-x-1/2 z-30 text-center"
      >
        <p className="font-body text-lg tracking-widest text-muted-foreground sm:text-xl md:text-2xl">AI AUTOMATION SPECIALIST</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: showVideo ? 1 : 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30"
      >
        <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 1.5, repeat: Infinity }} className="flex flex-col items-center gap-2">
          <span className="text-xs tracking-widest text-muted-foreground">SCROLL</span>
          <div className="h-10 w-[1px] bg-gradient-to-b from-muted-foreground to-transparent" />
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: animationComplete ? 0.5 : 0 }}
        transition={{ duration: 1 }}
        className="absolute bottom-0 left-1/2 h-[40%] w-[80%] -translate-x-1/2 z-0"
        style={{ background: "radial-gradient(ellipse at bottom, rgba(255, 80, 0, 0.3) 0%, transparent 70%)" }}
      />
    </section>
  );
};

export default SpaceHero;