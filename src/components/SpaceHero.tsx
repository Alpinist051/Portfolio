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
      { r: 255, g: 230, b: 100 },
      { r: 255, g: 180, b: 50 },
      { r: 255, g: 140, b: 30 },
      { r: 255, g: 100, b: 10 },
      { r: 255, g: 255, b: 230 },
    ];
    
    return {
      x: x + (Math.random() - 0.5) * 8,
      y: y + (Math.random() - 0.5) * 8,
      vx: (Math.random() - 0.5) * 5,
      vy: -Math.random() * 7 - 3,
      life: 1,
      maxLife: 0.2 + Math.random() * 0.3,
      size: 3 + Math.random() * 8,
      color: colors[Math.floor(Math.random() * colors.length)],
    };
  }, []);

  // Accurate handwriting stroke paths for each letter
  const getLetterPaths = useCallback((w: number, h: number) => {
    // Helper to create smooth curve points
    const bezierPoints = (p0: StrokePoint, p1: StrokePoint, p2: StrokePoint, p3: StrokePoint, steps: number): StrokePoint[] => {
      const points: StrokePoint[] = [];
      for (let t = 0; t <= 1; t += 1 / steps) {
        const x = Math.pow(1-t, 3) * p0.x + 3 * Math.pow(1-t, 2) * t * p1.x + 3 * (1-t) * Math.pow(t, 2) * p2.x + Math.pow(t, 3) * p3.x;
        const y = Math.pow(1-t, 3) * p0.y + 3 * Math.pow(1-t, 2) * t * p1.y + 3 * (1-t) * Math.pow(t, 2) * p2.y + Math.pow(t, 3) * p3.y;
        points.push({ x, y });
      }
      return points;
    };

    const arcPoints = (cx: number, cy: number, rx: number, ry: number, startAngle: number, endAngle: number, steps: number): StrokePoint[] => {
      const points: StrokePoint[] = [];
      const angleStep = (endAngle - startAngle) / steps;
      for (let i = 0; i <= steps; i++) {
        const angle = startAngle + i * angleStep;
        points.push({ x: cx + rx * Math.cos(angle), y: cy + ry * Math.sin(angle) });
      }
      return points;
    };

    return {
      // S: Top curve right-to-left, then bottom curve left-to-right
      'S': [
        ...arcPoints(w * 0.5, h * 0.22, w * 0.35, h * 0.18, -0.3, Math.PI + 0.3, 15),
        ...arcPoints(w * 0.5, h * 0.78, w * 0.35, h * 0.18, Math.PI - 0.3, 2 * Math.PI + 0.3, 15),
      ],
      
      // E: Vertical down, back up, middle stroke, back, top stroke, back, bottom stroke
      'E': [
        // Vertical stroke (top to bottom)
        ...Array.from({ length: 12 }, (_, i) => ({ x: w * 0.2, y: h * 0.1 + (h * 0.8) * (i / 11) })),
        // Top horizontal (left to right)
        ...Array.from({ length: 8 }, (_, i) => ({ x: w * 0.2 + (w * 0.6) * (i / 7), y: h * 0.1 })),
        // Back to middle
        { x: w * 0.2, y: h * 0.5 },
        // Middle horizontal
        ...Array.from({ length: 6 }, (_, i) => ({ x: w * 0.2 + (w * 0.5) * (i / 5), y: h * 0.5 })),
        // Back to bottom
        { x: w * 0.2, y: h * 0.9 },
        // Bottom horizontal
        ...Array.from({ length: 8 }, (_, i) => ({ x: w * 0.2 + (w * 0.6) * (i / 7), y: h * 0.9 })),
      ],
      
      // N: Down left side, diagonal to top right, down right side
      'N': [
        // Left vertical (top to bottom)
        ...Array.from({ length: 10 }, (_, i) => ({ x: w * 0.15, y: h * 0.1 + (h * 0.8) * (i / 9) })),
        // Back to top
        { x: w * 0.15, y: h * 0.1 },
        // Diagonal (top-left to bottom-right)
        ...Array.from({ length: 12 }, (_, i) => ({ 
          x: w * 0.15 + (w * 0.7) * (i / 11), 
          y: h * 0.1 + (h * 0.8) * (i / 11) 
        })),
        // Right vertical (bottom to top)
        ...Array.from({ length: 10 }, (_, i) => ({ x: w * 0.85, y: h * 0.9 - (h * 0.8) * (i / 9) })),
      ],
      
      // I: Top serif, down, bottom serif
      'I': [
        // Top serif (left to right)
        ...Array.from({ length: 5 }, (_, i) => ({ x: w * 0.25 + (w * 0.5) * (i / 4), y: h * 0.1 })),
        // To center top
        { x: w * 0.5, y: h * 0.1 },
        // Vertical down
        ...Array.from({ length: 10 }, (_, i) => ({ x: w * 0.5, y: h * 0.1 + (h * 0.8) * (i / 9) })),
        // Bottom serif (left to right)
        { x: w * 0.25, y: h * 0.9 },
        ...Array.from({ length: 5 }, (_, i) => ({ x: w * 0.25 + (w * 0.5) * (i / 4), y: h * 0.9 })),
      ],
      
      // O: Full circle starting from top, clockwise
      'O': arcPoints(w * 0.5, h * 0.5, w * 0.4, h * 0.4, -Math.PI / 2, Math.PI * 1.5, 24),
      
      // R: Down, up, curve around, diagonal leg
      'R': [
        // Vertical stroke (top to bottom)
        ...Array.from({ length: 10 }, (_, i) => ({ x: w * 0.15, y: h * 0.1 + (h * 0.8) * (i / 9) })),
        // Back to top
        { x: w * 0.15, y: h * 0.1 },
        // Top horizontal
        ...Array.from({ length: 4 }, (_, i) => ({ x: w * 0.15 + (w * 0.35) * (i / 3), y: h * 0.1 })),
        // Curve around (bowl of R)
        ...arcPoints(w * 0.5, h * 0.3, w * 0.3, h * 0.2, -Math.PI / 2, Math.PI / 2, 10),
        // Back to stem at middle
        ...Array.from({ length: 3 }, (_, i) => ({ x: w * 0.5 - (w * 0.35) * (i / 2), y: h * 0.5 })),
        // Diagonal leg
        ...Array.from({ length: 8 }, (_, i) => ({ 
          x: w * 0.35 + (w * 0.5) * (i / 7), 
          y: h * 0.5 + (h * 0.4) * (i / 7) 
        })),
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
    const fontSize = Math.min(window.innerWidth * 0.12, 140);
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    ctx.font = `bold ${fontSize}px "Space Grotesk", sans-serif`;
    const totalWidth = ctx.measureText(text).width;
    const letterSpacing = fontSize * 0.08;
    
    const letterData: { char: string; x: number; width: number; path: StrokePoint[] }[] = [];
    let currentX = centerX - totalWidth / 2 - (letterSpacing * (letters.length - 1)) / 2;
    
    letters.forEach((letter) => {
      const width = ctx.measureText(letter).width;
      const paths = getLetterPaths(width, fontSize);
      const letterPath = paths[letter as keyof typeof paths] || [];
      
      const offsetPath = letterPath.map(p => ({
        x: currentX + p.x,
        y: centerY - fontSize / 2 + p.y
      }));
      
      letterData.push({ char: letter, x: currentX, width, path: offsetPath });
      currentX += width + letterSpacing;
    });
    
    // Create continuous path with all points
    const allPoints: { point: StrokePoint; letterIndex: number }[] = [];
    letterData.forEach((data, letterIndex) => {
      data.path.forEach(point => {
        allPoints.push({ point, letterIndex });
      });
    });
    
    let lastTime = performance.now();
    const totalDuration = 3000;
    const startTime = performance.now();
    const letterRevealProgress: number[] = new Array(letters.length).fill(0);
    
    const draw3DGlossyLetter = (
      letter: string,
      x: number,
      y: number,
      time: number
    ) => {
      ctx.save();
      ctx.font = `bold ${fontSize}px "Space Grotesk", sans-serif`;
      ctx.textBaseline = "middle";
      
      // Layer 1-6: Deep 3D extrusion shadows
      for (let i = 8; i >= 1; i--) {
        const shadowAlpha = 0.08 + (8 - i) * 0.03;
        ctx.fillStyle = `rgba(30, 10, 0, ${shadowAlpha})`;
        ctx.fillText(letter, x + i * 1.2, y + i * 1.8);
      }
      
      // Layer 7: Dark bronze base
      const darkBase = ctx.createLinearGradient(x, y - fontSize/2, x, y + fontSize/2);
      darkBase.addColorStop(0, "#8b4513");
      darkBase.addColorStop(0.5, "#654321");
      darkBase.addColorStop(1, "#3d2314");
      ctx.fillStyle = darkBase;
      ctx.fillText(letter, x + 3, y + 4);
      
      // Layer 8: Bronze mid layer
      const bronzeLayer = ctx.createLinearGradient(x, y - fontSize/2, x, y + fontSize/2);
      bronzeLayer.addColorStop(0, "#cd853f");
      bronzeLayer.addColorStop(0.3, "#b8860b");
      bronzeLayer.addColorStop(0.7, "#996515");
      bronzeLayer.addColorStop(1, "#8b4513");
      ctx.fillStyle = bronzeLayer;
      ctx.fillText(letter, x + 1.5, y + 2);
      
      // Layer 9: Main golden metallic gradient
      const mainGradient = ctx.createLinearGradient(x - fontSize * 0.2, y - fontSize/2, x + fontSize * 0.4, y + fontSize/2);
      mainGradient.addColorStop(0, "#fffacd");
      mainGradient.addColorStop(0.08, "#ffd700");
      mainGradient.addColorStop(0.2, "#ffb347");
      mainGradient.addColorStop(0.35, "#ff8c00");
      mainGradient.addColorStop(0.5, "#ff6b00");
      mainGradient.addColorStop(0.65, "#ff4500");
      mainGradient.addColorStop(0.8, "#dc143c");
      mainGradient.addColorStop(1, "#8b0000");
      ctx.fillStyle = mainGradient;
      ctx.fillText(letter, x, y);
      
      // Layer 10: Glass-like top reflection
      ctx.save();
      ctx.beginPath();
      ctx.rect(x - fontSize, y - fontSize/2 - 5, fontSize * 3, fontSize * 0.45);
      ctx.clip();
      
      const glassTop = ctx.createLinearGradient(x, y - fontSize/2, x, y - fontSize * 0.05);
      glassTop.addColorStop(0, "rgba(255, 255, 255, 0.95)");
      glassTop.addColorStop(0.2, "rgba(255, 255, 250, 0.8)");
      glassTop.addColorStop(0.5, "rgba(255, 250, 230, 0.5)");
      glassTop.addColorStop(0.8, "rgba(255, 230, 180, 0.2)");
      glassTop.addColorStop(1, "rgba(255, 200, 100, 0)");
      ctx.fillStyle = glassTop;
      ctx.fillText(letter, x, y);
      ctx.restore();
      
      // Layer 11: Animated specular highlight (glassy shine)
      const shineOffset = Math.sin(time * 0.0015) * fontSize * 0.3;
      const specGradient = ctx.createRadialGradient(
        x + fontSize * 0.2 + shineOffset, y - fontSize * 0.15, 0,
        x + fontSize * 0.2 + shineOffset, y - fontSize * 0.15, fontSize * 0.5
      );
      specGradient.addColorStop(0, "rgba(255, 255, 255, 0.7)");
      specGradient.addColorStop(0.3, "rgba(255, 255, 255, 0.3)");
      specGradient.addColorStop(0.6, "rgba(255, 255, 220, 0.1)");
      specGradient.addColorStop(1, "rgba(255, 220, 150, 0)");
      
      ctx.save();
      ctx.globalCompositeOperation = "overlay";
      ctx.fillStyle = specGradient;
      ctx.fillText(letter, x, y);
      ctx.restore();
      
      // Layer 12: Bottom reflection (glass effect)
      ctx.save();
      ctx.beginPath();
      ctx.rect(x - fontSize, y + fontSize * 0.15, fontSize * 3, fontSize * 0.4);
      ctx.clip();
      
      const bottomReflect = ctx.createLinearGradient(x, y + fontSize * 0.15, x, y + fontSize/2);
      bottomReflect.addColorStop(0, "rgba(255, 200, 150, 0)");
      bottomReflect.addColorStop(0.5, "rgba(255, 180, 100, 0.15)");
      bottomReflect.addColorStop(1, "rgba(255, 220, 180, 0.3)");
      ctx.fillStyle = bottomReflect;
      ctx.fillText(letter, x, y);
      ctx.restore();
      
      // Layer 13: Edge highlights
      ctx.strokeStyle = "rgba(255, 255, 240, 0.6)";
      ctx.lineWidth = 1;
      ctx.strokeText(letter, x - 0.5, y - 1);
      
      // Layer 14: Outer glow
      ctx.shadowColor = "rgba(255, 120, 0, 0.8)";
      ctx.shadowBlur = 35;
      ctx.fillStyle = "transparent";
      ctx.fillText(letter, x, y);
      
      ctx.restore();
    };
    
    const animate = (currentTime: number) => {
      const deltaTime = (currentTime - lastTime) / 1000;
      lastTime = currentTime;
      
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / totalDuration, 1);
      
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      
      const currentPointIndex = Math.floor(progress * allPoints.length);
      
      // Track reveal progress per letter
      let currentLetterIndex = -1;
      if (currentPointIndex < allPoints.length) {
        currentLetterIndex = allPoints[currentPointIndex].letterIndex;
      }
      
      // Update letter reveal status
      for (let i = 0; i < letterData.length; i++) {
        if (i < currentLetterIndex) {
          letterRevealProgress[i] = 1;
        } else if (i === currentLetterIndex) {
          // Calculate progress within this letter
          const letterStartIdx = allPoints.findIndex(p => p.letterIndex === i);
          let letterEndIdx = letterStartIdx;
          for (let j = allPoints.length - 1; j >= 0; j--) {
            if (allPoints[j].letterIndex === i) {
              letterEndIdx = j;
              break;
            }
          }
          const letterProgress = (currentPointIndex - letterStartIdx) / (letterEndIdx - letterStartIdx + 1);
          letterRevealProgress[i] = Math.max(letterRevealProgress[i], letterProgress);
        }
      }
      
      // Draw letters that are being revealed or completed
      letterData.forEach((data, index) => {
        if (letterRevealProgress[index] > 0.1) {
          draw3DGlossyLetter(data.char, data.x, centerY, currentTime);
        }
      });
      
      // Draw flame at current stroke position
      if (progress < 1 && currentPointIndex < allPoints.length) {
        const { point } = allPoints[currentPointIndex];
        const flameX = point.x;
        const flameY = point.y;
        
        // Add particles
        for (let i = 0; i < 12; i++) {
          particlesRef.current.push(createParticle(flameX, flameY));
        }
        
        // Large outer glow
        const outerGlow = ctx.createRadialGradient(flameX, flameY, 0, flameX, flameY, 90);
        outerGlow.addColorStop(0, "rgba(255, 220, 150, 0.7)");
        outerGlow.addColorStop(0.25, "rgba(255, 150, 50, 0.5)");
        outerGlow.addColorStop(0.5, "rgba(255, 80, 0, 0.3)");
        outerGlow.addColorStop(1, "rgba(200, 50, 0, 0)");
        ctx.fillStyle = outerGlow;
        ctx.beginPath();
        ctx.arc(flameX, flameY, 90, 0, Math.PI * 2);
        ctx.fill();
        
        // Main flame body
        const flame = ctx.createRadialGradient(flameX, flameY, 0, flameX, flameY, 40);
        flame.addColorStop(0, "rgba(255, 255, 255, 1)");
        flame.addColorStop(0.2, "rgba(255, 255, 220, 0.95)");
        flame.addColorStop(0.4, "rgba(255, 230, 150, 0.8)");
        flame.addColorStop(0.6, "rgba(255, 180, 80, 0.6)");
        flame.addColorStop(1, "rgba(255, 100, 30, 0)");
        ctx.fillStyle = flame;
        ctx.beginPath();
        ctx.arc(flameX, flameY, 40, 0, Math.PI * 2);
        ctx.fill();
        
        // White hot core
        const core = ctx.createRadialGradient(flameX, flameY, 0, flameX, flameY, 12);
        core.addColorStop(0, "rgba(255, 255, 255, 1)");
        core.addColorStop(0.5, "rgba(255, 255, 255, 0.9)");
        core.addColorStop(1, "rgba(255, 255, 240, 0)");
        ctx.fillStyle = core;
        ctx.beginPath();
        ctx.arc(flameX, flameY, 12, 0, Math.PI * 2);
        ctx.fill();
      }
      
      // Update particles
      particlesRef.current = particlesRef.current.filter(particle => {
        particle.life -= deltaTime / particle.maxLife;
        if (particle.life <= 0) return false;
        
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vy -= 0.3;
        particle.vx *= 0.95;
        particle.size *= 0.93;
        
        const alpha = particle.life * 0.85;
        const pg = ctx.createRadialGradient(particle.x, particle.y, 0, particle.x, particle.y, particle.size);
        pg.addColorStop(0, `rgba(${particle.color.r}, ${particle.color.g}, ${particle.color.b}, ${alpha})`);
        pg.addColorStop(0.5, `rgba(${particle.color.r}, ${particle.color.g}, ${particle.color.b}, ${alpha * 0.5})`);
        pg.addColorStop(1, `rgba(${particle.color.r}, ${particle.color.g}, ${particle.color.b}, 0)`);
        ctx.fillStyle = pg;
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