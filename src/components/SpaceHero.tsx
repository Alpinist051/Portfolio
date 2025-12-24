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
      x: x + (Math.random() - 0.5) * 10,
      y: y + (Math.random() - 0.5) * 40,
      vx: (Math.random() - 0.5) * 4,
      vy: -Math.random() * 5 - 2,
      life: 1,
      maxLife: 0.4 + Math.random() * 0.4,
      size: 4 + Math.random() * 8,
      color: colors[Math.floor(Math.random() * colors.length)],
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
    const fontSize = Math.min(window.innerWidth * 0.15, 180);
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    // Measure text width
    ctx.font = `bold ${fontSize}px "Space Grotesk", sans-serif`;
    const textMetrics = ctx.measureText(text);
    const textWidth = textMetrics.width;
    const textLeft = centerX - textWidth / 2;
    const textRight = centerX + textWidth / 2;
    
    let lastTime = 0;
    const duration = 2500; // 2.5 seconds - faster
    const startTime = performance.now();
    
    const animate = (currentTime: number) => {
      const deltaTime = (currentTime - lastTime) / 1000;
      lastTime = currentTime;
      
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Clear canvas
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      
      // Calculate flame position (left to right across text)
      const flameX = textLeft + progress * textWidth;
      const flameY = centerY;
      
      // Draw text with clipping mask (reveal from left to right)
      ctx.save();
      
      // Create clipping rectangle for revealed portion
      ctx.beginPath();
      ctx.rect(0, 0, flameX + 10, window.innerHeight);
      ctx.clip();
      
      // Draw gradient text
      const gradient = ctx.createLinearGradient(0, centerY - fontSize / 2, 0, centerY + fontSize / 2);
      gradient.addColorStop(0, "#ffffff");
      gradient.addColorStop(0.3, "#ffd700");
      gradient.addColorStop(0.6, "#ff8c00");
      gradient.addColorStop(1, "#ff4500");
      
      ctx.font = `bold ${fontSize}px "Space Grotesk", sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = gradient;
      ctx.shadowColor = "rgba(255, 100, 0, 0.8)";
      ctx.shadowBlur = 40;
      ctx.fillText(text, centerX, centerY);
      ctx.shadowBlur = 20;
      ctx.fillText(text, centerX, centerY);
      
      ctx.restore();
      
      // Add particles at flame position
      if (progress < 1) {
        for (let i = 0; i < 6; i++) {
          particlesRef.current.push(createParticle(flameX, flameY));
        }
        
        // Draw main flame glow at writing edge
        const flameGradient = ctx.createRadialGradient(flameX, flameY, 0, flameX, flameY, 80);
        flameGradient.addColorStop(0, "rgba(255, 255, 220, 0.95)");
        flameGradient.addColorStop(0.15, "rgba(255, 220, 100, 0.8)");
        flameGradient.addColorStop(0.4, "rgba(255, 120, 0, 0.5)");
        flameGradient.addColorStop(0.7, "rgba(255, 50, 0, 0.2)");
        flameGradient.addColorStop(1, "rgba(255, 30, 0, 0)");
        
        ctx.fillStyle = flameGradient;
        ctx.beginPath();
        ctx.arc(flameX, flameY, 80, 0, Math.PI * 2);
        ctx.fill();
        
        // Inner hot core
        const coreGradient = ctx.createRadialGradient(flameX, flameY, 0, flameX, flameY, 25);
        coreGradient.addColorStop(0, "rgba(255, 255, 255, 1)");
        coreGradient.addColorStop(0.5, "rgba(255, 255, 200, 0.8)");
        coreGradient.addColorStop(1, "rgba(255, 200, 100, 0)");
        
        ctx.fillStyle = coreGradient;
        ctx.beginPath();
        ctx.arc(flameX, flameY, 25, 0, Math.PI * 2);
        ctx.fill();
      }
      
      // Update and draw particles
      particlesRef.current = particlesRef.current.filter(particle => {
        particle.life -= deltaTime / particle.maxLife;
        if (particle.life <= 0) return false;
        
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vy -= 0.15;
        particle.vx *= 0.98;
        particle.size *= 0.96;
        
        const alpha = particle.life * 0.9;
        
        const particleGradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.size
        );
        particleGradient.addColorStop(0, `rgba(${particle.color.r}, ${particle.color.g}, ${particle.color.b}, ${alpha})`);
        particleGradient.addColorStop(0.6, `rgba(${particle.color.r}, ${particle.color.g}, ${particle.color.b}, ${alpha * 0.5})`);
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
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [createParticle]);

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

      {/* Main canvas for text and flames */}
      <canvas
        ref={canvasRef}
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