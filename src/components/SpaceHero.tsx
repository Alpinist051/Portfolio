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

const SpaceHero = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showVideo, setShowVideo] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>();

  const createParticle = useCallback((x: number, y: number): Particle => {
    const colors = [
      { r: 255, g: 220, b: 50 },
      { r: 255, g: 150, b: 0 },
      { r: 255, g: 80, b: 0 },
      { r: 255, g: 50, b: 0 },
      { r: 255, g: 255, b: 200 },
    ];
    
    return {
      x: x + (Math.random() - 0.5) * 15,
      y: y + (Math.random() - 0.5) * 30,
      vx: (Math.random() - 0.5) * 5,
      vy: -Math.random() * 6 - 3,
      life: 1,
      maxLife: 0.3 + Math.random() * 0.4,
      size: 5 + Math.random() * 10,
      color: colors[Math.floor(Math.random() * colors.length)],
    };
  }, []);

  // Letter stroke paths - defines how each letter is "written"
  const getLetterStrokes = useCallback(() => {
    return [
      // S - curved strokes
      { letter: "S", strokes: [0.4, 0.7, 1.0], curves: true },
      // E - horizontal strokes
      { letter: "E", strokes: [0.3, 0.5, 0.7, 1.0], curves: false },
      // N - diagonal stroke
      { letter: "N", strokes: [0.35, 0.7, 1.0], curves: false },
      // I - simple vertical
      { letter: "I", strokes: [0.5, 1.0], curves: false },
      // O - circular
      { letter: "O", strokes: [0.5, 1.0], curves: true },
      // R - with curve
      { letter: "R", strokes: [0.4, 0.7, 1.0], curves: true },
    ];
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
    const fontSize = Math.min(window.innerWidth * 0.14, 160);
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    ctx.font = `bold ${fontSize}px "Space Grotesk", sans-serif`;
    const totalWidth = ctx.measureText(text).width;
    const letterSpacing = 8;
    
    // Calculate each letter's position
    const letterPositions: { x: number; width: number }[] = [];
    let currentX = centerX - totalWidth / 2 - (letterSpacing * (letters.length - 1)) / 2;
    
    letters.forEach((letter) => {
      const width = ctx.measureText(letter).width;
      letterPositions.push({ x: currentX, width });
      currentX += width + letterSpacing;
    });
    
    let lastTime = 0;
    const letterDuration = 350; // ms per letter
    const totalDuration = letters.length * letterDuration;
    const startTime = performance.now();
    
    const drawGlossyLetter = (
      letter: string,
      x: number,
      y: number,
      progress: number,
      letterIndex: number,
      time: number
    ) => {
      if (progress <= 0) return;
      
      ctx.save();
      
      // Wave offset for 3D effect
      const waveOffset = Math.sin(time * 0.003 + letterIndex * 0.5) * 3;
      const waveY = y + waveOffset;
      
      // Create clip for stroke reveal (diagonal wipe for writing effect)
      const letterWidth = ctx.measureText(letter).width;
      const revealWidth = letterWidth * Math.min(progress * 1.2, 1);
      
      ctx.beginPath();
      // Diagonal clip path for natural writing feel
      ctx.moveTo(x - 10, waveY - fontSize);
      ctx.lineTo(x + revealWidth + 20, waveY - fontSize);
      ctx.lineTo(x + revealWidth - 10, waveY + fontSize);
      ctx.lineTo(x - 30, waveY + fontSize);
      ctx.closePath();
      ctx.clip();
      
      // Layer 1: Deep shadow for 3D depth
      ctx.font = `bold ${fontSize}px "Space Grotesk", sans-serif`;
      ctx.textBaseline = "middle";
      ctx.fillStyle = "rgba(80, 30, 0, 0.8)";
      ctx.fillText(letter, x + 6, waveY + 8);
      
      // Layer 2: Mid shadow
      ctx.fillStyle = "rgba(120, 50, 0, 0.6)";
      ctx.fillText(letter, x + 4, waveY + 5);
      
      // Layer 3: Base color with gradient
      const baseGradient = ctx.createLinearGradient(x, waveY - fontSize / 2, x, waveY + fontSize / 2);
      baseGradient.addColorStop(0, "#ffcc00");
      baseGradient.addColorStop(0.3, "#ff9500");
      baseGradient.addColorStop(0.5, "#ff6a00");
      baseGradient.addColorStop(0.7, "#ff4500");
      baseGradient.addColorStop(1, "#cc3300");
      
      ctx.fillStyle = baseGradient;
      ctx.fillText(letter, x + 2, waveY + 2);
      
      // Layer 4: Main glossy layer
      const glossyGradient = ctx.createLinearGradient(x, waveY - fontSize / 2, x, waveY + fontSize / 2);
      glossyGradient.addColorStop(0, "#fffbe6");
      glossyGradient.addColorStop(0.15, "#ffd700");
      glossyGradient.addColorStop(0.35, "#ffaa00");
      glossyGradient.addColorStop(0.5, "#ff8c00");
      glossyGradient.addColorStop(0.65, "#ff6600");
      glossyGradient.addColorStop(0.85, "#ff4400");
      glossyGradient.addColorStop(1, "#dd3300");
      
      ctx.fillStyle = glossyGradient;
      ctx.fillText(letter, x, waveY);
      
      // Layer 5: Top highlight shine (glossy effect)
      ctx.save();
      ctx.beginPath();
      ctx.rect(x - 20, waveY - fontSize / 2, letterWidth + 40, fontSize * 0.4);
      ctx.clip();
      
      const shineGradient = ctx.createLinearGradient(x, waveY - fontSize / 2, x, waveY);
      shineGradient.addColorStop(0, "rgba(255, 255, 255, 0.7)");
      shineGradient.addColorStop(0.5, "rgba(255, 255, 200, 0.3)");
      shineGradient.addColorStop(1, "rgba(255, 220, 100, 0)");
      
      ctx.fillStyle = shineGradient;
      ctx.fillText(letter, x, waveY);
      ctx.restore();
      
      // Layer 6: Edge highlight for extra depth
      ctx.strokeStyle = "rgba(255, 255, 200, 0.4)";
      ctx.lineWidth = 1;
      ctx.strokeText(letter, x - 1, waveY - 1);
      
      // Glow effect
      ctx.shadowColor = "rgba(255, 120, 0, 0.6)";
      ctx.shadowBlur = 25;
      ctx.fillStyle = "transparent";
      ctx.fillText(letter, x, waveY);
      
      ctx.restore();
      
      return { x: x + revealWidth, y: waveY };
    };
    
    const animate = (currentTime: number) => {
      const deltaTime = (currentTime - lastTime) / 1000;
      lastTime = currentTime;
      
      const elapsed = currentTime - startTime;
      const overallProgress = Math.min(elapsed / totalDuration, 1);
      
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      
      // Track flame position
      let flameX = 0;
      let flameY = centerY;
      let isWriting = false;
      
      // Draw each letter with staggered timing
      letters.forEach((letter, index) => {
        const letterStart = index * letterDuration;
        const letterProgress = Math.max(0, Math.min((elapsed - letterStart) / letterDuration, 1));
        
        if (letterProgress > 0) {
          const pos = letterPositions[index];
          const result = drawGlossyLetter(
            letter, 
            pos.x, 
            centerY, 
            letterProgress, 
            index,
            currentTime
          );
          
          // Update flame position to current writing edge
          if (letterProgress < 1 && letterProgress > 0) {
            const revealWidth = pos.width * Math.min(letterProgress * 1.2, 1);
            flameX = pos.x + revealWidth;
            flameY = centerY + Math.sin(currentTime * 0.003 + index * 0.5) * 3;
            isWriting = true;
          } else if (letterProgress >= 1 && index < letters.length - 1) {
            const nextProgress = Math.max(0, (elapsed - (index + 1) * letterDuration) / letterDuration);
            if (nextProgress === 0) {
              flameX = letterPositions[index + 1].x;
              flameY = centerY;
              isWriting = true;
            }
          }
        }
      });
      
      // Draw flame at writing position
      if (isWriting && overallProgress < 1) {
        // Add particles
        for (let i = 0; i < 8; i++) {
          particlesRef.current.push(createParticle(flameX, flameY));
        }
        
        // Main flame glow
        const flameGradient = ctx.createRadialGradient(flameX, flameY, 0, flameX, flameY, 70);
        flameGradient.addColorStop(0, "rgba(255, 255, 240, 0.95)");
        flameGradient.addColorStop(0.1, "rgba(255, 240, 150, 0.85)");
        flameGradient.addColorStop(0.3, "rgba(255, 180, 50, 0.6)");
        flameGradient.addColorStop(0.6, "rgba(255, 100, 0, 0.3)");
        flameGradient.addColorStop(1, "rgba(255, 50, 0, 0)");
        
        ctx.fillStyle = flameGradient;
        ctx.beginPath();
        ctx.arc(flameX, flameY, 70, 0, Math.PI * 2);
        ctx.fill();
        
        // Hot core
        const coreGradient = ctx.createRadialGradient(flameX, flameY, 0, flameX, flameY, 20);
        coreGradient.addColorStop(0, "rgba(255, 255, 255, 1)");
        coreGradient.addColorStop(0.6, "rgba(255, 255, 220, 0.8)");
        coreGradient.addColorStop(1, "rgba(255, 220, 150, 0)");
        
        ctx.fillStyle = coreGradient;
        ctx.beginPath();
        ctx.arc(flameX, flameY, 20, 0, Math.PI * 2);
        ctx.fill();
      }
      
      // Update and draw particles
      particlesRef.current = particlesRef.current.filter(particle => {
        particle.life -= deltaTime / particle.maxLife;
        if (particle.life <= 0) return false;
        
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vy -= 0.2;
        particle.vx *= 0.97;
        particle.size *= 0.95;
        
        const alpha = particle.life * 0.85;
        
        const particleGradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.size
        );
        particleGradient.addColorStop(0, `rgba(${particle.color.r}, ${particle.color.g}, ${particle.color.b}, ${alpha})`);
        particleGradient.addColorStop(0.5, `rgba(${particle.color.r}, ${particle.color.g}, ${particle.color.b}, ${alpha * 0.6})`);
        particleGradient.addColorStop(1, `rgba(${particle.color.r}, ${particle.color.g}, ${particle.color.b}, 0)`);
        
        ctx.fillStyle = particleGradient;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        
        return true;
      });
      
      if (overallProgress < 1 || particlesRef.current.length > 0) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setAnimationComplete(true);
        setTimeout(() => setShowVideo(true), 300);
      }
    };
    
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      window.removeEventListener("resize", resize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [createParticle, getLetterStrokes]);

  return (
    <section className="relative h-screen w-full overflow-hidden bg-[#020205]">
      <div className="absolute inset-0 bg-gradient-to-b from-[#020205] via-[#0a0a15] to-[#020205]" />

      {showVideo && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 z-0"
        >
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
        <p className="font-body text-lg tracking-widest text-muted-foreground sm:text-xl md:text-2xl">
          AI AUTOMATION SPECIALIST
        </p>
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