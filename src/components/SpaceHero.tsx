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
  const textCanvasRef = useRef<HTMLCanvasElement>(null);
  const [showVideo, setShowVideo] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>();
  const progressRef = useRef(0);

  const createParticle = useCallback((x: number, y: number): Particle => {
    const colors = [
      { r: 255, g: 220, b: 50 },  // Yellow
      { r: 255, g: 150, b: 0 },   // Orange
      { r: 255, g: 80, b: 0 },    // Red-orange
      { r: 255, g: 50, b: 0 },    // Red
      { r: 255, g: 255, b: 200 }, // White-yellow (hot core)
    ];
    
    return {
      x: x + (Math.random() - 0.5) * 8,
      y: y + (Math.random() - 0.5) * 8,
      vx: (Math.random() - 0.5) * 3,
      vy: -Math.random() * 4 - 2,
      life: 1,
      maxLife: 0.5 + Math.random() * 0.5,
      size: 3 + Math.random() * 6,
      color: colors[Math.floor(Math.random() * colors.length)],
    };
  }, []);

  const getTextPath = useCallback((ctx: CanvasRenderingContext2D, text: string, fontSize: number) => {
    ctx.font = `bold ${fontSize}px "Space Grotesk", sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    
    const metrics = ctx.measureText(text);
    const points: { x: number; y: number }[] = [];
    
    // Create temporary canvas to extract text pixels
    const tempCanvas = document.createElement("canvas");
    const tempCtx = tempCanvas.getContext("2d")!;
    tempCanvas.width = metrics.width + 40;
    tempCanvas.height = fontSize + 40;
    
    tempCtx.font = ctx.font;
    tempCtx.textAlign = "center";
    tempCtx.textBaseline = "middle";
    tempCtx.fillStyle = "white";
    tempCtx.fillText(text, tempCanvas.width / 2, tempCanvas.height / 2);
    
    const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
    const data = imageData.data;
    
    // Sample edge points from the text
    for (let y = 0; y < tempCanvas.height; y += 2) {
      for (let x = 0; x < tempCanvas.width; x += 2) {
        const i = (y * tempCanvas.width + x) * 4;
        if (data[i + 3] > 128) {
          // Check if it's an edge pixel
          const neighbors = [
            (y > 0) ? data[((y - 1) * tempCanvas.width + x) * 4 + 3] : 0,
            (y < tempCanvas.height - 1) ? data[((y + 1) * tempCanvas.width + x) * 4 + 3] : 0,
            (x > 0) ? data[(y * tempCanvas.width + x - 1) * 4 + 3] : 0,
            (x < tempCanvas.width - 1) ? data[(y * tempCanvas.width + x + 1) * 4 + 3] : 0,
          ];
          
          if (neighbors.some(n => n < 128)) {
            points.push({ x, y });
          }
        }
      }
    }
    
    // Sort points to create a path-like order (left to right, with some vertical grouping)
    points.sort((a, b) => {
      const xDiff = Math.floor(a.x / 10) - Math.floor(b.x / 10);
      if (xDiff !== 0) return xDiff;
      return a.y - b.y;
    });
    
    return { points, width: tempCanvas.width, height: tempCanvas.height };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const textCanvas = textCanvasRef.current;
    if (!canvas || !textCanvas) return;

    const ctx = canvas.getContext("2d")!;
    const textCtx = textCanvas.getContext("2d")!;
    
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
      
      textCanvas.width = window.innerWidth * dpr;
      textCanvas.height = window.innerHeight * dpr;
      textCanvas.style.width = `${window.innerWidth}px`;
      textCanvas.style.height = `${window.innerHeight}px`;
      textCtx.scale(dpr, dpr);
    };
    
    resize();
    window.addEventListener("resize", resize);

    const text = "SENIOR";
    const fontSize = Math.min(window.innerWidth * 0.15, 180);
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    const { points, width, height } = getTextPath(textCtx, text, fontSize);
    const offsetX = centerX - width / 2;
    const offsetY = centerY - height / 2;
    
    let lastTime = 0;
    const duration = 4000; // 4 seconds to write
    const startTime = performance.now();
    
    const animate = (currentTime: number) => {
      const deltaTime = (currentTime - lastTime) / 1000;
      lastTime = currentTime;
      
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      progressRef.current = progress;
      
      // Clear canvases
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      textCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      
      // Draw revealed text with gradient
      const currentPointIndex = Math.floor(progress * points.length);
      
      // Create clipping path for revealed text
      textCtx.save();
      textCtx.beginPath();
      
      for (let i = 0; i <= currentPointIndex && i < points.length; i++) {
        const point = points[i];
        textCtx.arc(offsetX + point.x, offsetY + point.y, 15, 0, Math.PI * 2);
      }
      textCtx.clip();
      
      // Draw gradient text
      const gradient = textCtx.createLinearGradient(0, centerY - fontSize / 2, 0, centerY + fontSize / 2);
      gradient.addColorStop(0, "#ffffff");
      gradient.addColorStop(0.3, "#ffd700");
      gradient.addColorStop(0.6, "#ff8c00");
      gradient.addColorStop(1, "#ff4500");
      
      textCtx.font = `bold ${fontSize}px "Space Grotesk", sans-serif`;
      textCtx.textAlign = "center";
      textCtx.textBaseline = "middle";
      textCtx.fillStyle = gradient;
      textCtx.shadowColor = "rgba(255, 100, 0, 0.8)";
      textCtx.shadowBlur = 30;
      textCtx.fillText(text, centerX, centerY);
      textCtx.restore();
      
      // Add particles at flame tip
      if (progress < 1 && currentPointIndex < points.length) {
        const currentPoint = points[currentPointIndex];
        const flameX = offsetX + currentPoint.x;
        const flameY = offsetY + currentPoint.y;
        
        // Add new particles
        for (let i = 0; i < 8; i++) {
          particlesRef.current.push(createParticle(flameX, flameY));
        }
        
        // Draw main flame glow at tip
        const flameGradient = ctx.createRadialGradient(flameX, flameY, 0, flameX, flameY, 60);
        flameGradient.addColorStop(0, "rgba(255, 255, 200, 0.9)");
        flameGradient.addColorStop(0.2, "rgba(255, 200, 50, 0.7)");
        flameGradient.addColorStop(0.5, "rgba(255, 100, 0, 0.4)");
        flameGradient.addColorStop(1, "rgba(255, 50, 0, 0)");
        
        ctx.fillStyle = flameGradient;
        ctx.beginPath();
        ctx.arc(flameX, flameY, 60, 0, Math.PI * 2);
        ctx.fill();
      }
      
      // Update and draw particles
      particlesRef.current = particlesRef.current.filter(particle => {
        particle.life -= deltaTime / particle.maxLife;
        if (particle.life <= 0) return false;
        
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vy -= 0.1; // Upward acceleration
        particle.vx *= 0.98;
        particle.size *= 0.97;
        
        const alpha = particle.life * 0.8;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        
        const particleGradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.size
        );
        particleGradient.addColorStop(0, `rgba(${particle.color.r}, ${particle.color.g}, ${particle.color.b}, ${alpha})`);
        particleGradient.addColorStop(1, `rgba(${particle.color.r}, ${particle.color.g}, ${particle.color.b}, 0)`);
        
        ctx.fillStyle = particleGradient;
        ctx.fill();
        
        return true;
      });
      
      // Continue animation or trigger video
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
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [createParticle, getTextPath]);

  return (
    <section className="relative h-screen w-full overflow-hidden bg-[#020205]">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#020205] via-[#0a0a15] to-[#020205]" />

      {/* Video background */}
      {showVideo && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 z-0"
        >
          <video
            autoPlay
            muted
            loop
            playsInline
            className="h-full w-full object-cover opacity-60"
          >
            <source
              src="https://cdn.pixabay.com/video/2020/05/25/40130-424930032_large.mp4"
              type="video/mp4"
            />
          </video>
          <div className="absolute inset-0 bg-gradient-to-t from-[#020205] via-transparent to-[#020205]/80" />
        </motion.div>
      )}

      {/* Flame particles canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-20 pointer-events-none"
      />
      
      {/* Text canvas */}
      <canvas
        ref={textCanvasRef}
        className="absolute inset-0 z-10"
      />

      {/* Subtitle */}
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

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: showVideo ? 1 : 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-xs tracking-widest text-muted-foreground">
            SCROLL
          </span>
          <div className="h-10 w-[1px] bg-gradient-to-b from-muted-foreground to-transparent" />
        </motion.div>
      </motion.div>

      {/* Bottom glow effect */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: animationComplete ? 0.5 : 0 }}
        transition={{ duration: 1 }}
        className="absolute bottom-0 left-1/2 h-[40%] w-[80%] -translate-x-1/2 z-0"
        style={{
          background:
            "radial-gradient(ellipse at bottom, rgba(255, 80, 0, 0.3) 0%, transparent 70%)",
        }}
      />
    </section>
  );
};

export default SpaceHero;